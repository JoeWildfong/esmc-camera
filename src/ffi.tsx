import { invoke } from '@tauri-apps/api/core';

export type CommandOptions = {
  waitFor?: "received" | "finished";
}

export interface Camera {
  panTiltAbsolute(pan: number, tilt: number, options?: CommandOptions): Promise<void>;
  panTiltRelative(pan: number, tilt: number, options?: CommandOptions): Promise<void>;
  zoomAbsolute(zoom: number, options?: CommandOptions): Promise<void>;
  sendCommand(command: CameraCommand): Promise<void>;
  waitForCommand(command: CameraCommand): Promise<void>;
  queryPanTiltPosition(): Promise<[number, number]>;
  queryZoomPosition(): Promise<number>;
  disconnect(): Promise<void>;
  connectSerial(port: string): Promise<void>;
  connectTcp(ip: string, port: number): Promise<void>;
}

const commandFromOptions = (options?: CommandOptions): string => {
  switch (options?.waitFor) {
    case "received":
      return "send_camera_command";
    case undefined:
    case "finished":
      return "wait_for_camera_command";
  }
}

export const ViscaCamera: Camera = {
  async panTiltAbsolute(pan, tilt, options) {
    await invoke(commandFromOptions(options), { command: { PanTiltAbsolute: [pan, tilt] } });
  },

  async panTiltRelative(pan, tilt, options) {
    return await invoke(commandFromOptions(options), { command: { PanTiltRelative: [pan, tilt] } });
  },

  async zoomAbsolute(zoom, options) {
    return await invoke(commandFromOptions(options), { command: { ZoomAbsolute: zoom } });
  },

  async sendCommand(command) {
    return await invoke("send_camera_command", { command });
  },

  async waitForCommand(command) {
    return await invoke("wait_for_camera_command", { command });
  },

  async queryPanTiltPosition() {
    return await invoke("query_pan_tilt_position");
  },

  async queryZoomPosition() {
    return await invoke("query_zoom_position");
  },

  async disconnect() {
    return await invoke('disconnect_camera');
  },

  async connectSerial(port: string) {
    return await invoke('set_camera_connection', { port });
  },

  async connectTcp(ip: string, port: number) {
    return await invoke('tcp_camera_connection', { ip, port });
  },
}

export type CameraCommand = PanTiltAbsolute | PanTiltRelative | ZoomAbsolute;

type PanTiltAbsolute = {
  PanTiltAbsolute: [number, number]
};

type PanTiltRelative = {
  PanTiltRelative: [number, number]
};

type ZoomAbsolute = {
  ZoomAbsolute: number
};

export async function setCameraConnection(port: string) {
  await invoke('set_camera_connection', { port });
}

export async function disconnectCamera() {
  await invoke('disconnect_camera');
}

export async function sendCameraCommand(command: CameraCommand): Promise<string> {
  return await invoke('send_camera_command', { command });
}

export async function waitForCameraCommand(command: CameraCommand): Promise<string> {
  return await invoke('wait_for_camera_command', { command });
}
