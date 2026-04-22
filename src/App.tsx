import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { waitForCameraCommand, CameraCommand } from "./ffi";
import { PortSwitcher } from "./PortSwitcher";

function App() {
  const [response, setResponse] = useState("");
  const [cmd, setCmd] = useState("");

  async function command(command: CameraCommand) {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    console.log(`sending ${cmd}`);
    setResponse(await waitForCameraCommand(command));
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <PortSwitcher></PortSwitcher>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          command(JSON.parse(cmd));
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setCmd(e.currentTarget.value)}
          placeholder="Enter a command..."
        />
        <button type="submit">Send</button>
      </form>
      <button onClick={(_e) => {
        command({"PanTiltAbsolute": [0, 0]});
      }}>PanTiltAbsolute(0, 0)</button>
      <button onClick={(_e) => {
        command({"ZoomAbsolute": 0});
      }}>ZoomAbsolute(0)</button>
      <p>{response}</p>
    </main>
  );
}

export default App;
