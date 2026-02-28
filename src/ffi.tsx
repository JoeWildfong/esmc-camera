import { invoke } from "@tauri-apps/api/core";

export type CameraCommand = PanTiltAbsolute | PanTiltRelative | ZoomAbsolute;

type PanTiltAbsolute = {
    "PanTiltAbsolute": [number, number]
};

type PanTiltRelative = {
    "PanTiltRelative": [number, number]
};

type ZoomAbsolute = {
    "ZoomAbsolute": number
};

export async function setCameraConnection(port: string) {
    await invoke("set_camera_connection", {"port": port});
}

export async function consoleCameraConnection() {
    await invoke("console_camera_connection");
}

export async function disconnectCamera() {
    await invoke("disconnect_camera");
}

export async function sendCameraCommand(command: CameraCommand): Promise<string> {
    return await invoke("send_camera_command", {"command": command});
}

export async function waitForCameraCommand(command: CameraCommand): Promise<string> {
    return await invoke("wait_for_camera_command", {"command": command});
}
