import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import WelcomeScreen from "./components/WelcomeScreen";
import "./index.css";

type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'design':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Design Canvas Coming Soon</h2><button onClick={() => navigateToScreen('welcome')} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Back to Welcome</button></div>;
      case 'settings':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Settings Coming Soon</h2><button onClick={() => navigateToScreen('welcome')} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Back to Welcome</button></div>;
      case 'templates':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Templates Coming Soon</h2><button onClick={() => navigateToScreen('welcome')} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Back to Welcome</button></div>;
      case 'marketplace':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Marketplace Coming Soon</h2><button onClick={() => navigateToScreen('welcome')} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Back to Welcome</button></div>;
      default:
        return <WelcomeScreen onNavigate={navigateToScreen} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950">
      {renderScreen()}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
