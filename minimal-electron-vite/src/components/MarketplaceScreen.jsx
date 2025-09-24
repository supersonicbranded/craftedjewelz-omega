import React from "react";

export default function MarketplaceScreen() {
  return (
    <div>
      <h1>🛒 Marketplace</h1>
      <p>Explore plugins, gemstone libraries, and design packs.</p>
      <div style={styles.grid}>
        <div style={styles.card}>💎 Gemstone Pack</div>
        <div style={styles.card}>📐 CAD Templates</div>
        <div style={styles.card}>🎨 Theme Skins</div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    marginTop: "1.5rem",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem"
  },
  card: {
    padding: "1rem",
    backgroundColor: "#2a2a2a",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
    transition: "0.3s",
    boxShadow: "0 5px 15px rgba(0,0,0,0.4)"
  }
};
