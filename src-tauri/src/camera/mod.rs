// mod manager;
mod visca;

use std::mem;

use log::{info, warn, error};
use tokio_util::sync::CancellationToken;
pub use visca::Codec as ViscaCodec;

use futures::{Sink, SinkExt, Stream, StreamExt as _};
use tokio::sync::{mpsc, oneshot};

pub enum CameraCommand {
    PanTiltAbsolute(u16, u16),
    PanTiltRelative(u16, u16),
    ZoomAbsolute(u16),
}

pub type CommandResult = Result<CommandHandle, CommandError>;

#[derive(Debug)]
pub struct CommandHandle {
    id: CommandId,
    socket: u8,
    completion: oneshot::Receiver<CompletionResult>,
}

impl CommandHandle {
    pub async fn wait(self) -> CompletionResult {
        self.completion.await.unwrap()
    }
}

struct InternalCommandHandle {
    id: CommandId,
    completion: oneshot::Sender<CompletionResult>,
}

#[derive(Debug)]
pub enum CompletionResult {
    Cancelled,
    Finished,
    Error,
}

impl From<visca::CompletionMessageKind> for CompletionResult {
    fn from(value: visca::CompletionMessageKind) -> Self {
        match value {
            visca::CompletionMessageKind::Cancelled => Self::Cancelled,
            visca::CompletionMessageKind::Completed => Self::Finished,
            visca::CompletionMessageKind::CommandNotExecutable => Self::Error,
        }
    }
}

#[derive(Debug)]
pub enum CommandError {
    SyntaxError,
    CommandBufferFull,
    CommandNotExecutable,
    ShuttingDown,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
struct CommandId(u8);

#[derive(Default)]
struct CommandIdIter(u8);

impl CommandIdIter {
    fn next(&mut self) -> CommandId {
        let out = self.0;
        self.0 = self.0.wrapping_add(1);
        CommandId(out)
    }
}

pub fn camera(cancel: CancellationToken) -> (ViscaCamera, ViscaCameraWorker) {
    let (command_send, command_recv) = mpsc::channel(2);
    let (cancel_send, cancel_recv) = mpsc::channel(2);
    (
        ViscaCamera {
            cancel: cancel.child_token(),
            command_send,
            cancel_send,
        },
        ViscaCameraWorker {
            worker_state: WorkerState::default(),
            command_recv,
            cancel_recv,
            running_commands_by_socket: [const { None }; 2],
            cmd_id_iter: CommandIdIter::default(),
        }
    )
}

pub struct ViscaCamera {
    cancel: CancellationToken,
    command_send: mpsc::Sender<(CameraCommand, oneshot::Sender<Result<CommandHandle, CommandError>>)>,
    cancel_send: mpsc::Sender<CommandHandle>,
}

impl ViscaCamera {
    pub async fn command(&self, command: CameraCommand) -> Result<CommandHandle, CommandError> {
        let (send, recv) = oneshot::channel();
        self.command_send.send((command, send)).await.unwrap();
        recv.await.map_err(|_| CommandError::ShuttingDown).flatten()
    }

    pub async fn cancel_command(&self, handle: CommandHandle) {
        self.cancel_send.send(handle).await.unwrap();
    }
}

#[derive(Debug, Default)]
enum WorkerState {
    #[default]
    Idle,
    WaitingForAck(oneshot::Sender<Result<CommandHandle, CommandError>>),
}

pub struct ViscaCameraWorker {
    worker_state: WorkerState,
    command_recv: mpsc::Receiver<(CameraCommand, oneshot::Sender<Result<CommandHandle, CommandError>>)>,
    cancel_recv: mpsc::Receiver<CommandHandle>,
    running_commands_by_socket: [Option<InternalCommandHandle>; 2],
    cmd_id_iter: CommandIdIter,
}

impl ViscaCameraWorker {
    /// range: 0x01 (slow) - 0x18 (high)
    const PAN_SPEED: u8 = 0x05;
    /// range: 0x01 (slow) - 0x14 (high)
    const TILT_SPEED: u8 = 0x05;

    async fn run<Io>(
        &mut self,
        io: Io,
        cancel: CancellationToken,
    ) -> Result<(), visca::Error>
    where
        Io: Stream<Item = Result<visca::CameraMessage, visca::Error>>,
        Io: Sink<visca::Command, Error = visca::Error>,
        Io: Send + 'static,
    {
        let mut io = std::pin::pin!(io);
        loop {
            tokio::select! {
                _ = cancel.cancelled() => {
                    break;
                }
                response = io.next() => {
                    match response {
                        None => todo!(),
                        Some(Err(e)) => return Err(e),
                        Some(Ok(m)) => {
                            match m {
                                visca::CameraMessage::Response(r) => {
                                    self.handle_response_from_camera(r);
                                }
                                visca::CameraMessage::Completion(c) => {
                                    self.handle_completion_from_camera(c);
                                }
                            }
                        }
                    };
                }
                cmd = self.command_recv.recv(), if matches!(self.worker_state, WorkerState::Idle) => {
                    let Some((cmd, notify)) = cmd else {
                        info!("[worker] command_recv hangup, exiting");
                        break;
                    };
                    let visca_command = match cmd {
                        CameraCommand::PanTiltAbsolute(pan, tilt) => {
                            visca::Command::PanTiltAbsolute {
                                pan,
                                tilt,
                                pan_speed: Self::PAN_SPEED,
                                tilt_speed: Self::TILT_SPEED,
                            }
                        }
                        CameraCommand::PanTiltRelative(pan, tilt) => {
                            visca::Command::PanTiltRelative {
                                pan,
                                tilt,
                                pan_speed: Self::PAN_SPEED,
                                tilt_speed: Self::TILT_SPEED,
                            }
                        }
                        CameraCommand::ZoomAbsolute(zoom) => {
                            visca::Command::ZoomAbsolute(zoom)
                        }
                    };
                    io.send(visca_command).await?;
                    self.worker_state = WorkerState::WaitingForAck(notify);
                }
                handle = self.cancel_recv.recv(), if matches!(self.worker_state, WorkerState::Idle) => {
                    let Some(handle) = handle else {
                        info!("[worker] cancel_recv hangup, exiting");
                        break;
                    };
                    let socket = handle.socket;
                    if matches!(self.running_commands_by_socket[usize::from(socket)], Some(ref running) if running.id == handle.id) {
                        io.send(visca::Command::Cancel(socket)).await?;
                    }
                }
            }
        }
        Ok(())
    }

    fn handle_response_from_camera(&mut self, response: visca::ResponseMessage) {
        match mem::replace(&mut self.worker_state, WorkerState::Idle) {
            WorkerState::Idle => {
                error!("got a response message when not waiting for one");
            }
            WorkerState::WaitingForAck(notify) => {
                match response {
                    visca::ResponseMessage::Accepted(socket) => {
                        let task_id = self.cmd_id_iter.next();
                        let (completion_send, completion_recv) = oneshot::channel();
                        let internal_handle = InternalCommandHandle {
                            id: task_id,
                            completion: completion_send,
                        };
                        let handle = CommandHandle {
                            id: task_id,
                            socket,
                            completion: completion_recv,
                        };
                        self.running_commands_by_socket[usize::from(socket)] = Some(internal_handle);
                        let _ = notify.send(Ok(handle));
                    }
                    visca::ResponseMessage::SyntaxError => {
                        let _ = notify.send(Err(CommandError::SyntaxError));
                    }
                    visca::ResponseMessage::CommandBufferFull => {
                        let _ = notify.send(Err(CommandError::CommandBufferFull));
                    }
                    visca::ResponseMessage::NoSocket(s) => {
                        // this should not be returned in response to a command request
                        error!("got message NoSocket({s})");
                    }
                }
            }
        }
    }

    fn handle_completion_from_camera(&mut self, completion: visca::CompletionMessage) {
        let socket = completion.socket;
        let handle = self.running_commands_by_socket[usize::from(socket)].take();
        match handle {
            None => {
                warn!("received completion for socket {socket}, but it is not running a command");
            }
            Some(h) => {
                let _ = h.completion.send(CompletionResult::from(completion.kind));
            }
        }
    }
}
