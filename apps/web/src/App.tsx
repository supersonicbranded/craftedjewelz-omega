import React, { useEffect, useState } from "react";
import Splash from "./screens/Splash";
import Welcome from "./screens/Welcome";

export default function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  if (!ready) return <Splash />;

  return <Welcome />;
}
