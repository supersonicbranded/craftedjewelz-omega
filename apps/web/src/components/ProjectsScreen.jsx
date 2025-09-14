import React from "react";

export default function ProjectsScreen() {
  return (
    <div>
      <h1>📂 Projects</h1>
      <p>Select or create a new jewelry design project.</p>
      <div style={styles.actions}>
        <button style={styles.button}>➕ New Project</button>
        <button style={styles.buttonSecondary}>📁 Open Recent</button>
      </div>
    </div>
  );
}

const styles = {
  actions: { marginTop: "1.5rem", display: "flex", gap: "1rem" },
  button: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "6px",
    background: "#007acc",
    color: "#fff",
    cursor: "pointer"
  },
  buttonSecondary: {
    padding: "0.75rem 1.5rem",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "transparent",
    color: "#f0f0f0",
    cursor: "pointer"
  }
};
