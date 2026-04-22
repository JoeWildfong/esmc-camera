import React, { useState } from "react";
import { SerialPortType, useAvailablePorts } from "./useAvailablePorts";
import { consoleCameraConnection, disconnectCamera, setCameraConnection } from "./ffi";
import Bluetooth from "./icons/Bluetooth";
import Pci from "./icons/Pci";
import Ghost from "./icons/Ghost";
import Usb from "./icons/Usb";
import Select from "react-select";
import { ActionMeta } from "react-select";

type PortTypeIconProps = {
    type: SerialPortType | "Ghost"
}

const PortTypeIcon: React.FC<PortTypeIconProps> = ({type}) => {
    if (typeof type === 'object' && Object.hasOwn(type, "UsbPort")) {
        return <Usb />
    }
    switch (type) {
        case "BluetoothPort":
            return <Bluetooth />;
        case "PciPort":
            return <Pci />;
        case "Unknown":
            return <></>;
        case "Ghost":
            return <Ghost />;
    }
}

type PortOption = {
    value: string,
    label: string,
    type: SerialPortType | "Ghost",
};

export const PortSwitcher = () => {
    let availablePorts = useAvailablePorts();
    const consolePort: PortOption = {
        value: "consolePort",
        label: "Console (Debug)",
        type: "Unknown",
    };
    const disconnect: PortOption = {
        value: "disconnect",
        label: "Disconnect",
        type: "Unknown",
    };
    const [currentPort, setCurrentPort] = useState<PortOption>(disconnect);

    const portChanged = (port: PortOption | null, actionMeta: ActionMeta<PortOption>) => {
        if (actionMeta.action !== "select-option") {
            return;
        }
        if (port === null) {
            return;
        }
        if (port.value === consolePort.value) {
            consoleCameraConnection();
        }
        else if (port.value === disconnect.value) {
            disconnectCamera();
        }
        else {
            setCameraConnection(port.value);
        }
        setCurrentPort(port);
    };

    // if the currently selected port is not available, still show it in the list as a "ghost"
    // the camera manager will reopen the port if/when it becomes available again
    let ghostPort: PortOption[] = [];
    if (![consolePort.value, disconnect.value, ...availablePorts.map(port => port.port_name)].includes(currentPort.value)) {
        ghostPort.push({value: currentPort.value, label: currentPort.label, type: "Ghost"});
    }

    const options: PortOption[] = [
        ...ghostPort,
        ...availablePorts.map(port => {
            return {value: port.port_name, label: port.port_name, type: port.port_type};
        }),
        consolePort,
        disconnect
    ];

    return (
        <Select<PortOption, false>
            onChange={portChanged}
            formatOptionLabel={(data, _meta) => {
                return (
                    <>
                        <PortTypeIcon type={data.type} />{data.label}
                    </>
                );
            }}
            value={currentPort}
            options={options}
            isClearable={false}
            isSearchable={false}
        />
    );
}