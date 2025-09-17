import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' }
];

const themes = [
  { value: 'dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'gold', label: 'Gold' }
];

const SettingsPanel: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [theme, setTheme] = React.useState<string>(localStorage.getItem('cj_theme') || 'dark');

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setTheme(newTheme);
    localStorage.setItem('cj_theme', newTheme);
    document.body.setAttribute('data-theme', newTheme);
  };

  React.useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  const [fontSize, setFontSize] = React.useState('md');
  const [contrast, setContrast] = React.useState('normal');
  const [dyslexiaFont, setDyslexiaFont] = React.useState(false);
  const [avatar, setAvatar] = React.useState('');
  const [displayName, setDisplayName] = React.useState('User');
  const [cloudStatus, setCloudStatus] = React.useState('Synced');

  // Simulate cloud sync status
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCloudStatus(Math.random() > 0.8 ? 'Syncing...' : 'Synced');
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`settings-panel p-6 bg-gray-900 rounded-xl shadow-lg text-gray-100 max-w-md mx-auto mt-12 font-${fontSize} ${contrast === 'high' ? 'bg-black text-yellow-300' : ''} ${dyslexiaFont ? 'cj-dyslexia-font' : ''}`}
      role="region" aria-label="Settings Panel" tabIndex={0}>
      <h2 className="text-2xl font-bold mb-4 text-yellow-400">{t('menu_account')} / Settings</h2>
      {/* User profile quick-edit */}
      <div className="flex items-center mb-6" aria-label="User Profile">
        <input
          type="text"
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          className="bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1 mr-4"
          aria-label="Edit display name"
          title="Edit display name"
        />
        <input
          type="url"
          value={avatar}
          onChange={e => setAvatar(e.target.value)}
          className="bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1 mr-2"
          aria-label="Avatar URL"
          title="Set avatar URL"
          placeholder="Avatar URL"
        />
        {avatar && <img src={avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-yellow-600" />}
      </div>
      {/* Accessibility options */}
      <label className="block mb-4" aria-label="Language Selector">
        <span className="font-semibold text-yellow-300">Language:</span>
        <select value={i18n.language} onChange={handleLanguageChange} className="ml-2 bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1" aria-label="Select language" tabIndex={0} title="Change application language">
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.label}</option>
          ))}
        </select>
      </label>
      <label className="block mb-4" aria-label="Theme Selector">
        <span className="font-semibold text-yellow-300">Theme:</span>
        <select value={theme} onChange={handleThemeChange} className="ml-2 bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1" aria-label="Select theme" tabIndex={0} title="Change application theme">
          {themes.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </label>
      <label className="block mb-4" aria-label="Font Size Selector">
        <span className="font-semibold text-yellow-300">Font Size:</span>
        <select value={fontSize} onChange={e => setFontSize(e.target.value)} className="ml-2 bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1" aria-label="Select font size" tabIndex={0} title="Change font size">
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </label>
      <label className="block mb-4" aria-label="Contrast Selector">
        <span className="font-semibold text-yellow-300">Contrast:</span>
        <select value={contrast} onChange={e => setContrast(e.target.value)} className="ml-2 bg-gray-800 text-yellow-300 border border-yellow-600 rounded px-2 py-1" aria-label="Select contrast" tabIndex={0} title="Change contrast">
          <option value="normal">Normal</option>
          <option value="high">High Contrast</option>
        </select>
      </label>
      <label className="block mb-4" aria-label="Dyslexia Font Toggle">
        <span className="font-semibold text-yellow-300">Dyslexia-friendly Font:</span>
        <input type="checkbox" checked={dyslexiaFont} onChange={e => setDyslexiaFont(e.target.checked)} className="ml-2" aria-label="Toggle dyslexia font" title="Toggle dyslexia-friendly font" />
      </label>
      {/* Cloud sync status */}
      <div className="mb-4 flex items-center" aria-label="Cloud Sync Status">
        <span className="font-semibold text-yellow-300 mr-2">Cloud Sync:</span>
        <span className={`px-2 py-1 rounded ${cloudStatus === 'Synced' ? 'bg-green-700 text-green-100' : 'bg-yellow-700 text-yellow-100'}`}>{cloudStatus}</span>
      </div>
      <div className="mt-8 flex flex-col gap-2">
        <a href="/docs/plugins-onboarding-guide.md" target="_blank" rel="noopener" className="text-blue-400 underline">Help & Onboarding Guide</a>
        <a href="/docs/feedback-system.md" target="_blank" rel="noopener" className="text-blue-400 underline">Submit Feedback</a>
        <a href="/docs/community-support.md" target="_blank" rel="noopener" className="text-blue-400 underline">Community & Support</a>
        <a href="/docs/tutorials.md" target="_blank" rel="noopener" className="text-blue-400 underline">Tutorials</a>
      </div>
      <div className="mt-6 text-xs text-gray-400" aria-label="Welcome message" title="Welcome message">{t('welcome')}</div>
    </div>
  );
};

export default SettingsPanel;
