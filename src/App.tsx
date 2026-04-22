import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { waitForCameraCommand, CameraCommand } from './ffi';
import PortSwitcher from './PortSwitcher';

function App() {
  const [response, setResponse] = useState('');
  const [cmd, setCmd] = useState('');

  async function sendCommand(command: CameraCommand) {
    setResponse(await waitForCameraCommand(command));
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank" rel="noreferrer">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <PortSwitcher />

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          sendCommand(JSON.parse(cmd));
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setCmd(e.currentTarget.value)}
          placeholder="Enter a command..."
        />
        <button type="submit">Send</button>
      </form>
      <button
        type="button"
        onClick={() => {
          sendCommand({ PanTiltAbsolute: [0, 0] });
        }}
      >
        PanTiltAbsolute(0, 0)
      </button>
      <button
        type="button"
        onClick={() => {
          sendCommand({ ZoomAbsolute: 0 });
        }}
      >
        ZoomAbsolute(0)
      </button>
      <p>{response}</p>
    </main>
  );
}

export default App;
