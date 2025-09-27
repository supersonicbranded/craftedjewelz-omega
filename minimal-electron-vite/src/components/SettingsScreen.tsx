import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

interface SettingsScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Settings {
  // General
  theme: 'dark' | 'light' | 'auto';
  language: string;
  autoSave: boolean;
  autoSaveInterval: number;

  // Design
  defaultUnits: 'mm' | 'inches' | 'cm';
  gridSize: number;
  snapToGrid: boolean;
  showRulers: boolean;
  showMeasurements: boolean;

  // Rendering
  renderQuality: 'low' | 'medium' | 'high' | 'ultra';
  antiAliasing: boolean;
  shadows: boolean;
  reflections: boolean;

  // Export
  defaultExportFormat: string;
  exportQuality: number;
  includeMetadata: boolean;

  // Professional
  materialPricing: boolean;
  laborCosts: boolean;
  markup: number;
  currency: string;

  // Privacy
  analytics: boolean;
  crashReporting: boolean;
  updateCheck: boolean;
}

export default function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<Settings>({
    // General
    theme: 'dark',
    language: 'en',
    autoSave: true,
    autoSaveInterval: 5,

    // Design
    defaultUnits: 'mm',
    gridSize: 20,
    snapToGrid: true,
    showRulers: true,
    showMeasurements: false,

    // Rendering
    renderQuality: 'high',
    antiAliasing: true,
    shadows: true,
    reflections: false,

    // Export
    defaultExportFormat: 'png',
    exportQuality: 90,
    includeMetadata: true,

    // Professional
    materialPricing: false,
    laborCosts: false,
    markup: 2.5,
    currency: 'USD',

    // Privacy
    analytics: false,
    crashReporting: true,
    updateCheck: true
  });

  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const sections = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'design', name: 'Design', icon: '🎨' },
    { id: 'rendering', name: 'Rendering', icon: '🖼️' },
    { id: 'export', name: 'Export', icon: '📤' },
    { id: 'professional', name: 'Professional', icon: '💼' },
    { id: 'privacy', name: 'Privacy', icon: '🔒' },
    { id: 'about', name: 'About', icon: 'ℹ️' }
  ];

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('craftedJewelz_settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const updateSetting = (key: keyof Settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setUnsavedChanges(true);
  };

  const saveSettings = () => {
    localStorage.setItem('craftedJewelz_settings', JSON.stringify(settings));
    setUnsavedChanges(false);
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      localStorage.removeItem('craftedJewelz_settings');
      window.location.reload();
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-yellow-300 font-medium mb-2">Theme</label>
        <select
          value={settings.theme}
          onChange={(e) => updateSetting('theme', e.target.value)}
          className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white"
        >
          <option value="dark">Dark</option>
          <option value="light">Light</option>
          <option value="auto">Auto (System)</option>
        </select>
      </div>

      <div>
        <label className="block text-yellow-300 font-medium mb-2">Language</label>
        <select
          value={settings.language}
          onChange={(e) => updateSetting('language', e.target.value)}
          className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="it">Italiano</option>
        </select>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <label className="text-yellow-300 font-medium">Auto Save</label>
          <p className="text-gray-400 text-sm">Automatically save your work</p>
        </div>
        <input
          type="checkbox"
          checked={settings.autoSave}
          onChange={(e) => updateSetting('autoSave', e.target.checked)}
          className="w-5 h-5 text-yellow-500 rounded"
        />
      </div>

      {settings.autoSave && (
        <div>
          <label className="block text-yellow-300 font-medium mb-2">
            Auto Save Interval: {settings.autoSaveInterval} minutes
          </label>
          <input
            type="range"
            min="1"
            max="30"
            value={settings.autoSaveInterval}
            onChange={(e) => updateSetting('autoSaveInterval', parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      )}
    </div>
  );

  const renderDesignSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-yellow-300 font-medium mb-2">Default Units</label>
        <select
          value={settings.defaultUnits}
          onChange={(e) => updateSetting('defaultUnits', e.target.value)}
          className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white"
        >
          <option value="mm">Millimeters (mm)</option>
          <option value="inches">Inches</option>
          <option value="cm">Centimeters (cm)</option>
        </select>
      </div>

      <div>
        <label className="block text-yellow-300 font-medium mb-2">
          Grid Size: {settings.gridSize}px
        </label>
        <input
          type="range"
          min="10"
          max="50"
          value={settings.gridSize}
          onChange={(e) => updateSetting('gridSize', parseInt(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        {[
          { key: 'snapToGrid', label: 'Snap to Grid', desc: 'Automatically align objects to grid' },
          { key: 'showRulers', label: 'Show Rulers', desc: 'Display measurement rulers on canvas' },
          { key: 'showMeasurements', label: 'Show Measurements', desc: 'Display object dimensions' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-yellow-300 font-medium">{label}</label>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings[key as keyof Settings] as boolean}
              onChange={(e) => updateSetting(key as keyof Settings, e.target.checked)}
              className="w-5 h-5 text-yellow-500 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderRenderingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-yellow-300 font-medium mb-2">Render Quality</label>
        <select
          value={settings.renderQuality}
          onChange={(e) => updateSetting('renderQuality', e.target.value)}
          className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white"
        >
          <option value="low">Low (Fast)</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="ultra">Ultra (Slow)</option>
        </select>
      </div>

      <div className="space-y-4">
        {[
          { key: 'antiAliasing', label: 'Anti-Aliasing', desc: 'Smooth object edges' },
          { key: 'shadows', label: 'Shadows', desc: 'Render object shadows' },
          { key: 'reflections', label: 'Reflections', desc: 'Render surface reflections' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-yellow-300 font-medium">{label}</label>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings[key as keyof Settings] as boolean}
              onChange={(e) => updateSetting(key as keyof Settings, e.target.checked)}
              className="w-5 h-5 text-yellow-500 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderProfessionalSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-yellow-300 font-medium mb-2">Currency</label>
        <select
          value={settings.currency}
          onChange={(e) => updateSetting('currency', e.target.value)}
          className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white"
        >
          <option value="USD">USD ($)</option>
          <option value="EUR">EUR (€)</option>
          <option value="GBP">GBP (£)</option>
          <option value="JPY">JPY (¥)</option>
          <option value="CAD">CAD ($)</option>
        </select>
      </div>

      <div>
        <label className="block text-yellow-300 font-medium mb-2">
          Markup: {settings.markup}x
        </label>
        <input
          type="range"
          min="1"
          max="5"
          step="0.1"
          value={settings.markup}
          onChange={(e) => updateSetting('markup', parseFloat(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="space-y-4">
        {[
          { key: 'materialPricing', label: 'Material Pricing', desc: 'Calculate material costs automatically' },
          { key: 'laborCosts', label: 'Labor Costs', desc: 'Include labor time in pricing' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between">
            <div>
              <label className="text-yellow-300 font-medium">{label}</label>
              <p className="text-gray-400 text-sm">{desc}</p>
            </div>
            <input
              type="checkbox"
              checked={settings[key as keyof Settings] as boolean}
              onChange={(e) => updateSetting(key as keyof Settings, e.target.checked)}
              className="w-5 h-5 text-yellow-500 rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-4">
          <span className="text-gray-900 text-2xl font-bold">CJ</span>
        </div>
        <h3 className="text-2xl font-bold text-white">CraftedJewelz Omega</h3>
        <p className="text-yellow-300">Version 1.0.0</p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4">
        <h4 className="text-yellow-300 font-medium mb-2">Professional Jewelry CAD Software</h4>
        <p className="text-gray-300 text-sm">
          CraftedJewelz Omega is a professional jewelry design application
          built for jewelers, designers, and artisans who demand precision and beauty.
        </p>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-400">Electron</span>
          <span className="text-white">30.5.1</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">React</span>
          <span className="text-white">18.3.1</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">Platform</span>
          <span className="text-white">{navigator.platform}</span>
        </div>
      </div>

      <div className="flex space-x-3">
        <button className="flex-1 bg-yellow-500/20 text-yellow-300 py-2 px-4 rounded-lg hover:bg-yellow-500/30 transition-colors">
          Check for Updates
        </button>
        <button className="flex-1 bg-gray-700 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
          View License
        </button>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'general': return renderGeneralSettings();
      case 'design': return renderDesignSettings();
      case 'rendering': return renderRenderingSettings();
      case 'professional': return renderProfessionalSettings();
      case 'about': return renderAboutSection();
      default: return <div className="text-gray-400">Section not implemented</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-gray-100">
      {/* Header */}
      <header className="px-6 py-4 border-b border-yellow-700/30 backdrop-blur-sm bg-gray-900/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('welcome')}
              className="text-yellow-300 hover:text-yellow-200 px-3 py-2 rounded-lg hover:bg-yellow-500/10 transition-all duration-200"
            >
              ← Back to Home
            </button>
            <div className="h-6 w-px bg-yellow-700/30"></div>
            <h1 className="text-xl font-semibold text-white">Settings</h1>
          </div>

          {unsavedChanges && (
            <div className="flex items-center space-x-3">
              <span className="text-yellow-300 text-sm">Unsaved changes</span>
              <button
                onClick={saveSettings}
                className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/80 border-r border-yellow-700/20 backdrop-blur-sm p-4">
          <div className="space-y-1">
            {sections.map(section => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-all duration-200 flex items-center space-x-3 ${
                  activeSection === section.id
                    ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-300'
                }`}
              >
                <span className="text-lg">{section.icon}</span>
                <span>{section.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-yellow-700/20">
            <button
              onClick={resetSettings}
              className="w-full text-red-400 hover:text-red-300 px-3 py-2 rounded-lg hover:bg-red-500/10 transition-all duration-200 text-sm"
            >
              Reset All Settings
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-y-auto">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-6 capitalize">
              {sections.find(s => s.id === activeSection)?.name} Settings
            </h2>
            {renderSection()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
