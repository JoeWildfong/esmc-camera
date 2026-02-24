use std::sync::Mutex;

use crate::camera::{CameraCommand, CommandResult, ViscaCamera};

pub mod camera;

static CAMERA: Mutex<Option<ViscaCamera>> = Mutex::new(None);

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn camera_command(cmd: CameraCommand) -> Result<CommandResult, ()> {
    // let cam = CAMERA.try_lock().map_err(|_| ())?.as_ref().ok_or(())?;
    // Ok(cam.command(cmd).await)
    todo!()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
