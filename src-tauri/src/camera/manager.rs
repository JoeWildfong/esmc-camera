use std::{future::Future};

use log::error;
use tauri::async_runtime;
use tokio::sync::{RwLock, watch};
use tokio_serial::{SerialStream, frame::SerialFramed};
use tokio_util::sync::CancellationToken;

use crate::camera::{CameraCommand, CommandError, CommandHandle, ViscaCamera, visca};

type WorkerHandle = async_runtime::JoinHandle<Result<(), visca::Error>>;

pub enum ManagerState {
    Connected(String),
    Disconnected,
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
            None => Err(CommandError::NoCamera),
        }
    }

    pub async fn run(&self) {
        let mut target_state = self.recv_target_state.clone();
        let mut worker: Option<WorkerHandle> = None;

        async fn wait_if_some<F: Future>(fut: Option<F>) -> F::Output {
            match fut {
                Some(f) => f.await,
                None => std::future::pending().await,
            }
        }

        loop {
            tokio::select! {
                () = self.cancel.cancelled() => {
                    return;
                }
                e = target_state.changed() => {
                    if let Err(_) = e {
                        return;
                    }
                    let target = target_state.borrow_and_update();
                    let (s, w) = match self.go_to_state(&target).await {
                        Some((s, w)) => (Some(s), Some(w)),
                        None => (None, None),
                    };
                    *self.cam.write().await = s;
                    worker = w;
                }
                exit = wait_if_some(worker.as_mut()) => {
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
                    let target = target_state.borrow();
                    let (s, w) = match self.go_to_state(&target).await {
                        Some((s, w)) => (Some(s), Some(w)),
                        None => (None, None),
                    };
                    *self.cam.write().await = s;
                    worker = w;
                }
            }
        }
    }

    async fn go_to_state(&self, target: &ManagerState) -> Option<(ViscaCamera, WorkerHandle)> {
        match target {
            ManagerState::Disconnected => {
                let _ = self.real_state.send(ManagerState::Disconnected);
                None
            },
            ManagerState::Connected(s) => {
                match SerialStream::open(&tokio_serial::new(s, 9600)) {
                    Ok(io) => {
                        let codec = SerialFramed::new(io, super::visca::Codec::new(1));
                        let cancel_token = self.cancel.child_token();
                        let (cam, mut cam_worker) = super::camera();
                        Some((cam, async_runtime::spawn(async move {
                            cam_worker.run(codec, cancel_token).await
                        })))
                    }
                    Err(_) => {
                        todo!();
                    }
                }
            }
        }
    }
}