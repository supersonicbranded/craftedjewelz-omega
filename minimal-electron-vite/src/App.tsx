import React, { useEffect, useState } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";
import WelcomeScreen from "./components/WelcomeScreen";
import JewelryDesignCanvas from "./components/JewelryDesignCanvas";
import SettingsPanel from "./components/SettingsPanel";
import MenuBar from "./components/MenuBar";

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');

  const handleSplashFinish = () => setShowSplash(false);
  useEffect(() => {
    if (!showSplash) setShowOnboarding(true);
  }, [showSplash]);

  const handleOnboardingFinish = () => setShowOnboarding(false);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  if (showOnboarding) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'design':
        return <JewelryDesignCanvas />;
      case 'templates':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Templates Coming Soon</h2></div>;
      case 'settings':
        return <SettingsPanel />;
      case 'marketplace':
        return <div className="p-8 text-center"><h2 className="text-2xl text-white">Marketplace Coming Soon</h2></div>;
      default:
        return <WelcomeScreen onNavigate={navigateToScreen} />;
    }
  };

  // Debug: Log to make sure we're passing the function
  console.log('navigateToScreen function:', typeof navigateToScreen);

  return (
    <I18nextProvider i18n={i18n}>
      <div className="matrixgold-theme min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100">
        <MenuBar />
        {renderCurrentScreen()}
      </div>
    </I18nextProvider>
  );
}

export default App;
