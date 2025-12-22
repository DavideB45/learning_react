import { useState } from "react";
import { Link } from "react-router-dom";

function RobotSetup() {
  const [robotType, setRobotType] = useState("");
  const [algorithm, setAlgorithm] = useState("");

  const canExecute = robotType && algorithm;

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Robot Setup</h1>

      {/* Robot selection */}
      <div style={{ marginBottom: "1rem" }}>
        <label>
          Robot type:
          <br />
          <select
            value={robotType}
            onChange={(e) => setRobotType(e.target.value)}
          >
            <option value="">-- select a robot --</option>
            <option value="ur5">UR5</option>
            <option value="tiago">TIAGo</option>
            <option value="turtlebot">TurtleBot</option>
          </select>
        </label>
      </div>

      {/* Algorithm selection */}
      <div style={{ marginBottom: "1.5rem" }}>
        <label>
          Algorithm:
          <br />
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="">-- select an algorithm --</option>
            <option value="pick_place">Pick & Place</option>
            <option value="navigation">Navigation</option>
            <option value="inspection">Inspection</option>
          </select>
        </label>
      </div>

      {/* Execute button */}
      <Link to="/executing">
        <button disabled={!canExecute}>
          Execute
        </button>
      </Link>
    </div>
  );
}

export default RobotSetup;
