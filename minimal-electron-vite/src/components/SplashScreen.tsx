import React, { useEffect, useState } from 'react';
import './SplashScreen.css';

const SplashScreen: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onFinish();
    }, 2500); // 2.5s splash duration
    return () => clearTimeout(timer);
  }, [onFinish]);

  return visible ? (
    <div className="splash-screen">
      <div className="splash-logo animated">
        <img src="/build/appicon2.png" alt="CraftedJewelz Logo" />
        <h1 className="splash-title">CraftedJewelz</h1>
        <p className="splash-subtitle">The Next Generation Jewelry CAD Suite</p>
      </div>
      <div className="splash-loader">
        <div className="loader-bar"></div>
      </div>
    </div>
  ) : null;
};

export default SplashScreen;
