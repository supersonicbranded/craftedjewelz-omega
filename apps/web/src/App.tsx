import React, { useEffect, useState } from "react";
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';
import SplashScreen from "./components/SplashScreen";
import Onboarding from "./components/Onboarding";
import Welcome from "./screens/welcome";
import MenuBar from "./components/MenuBar";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleSplashFinish = () => setShowSplash(false);
  useEffect(() => {
    if (!showSplash) setShowOnboarding(true);
  }, [showSplash]);

  const handleOnboardingFinish = () => setShowOnboarding(false);

  if (showSplash) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }
  if (showOnboarding) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }
  return (
    <I18nextProvider i18n={i18n}>
      <div className="matrixgold-theme min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100">
        <MenuBar />
        <Welcome />
      </div>
    </I18nextProvider>
  );
}

export default App;
