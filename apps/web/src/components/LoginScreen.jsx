import React, { useState } from "react";

export default function LoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // Placeholder — replace with real auth
    if (email && password) {
      onLoginSuccess();
    } else {
      alert("Enter valid credentials.");
    }
  };

  return (
    <div style={styles.card}>
      <h1 style={styles.title}>Welcome Back 👋</h1>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={styles.input}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleLogin} style={styles.button}>
        Login
      </button>
    </div>
  );
}

const styles = {
  card: {
    maxWidth: "400px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  title: { fontSize: "2rem", marginBottom: "1.5rem" },
  input: {
    width: "100%",
    padding: "0.75rem",
    marginBottom: "1rem",
    border: "1px solid #444",
    borderRadius: "6px",
    background: "#1e1e1e",
    color: "#fff"
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    border: "none",
    borderRadius: "6px",
    background: "#007acc",
    color: "#fff",
    fontSize: "1rem",
    cursor: "pointer"
  }
};
