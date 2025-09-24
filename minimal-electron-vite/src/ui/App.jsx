import React, { useEffect, useState } from "react";
import Welcome from "./Welcome.jsx";
import "./styles.css";

export default function App() {
  const [pong, setPong] = useState("");

  useEffect(() => {
    // Health check from preload
    if (window.crafted?.ping) {
      window.crafted.ping().then(setPong).catch(() => {});
    }
  }, []);

  return (
    <div className="app-shell">
      <Welcome engineStatus={pong} />
    </div>
  );
}
