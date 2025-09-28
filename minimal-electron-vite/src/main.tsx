import React from "react";
import ReactDOM from "react-dom/client";
import PluginMarketplace from "./components/PluginMarketplace";
import "./index.css";

function App() {
  return <PluginMarketplace />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
