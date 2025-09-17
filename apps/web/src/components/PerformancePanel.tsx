import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

type ProfileResult = { area: string; time: string; suggestion: string };

export default function PerformancePanel() {
  const [highContrast, setHighContrast] = useState(false);
  const [profile, setProfile] = useState<ProfileResult[]>([]);
  const [optimized, setOptimized] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Fetch profiling results from backend
    fetch("/profile/results")
      .then(res => res.json())
      .then(data => setProfile(data.profile || []));
  }, []);

  const handleOptimize = () => {
    fetch("/profile/optimize", { method: "POST" })
      .then(res => res.json())
      .then(data => {
        setOptimized(true);
        setProfile(data.profile || profile);
      });
  };

  return (
    <section
      className={`panel-card performance-panel p-4 border rounded shadow ${highContrast ? 'bg-black text-yellow-300 border-yellow-400' : 'bg-white'}`}
      aria-labelledby="performance-title"
      role="region"
      tabIndex={0}
    >
      <h2 id="performance-title" className="font-bold text-indigo-700 mb-2" tabIndex={0}>{t('performance')}</h2>
      <button
        className="btn mb-2"
        aria-label={highContrast ? t('disable_high_contrast') : t('enable_high_contrast')}
        title={highContrast ? t('disable_high_contrast') : t('enable_high_contrast')}
        onClick={() => setHighContrast(v => !v)}
      >
        {highContrast ? t('disable_high_contrast') : t('enable_high_contrast')}
      </button>
      <ul className="mb-2" aria-label="Profiling Results">
        {profile.map((p, idx) => (
          <li
            key={p.area}
            className={`mb-3 p-3 border rounded flex justify-between items-center ${highContrast ? 'bg-yellow-900 text-yellow-100 border-yellow-400' : 'bg-gray-50'}`}
            tabIndex={0}
            aria-label={`Area: ${p.area}, Render Time: ${p.time}, Suggestion: ${p.suggestion}`}
            title={t('profiling_tooltip')}
          >
            <div>
              <div className="font-semibold text-indigo-700" tabIndex={0} aria-label={t('area_label', { area: p.area })}>{p.area}</div>
              <div className="text-sm text-gray-700" tabIndex={0} aria-label={t('render_time_label', { time: p.time })}>{t('render_time')}: {p.time}</div>
              <div className="text-xs text-gray-700" tabIndex={0} aria-label={t('suggestion_label', { suggestion: p.suggestion })}>{t('suggestion')}: {p.suggestion}</div>
            </div>
          </li>
        ))}
      </ul>
      <button
        className="btn"
        onClick={handleOptimize}
        aria-label={t('run_optimization')}
        title={t('run_optimization_tooltip')}
      >
        {t('run_optimization')}
      </button>
      <span className="ml-2 text-xs text-gray-500" aria-label={t('keyboard_hint')}>{t('keyboard_hint')}</span>
      {optimized && (
        <div
          className="mt-2 p-2 border rounded bg-green-100 text-green-900"
          role="status"
          aria-live="polite"
        >
          {t('optimizations_applied')}
        </div>
      )}
      <div className="mt-4 text-xs text-gray-700" aria-label="Profiling and optimization for frontend/backend coming soon.">
        {t('profiling_coming_soon')}
      </div>
    </section>
  );
}
