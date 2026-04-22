import { Channel, invoke } from "@tauri-apps/api/core";
import { useSyncExternalStore } from "react";

export type SerialPortInfo = {
    port_name: string,
    port_type: SerialPortType,
};

export type SerialPortType = {"UsbPort": object} | "PciPort" | "BluetoothPort" | "Unknown";

let availablePorts: SerialPortInfo[] = [];

const availablePortsSubscribe = (callback: () => void) => {
    const channel = new Channel((message: SerialPortInfo[]) => {
        availablePorts = message;
        callback();
    });

    invoke("stream_available_ports", { channel: channel });

    return () => {};
}

const getAvailablePorts = (): SerialPortInfo[] => {
    return availablePorts;
}


export const useAvailablePorts = () => {
    const hook = useSyncExternalStore(availablePortsSubscribe, getAvailablePorts);
    return hook;
}