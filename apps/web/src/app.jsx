import React from "react";

export default function App() {
  return (
    <div className="welcome-screen" style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>✨ Welcome to CraftedJewelz ✨</h1>
        <p style={styles.subtitle}>
          Design • Customize • Create — Your Jewelry, Your Way
        </p>

        <div style={styles.actions}>
          <button style={styles.button}>Create New Project</button>
          <button style={styles.buttonSecondary}>Open Recent</button>
          <button style={styles.buttonSecondary}>Marketplace</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(145deg, #121212, #1e1e1e)",
    fontFamily: "Inter, sans-serif",
    color: "#f0f0f0"
  },
  card: {
    padding: "3rem",
    borderRadius: "12px",
    backgroundColor: "#2a2a2a",
    boxShadow: "0 10px 40px rgba(0,0,0,0.6)",
    textAlign: "center",
    width: "600px"
  },
  title: {
    fontSize: "2.5rem",
    marginBottom: "1rem"
  },
  subtitle: {
    fontSize: "1.25rem",
    marginBottom: "2rem",
    color: "#b3b3b3"
  },
  actions: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem"
  },
  button: {
    padding: "0.75rem 1.5rem",
    border: "none",
    borderRadius: "8px",
    backgroundColor: "#007acc",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer"
  },
  buttonSecondary: {
    padding: "0.75rem 1.5rem",
    border: "1px solid #444",
    borderRadius: "8px",
    backgroundColor: "transparent",
    color: "#f0f0f0",
    fontSize: "1rem",
    cursor: "pointer"
  }
};
