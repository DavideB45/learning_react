import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:3001/api/config";

function RobotSetup() {
  const [robotType, setRobotType] = useState("");
  const [algorithm, setAlgorithm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved configuration on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const response = await fetch(API_URL);
        const config = await response.json();
        setRobotType(config.robotType || "");
        setAlgorithm(config.algorithm || "");
      } catch (error) {
        console.log("Could not load configuration:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  // Save configuration whenever it changes
  useEffect(() => {
    async function saveConfig() {
      if (!isLoading && (robotType || algorithm)) {
        try {
          await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ robotType, algorithm })
          });
        } catch (error) {
          console.error("Failed to save configuration:", error);
        }
      }
    }
    saveConfig();
  }, [robotType, algorithm, isLoading]);

  const canExecute = robotType && algorithm;

  if (isLoading) {
    return <div style={{ padding: "2rem" }}>Loading configuration...</div>;
  }

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
            <option value="franka">Franka</option>
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
        <button disabled={!canExecute}>Execute</button>
      </Link>
    </div>
  );
}

export default RobotSetup;
