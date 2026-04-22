use std::{future::Future, time::Duration};

use futures::{Stream, StreamExt};
use log::error;
use tauri::async_runtime;
use tokio::sync::{RwLock, watch};
use tokio_serial::{SerialStream, frame::SerialFramed};
use tokio_stream::wrappers::WatchStream;
use tokio_util::sync::CancellationToken;

use crate::camera::{CameraCommand, CommandError, CommandHandle, ViscaCamera, visca};

type WorkerHandle = async_runtime::JoinHandle<Result<(), visca::Error>>;

#[derive(Debug, Clone)]
pub enum ManagerState {
    Connected(String),
    Disconnected,
    Debug,
}

pub struct Manager {
    cancel: CancellationToken,
    send_target_state: watch::Sender<ManagerState>,
    recv_target_state: watch::Receiver<ManagerState>,
    real_state: watch::Sender<ManagerState>,
    cam: RwLock<Option<ViscaCamera>>
}

impl Manager {
    pub fn new() -> Self {
        let (send_target_state, recv_target_state) = watch::channel(ManagerState::Disconnected);
        let (send_status, _recv_status) = watch::channel(ManagerState::Disconnected);
        let cancel = CancellationToken::new();

        Self {
            cancel,
            send_target_state,
            recv_target_state,
            real_state: send_status,
            cam: RwLock::new(None),
        }
    }

    pub fn set_target_state(&self, target: ManagerState) {
        let _ = self.send_target_state.send(target);
    }

    pub async fn command(&self, cmd: CameraCommand) -> Result<CommandHandle, CommandError> {
        match self.cam.read().await.as_ref() {
            Some(c) => c.command(cmd).await,
            None => Err(CommandError::Disconnected),
        }
    }

    pub async fn run(&self) {
        let target_state = WatchStream::new(self.recv_target_state.clone());
        let mut worker: Option<WorkerHandle> = None;

        let connected = buffer_latest(target_state.map(async |target| {
            println!("going to state {target:?}");
            self.go_to_state(&target).await
        }));
        let mut connected = std::pin::pin!(connected);
        loop {
            tokio::select! {
                () = self.cancel.cancelled() => {
                    return;
                }
                v = connected.next() => {
                    let Some(new_state) = v else {
                        return;
                    };
                    let (cam, work) = match new_state {
                        Some((c, w)) => (Some(c), Some(w)),
                        None => (None, None),
                    };
                    *self.cam.write().await = cam;
                    if let Some(previous) = std::mem::replace(&mut worker, work) {
                        previous.abort();
                    }

                }
                exit = wait_if_some(worker.as_mut()) => {
                    println!("worker died");
                    let _ = self.real_state.send(ManagerState::Disconnected);
                    match exit {
                        Err(e) => {
                            error!("[manager] tokio error {e}");
                        }
                        Ok(Err(e)) => {
                            error!("[manager] visca error {e}");
                        }
                        Ok(Ok(())) => {
                            return;
                        }
                    }
                    // resend current target state to try reconnecting
                    self.send_target_state.send_modify(|_| {});
                }
            }
        }
    }

    async fn go_to_state(&self, target: &ManagerState) -> Option<(ViscaCamera, WorkerHandle)> {
        let result = match target {
            ManagerState::Disconnected => {
                None
            },
            ManagerState::Connected(s) => {
                loop {
                    match SerialStream::open(&tokio_serial::new(s, 9600)) {
                        Ok(io) => {
                            let codec = SerialFramed::new(io, super::visca::Codec::new(1));
                            let cancel_token = self.cancel.child_token();
                            let (cam, mut cam_worker) = super::camera();
                            break Some((cam, async_runtime::spawn(async move {
                                cam_worker.run(codec, cancel_token).await
                            })));
                        }
                        Err(_) => {
                            println!("failed to open {s:?}, retrying in 1s");
                            tokio::time::sleep(Duration::from_secs(1)).await;
                        }
                    }
                }
            }
            ManagerState::Debug => {
                let codec = debug::DebugIo::new();
                let cancel_token = self.cancel.child_token();
                let (cam, mut cam_worker) = super::camera();
                Some((cam, async_runtime::spawn(async move {
                    cam_worker.run(codec, cancel_token).await
                })))
            }
        };
        println!("in state {target:?}");
        let _ = self.real_state.send_replace(target.clone());
        result
    }
}

impl Default for Manager {
    fn default() -> Self {
        Self::new()
    }
}

async fn wait_if_some<F: Future>(fut: Option<F>) -> F::Output {
    match fut {
        Some(f) => f.await,
        None => std::future::pending().await,
    }
}

/// Races futures in a stream against the stream producing another future.
/// The latest future from the stream is polled alongside the stream's `next()`:
///     - if the future resolves before the next future is available, the resolved value is yielded
///     - if a new future arrives first, the previous future is dropped and nothing is yielded
/// see: https://github.com/rust-lang/futures-rs/issues/2544
fn buffer_latest<S, T>(stream: S) -> impl Stream<Item = T>
where
    S: Stream,
    S::Item: Future<Output = T>,
{
    async_stream::stream! {
        let mut in_progress = None;
        let mut stream = std::pin::pin!(stream);
        loop {
            tokio::select! {
                fut = stream.next() => {
                    let Some(fut) = fut else {
                        break;
                    };
                    in_progress = Some(fut);
                }
                val = wait_if_some(in_progress.take()) => {
                    yield val;
                }
            }
        }
    }
}

mod debug {
    use std::task::Poll;

    use futures::{Sink, Stream};
    use tokio::io::{Stdin, Stdout};
    use tokio_util::codec::{FramedRead, FramedWrite, LinesCodec, LinesCodecError};

    use crate::camera::visca::{self, CameraMessage};

    pin_project_lite::pin_project! {
        pub(super) struct DebugIo {
            #[pin]
            stdin: FramedRead<Stdin, LinesCodec>,

            #[pin]
            stdout: FramedWrite<Stdout, LinesCodec>,
        }
    }

    impl DebugIo {
        pub(super) fn new() -> Self {
            Self {
                stdin: FramedRead::new(tokio::io::stdin(), LinesCodec::new()),
                stdout: FramedWrite::new(tokio::io::stdout(), LinesCodec::new()),
            }
        }

        fn convert_err(lines_err: LinesCodecError) -> visca::Error {
            match lines_err {
                LinesCodecError::Io(e) => visca::Error::Io(e),
                LinesCodecError::MaxLineLengthExceeded => visca::Error::Io(std::io::Error::other("max line length exceeded"))
            }
        }
    }

    impl Stream for DebugIo {
        type Item = Result<CameraMessage, visca::Error>;

        fn poll_next(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> std::task::Poll<Option<Self::Item>> {
            let Poll::Ready(line) = self.project().stdin.poll_next(cx) else {
                return Poll::Pending;
            };
            let Some(line) = line else {
                return Poll::Ready(None);
            };

            Poll::Ready(Some(match line.unwrap().as_str() {
                "accepted 1" => Ok(visca::CameraMessage::Response(visca::ResponseMessage::Accepted(1))),
                "accepted 2" => Ok(visca::CameraMessage::Response(visca::ResponseMessage::Accepted(2))),
                "completed 1" => Ok(visca::CameraMessage::Completion(visca::CompletionMessage {
                    kind: visca::CompletionMessageKind::Completed,
                    socket: 1,
                })),
                "completed 2" => Ok(visca::CameraMessage::Completion(visca::CompletionMessage {
                    kind: visca::CompletionMessageKind::Completed,
                    socket: 2,
                })),
                _ => Err(visca::Error::Io(std::io::Error::other("simulated io error"))),
            }))
        }
    }

    impl Sink<visca::Command> for DebugIo {
        type Error = visca::Error;

        fn start_send(self: std::pin::Pin<&mut Self>, item: visca::Command) -> Result<(), Self::Error> {
            let string = serde_json::to_string(&item).unwrap();
            self.project().stdout.start_send(string).map_err(Self::convert_err)
        }

        fn poll_ready(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
            <FramedWrite<Stdout, LinesCodec> as Sink<String>>::poll_ready(self.project().stdout, cx).map_err(Self::convert_err)
        }

        fn poll_close(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
            <FramedWrite<Stdout, LinesCodec> as Sink<String>>::poll_close(self.project().stdout, cx).map_err(Self::convert_err)
        }

        fn poll_flush(self: std::pin::Pin<&mut Self>, cx: &mut std::task::Context<'_>) -> Poll<Result<(), Self::Error>> {
            <FramedWrite<Stdout, LinesCodec> as Sink<String>>::poll_flush(self.project().stdout, cx).map_err(Self::convert_err)
        }
    }
}
