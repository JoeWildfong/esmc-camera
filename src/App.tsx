import { useState } from 'react';
import './App.css';
import PortSwitcher from './PortSwitcher';
import { CommandButton } from './CommandButton';
import { PresetButton } from './PresetButton';

const App = () => {
  const [xSpeed, setXSpeed] = useState<number>(1);
  const [ySpeed, setYSpeed] = useState<number>(1);

  const upButton = <CommandButton command={{"PanTiltRelative": [0, ySpeed]}} key="up">Up</CommandButton>;
  const downButton = <CommandButton command={{"PanTiltRelative": [0, -ySpeed]}} key="down">Down</CommandButton>;
  const leftButton = <CommandButton command={{"PanTiltRelative": [-xSpeed, 0]}} key="left">Left</CommandButton>;
  const rightButton = <CommandButton command={{"PanTiltRelative": [xSpeed, 0]}} key="right">Right</CommandButton>;

  // eslint-disable
  const layout = [
    <PresetButton key="preset-1" />,  <PresetButton key="preset-2" />,  <PresetButton key="preset-3" />,
    <PresetButton key="preset-4" />,  <PresetButton key="preset-5" />,  <PresetButton key="preset-6" />,
    <PresetButton key="preset-7" />,  <PresetButton key="preset-8" />,  <PresetButton key="preset-9" />,
    <PresetButton key="preset-10" />, <PresetButton key="preset-11" />, <PresetButton key="preset-12" />,
    <PresetButton key="preset-13" />, <PresetButton key="preset-14" />, <PresetButton key="preset-15" />,
    <PresetButton key="preset-16" />, upButton,                         <PresetButton key="preset-17" />,
    leftButton,                       downButton,                       rightButton,
  ];
  // eslint-enable

  return (
    <main className="container">
      <PortSwitcher />
      <div>
        <label className="speed-control">Horizontal Speed ({xSpeed})
          <input type="range" min={1} value={xSpeed} onChange={(e) => setXSpeed(e.target.valueAsNumber)} />
        </label>
        <label className="speed-control">Vertical Speed ({ySpeed})
          <input type="range" min={1} value={ySpeed} onChange={(e) => setYSpeed(e.target.valueAsNumber)} />
        </label>
      </div>
      <div className="grid-container">
        {...layout}
      </div>
    </main>
  );
}

export default App;
