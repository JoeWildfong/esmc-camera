use std::{sync::LazyLock, time::Duration};

use tauri::{async_runtime, ipc};
use tokio_serial::SerialPortInfo;

use crate::camera::CameraCommand;

pub mod camera;

static CAMERA: LazyLock<camera::Manager> = LazyLock::new(camera::Manager::new);

#[tauri::command]
async fn stream_available_ports(
    channel: ipc::Channel<Vec<SerialPortInfo>>,
) -> Result<(), tauri::Error> {
    #[cfg(feature = "flaky_fake_serial_port")]
    let mut flaky_counter = [false; 5].into_iter().chain([true; 5].into_iter()).cycle();
    let mut last_list = None;
    loop {
        #[cfg_attr(not(feature = "flaky_fake_serial_port"), expect(unused_mut))]
        if let Ok(mut ports) = tokio_serial::available_ports() {
            #[cfg(feature = "flaky_fake_serial_port")]
            {
                if flaky_counter.next().unwrap() {
                    ports.push(SerialPortInfo {
                        port_name: "flaky fake port".to_owned(),
                        port_type: serialport::SerialPortType::PciPort,
                    });
                }
            }
            if last_list.as_ref().is_none_or(|last| last == &ports) {
                last_list = Some(ports.clone());
                channel.send(ports)?;
            }
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }
}

#[tauri::command]
async fn set_camera_connection(port: String) {
    CAMERA.set_target_state(camera::ManagerState::Connected(port));
}

#[tauri::command]
async fn console_camera_connection() {
    println!("setting camera to console mode");
    CAMERA.set_target_state(camera::ManagerState::Debug);
}

#[tauri::command]
async fn disconnect_camera() {
    CAMERA.set_target_state(camera::ManagerState::Disconnected);
}

#[tauri::command]
async fn send_camera_command(command: CameraCommand) -> Result<(), camera::CommandError> {
    CAMERA.command(command).await?;
    Ok(())
}

#[tauri::command]
async fn wait_for_camera_command(command: CameraCommand) -> Result<camera::CompletionResult, camera::CommandError> {
    let handle = CAMERA.command(command).await?;
    Ok(handle.wait().await)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    async_runtime::spawn(CAMERA.run());
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            stream_available_ports,
            set_camera_connection,
            console_camera_connection,
            disconnect_camera,
            send_camera_command,
            wait_for_camera_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
