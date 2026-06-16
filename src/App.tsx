import { useState } from 'react';
import './App.css';
import { waitForCameraCommand, CameraCommand } from './ffi';
import PortSwitcher from './PortSwitcher';
import Button from './Button';

type CommandButton = {
  label: string;
  command: CameraCommand | null;
  hold?: (index: number) => void;
};

const  App = () => {
  const [response, setResponse] = useState('');
  const [xSpeed, setXSpeed] = useState<number>(1);
  const [ySpeed, setYSpeed] = useState<number>(1);


  const sendCommand = async (command: CameraCommand) => {
    setResponse(await waitForCameraCommand(command));
  }

  const buttons: CommandButton[] = [
    {
      label: 'PanTiltAbsolute(0, 0)',
      command: {
        PanTiltAbsolute: [0, 0]
      }
    },
    {
      label: 'ZoomAbsolute(0)',
      command: {
        ZoomAbsolute: 0
      }
    }
  ];

  buttons.push(...(new Array(25) as CommandButton[]).fill({
    label: '',
    command: null,
    hold: (index) => console.log(`Button ${index+1} Held`),
  }));

  buttons[16] = {
    label: 'Up',
    command: {
      PanTiltRelative: [0, ySpeed]
    }
  };

  buttons[19] = {
    label: 'Down',
    command: {
      PanTiltRelative: [0, -ySpeed]
    }
  };

  buttons[20] = {
    label: 'Right',
    command: {
      PanTiltRelative: [xSpeed, 0]
    }
  };

  buttons[18] = {
    label: 'Left',
    command: {
      PanTiltRelative: [-xSpeed, 0]
    }
  };

  return (
    <main className="container">
      <PortSwitcher />
      {response && <p>{response}</p>}
      <div>
        <label className="speed-control">Horizontal Speed ({xSpeed})
          <input type="range" min={1} value={xSpeed} onChange={(e) => setXSpeed(e.target.valueAsNumber)} />
        </label>
        <label className="speed-control">Vertical Speed ({ySpeed})
          <input type="range" min={1} value={ySpeed} onChange={(e) => setYSpeed(e.target.valueAsNumber)} />
        </label>
      </div>
      <div className="grid-container">
        {buttons.map((btn, key) => (
          <Button
            key={`btn-${key}`}
            onClick={() => {
              if (btn.command) {
                sendCommand(btn.command);
              } else {
                console.log(`Button ${key+1} Clicked`);
              }
            }}
            onLongPress={btn.hold ? () => btn.hold!(key) : undefined}
          >
            {btn.label || `Button ${key + 1}`}
          </Button>
        ))}
      </div>
    </main>
  );
}

export default App;
