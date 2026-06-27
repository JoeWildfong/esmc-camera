use std::{net::{IpAddr, SocketAddr}, sync::LazyLock, time::Duration};

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
    let mut flaky_counter = [[false; 5], [true; 5]].concat().into_iter().cycle();
    let mut last_list = None;
    loop {
        if let Ok(ports) = tokio_serial::available_ports() {
            #[cfg(feature = "flaky_fake_serial_port")]
            let ports = {
                let mut ports = ports;
                if flaky_counter.next().unwrap() {
                    ports.push(SerialPortInfo {
                        port_name: "flaky fake port".to_owned(),
                        port_type: serialport::SerialPortType::PciPort,
                    });
                }
                ports
            };
            if last_list.as_ref() != Some(&ports) {
                last_list = Some(ports.clone());
                channel.send(ports)?;
            }
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }
}

#[tauri::command]
async fn set_camera_connection(port: String) {
    CAMERA.set_target_state(camera::ManagerState::SerialPort(port));
}

#[tauri::command]
async fn tcp_camera_connection(ip: String, port: u16) {
    if let Ok(addr) = ip.parse::<IpAddr>() {
        CAMERA.set_target_state(camera::ManagerState::TcpPort(SocketAddr::from((addr, port))));
    }
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
async fn wait_for_camera_command(
    command: CameraCommand,
) -> Result<camera::CompletionResult, camera::CommandError> {
    let handle = CAMERA.command(command).await?;
    Ok(handle.wait().await)
}

#[tauri::command]
async fn query_pan_tilt_position() -> Result<(u16, u16), camera::CommandError> {
    CAMERA.with_camera(async |cam| cam.query_pan_tilt_position().await).await.flatten()
}

#[tauri::command]
async fn query_zoom_position() -> Result<u16, camera::CommandError> {
    CAMERA.with_camera(async |cam| cam.query_zoom_position().await).await.flatten()
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
            tcp_camera_connection,
            disconnect_camera,
            send_camera_command,
            wait_for_camera_command,
            query_pan_tilt_position,
            query_zoom_position,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
