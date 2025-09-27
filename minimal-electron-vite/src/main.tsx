import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import WelcomeScreen from "./components/WelcomeScreen";
import DesignCanvas from "./components/DesignCanvas";
import TemplatesScreen from "./components/TemplatesScreen";
import MarketplaceScreen from "./components/MarketplaceScreen";
import SettingsScreen from "./components/SettingsScreen";
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
        return <DesignCanvas onNavigate={navigateToScreen} />;
      case 'settings':
        return <SettingsScreen onNavigate={navigateToScreen} />;
      case 'templates':
        return <TemplatesScreen onNavigate={navigateToScreen} />;
      case 'marketplace':
        return <MarketplaceScreen onNavigate={navigateToScreen} />;
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
