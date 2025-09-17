import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const { t } = useTranslation();
  const [tourStep, setTourStep] = useState(0);
  const tourSteps = [
    {
      selector: '.hero-actions .btn.primary',
      title: 'Create Your First Project',
      desc: 'Click here to start a new jewelry design project.'
    },
    {
      selector: '.nav-btn.active',
      title: 'Project Navigation',
      desc: 'Access your projects and templates from here.'
    },
    {
      selector: '.nav-btn:nth-child(2)',
      title: 'Marketplace',
      desc: 'Browse and install plugins, templates, and assets.'
    },
    {
      selector: '.nav-btn:nth-child(3)',
      title: 'Tutorials',
      desc: 'Learn advanced techniques and workflows.'
    },
    {
      selector: '.nav-btn:nth-child(4)',
      title: 'Settings',
      desc: 'Customize your experience and accessibility.'
    }
  ];

  useEffect(() => {
    if (!localStorage.getItem('cj_onboarded')) {
      setTourStep(1);
      localStorage.setItem('cj_onboarded', 'true');
    }
  }, []);

  const startTour = () => setTourStep(1);
  const nextStep = () => setTourStep(s => Math.min(s + 1, tourSteps.length));
  const prevStep = () => setTourStep(s => Math.max(s - 1, 1));
  const endTour = () => setTourStep(0);

  return (
    <div className="welcome-wrap" style={{ position: 'relative' }}>
      <aside className="sidebar" aria-label="Main navigation" tabIndex={0}>
        <div className="brand">
          <div className="gem" />
          <div>
            <div className="title">CraftedJewelz</div>
            <div className="subtitle">v4</div>
          </div>
        </div>

        <nav className="nav" aria-label="Sidebar navigation">
          <button className="nav-btn active">{t('projects') || 'Projects'}</button>
          <button className="nav-btn">{t('marketplace') || 'Marketplace'}</button>
          <button className="nav-btn">{t('tutorials') || 'Tutorials'}</button>
          <button className="nav-btn">{t('settings') || 'Settings'}</button>
        </nav>

        <div className="status">
          <div className="dot" />
          {t('engine') || 'Engine'}: {engineStatus || t('initializing') || 'initializing'}
        </div>
      </aside>

      <main className="content" aria-label="Main content area">
        <header className="hero" aria-label="Welcome header">
          <div>
            <h1>{t('welcome_back') || 'Welcome back'}</h1>
            <p>{t('welcome_message') || 'Create, import, or explore templates from the marketplace.'}</p>
          </div>
          <div className="hero-actions">
            <button className="btn primary" title="Start a new project" aria-label="Start a new project">{t('new_project') || 'New Project'}</button>
            <button className="btn" title="Open an existing project" aria-label="Open an existing project">{t('open') || 'Open…'}</button>
            {tourStep === 0 && (
              <button className="btn ml-4 bg-yellow-400 text-gray-900 font-bold" onClick={startTour} title="Start onboarding tour" aria-label="Start onboarding tour">Start Tour</button>
            )}
          </div>
        </header>

        <div className="mt-8 flex flex-col gap-2">
          <a href="/docs/plugins-onboarding-guide.md" target="_blank" rel="noopener" className="text-blue-400 underline">Help & Onboarding Guide</a>
          <a href="/docs/feedback-system.md" target="_blank" rel="noopener" className="text-blue-400 underline">Submit Feedback</a>
          <a href="/docs/community-support.md" target="_blank" rel="noopener" className="text-blue-400 underline">Community & Support</a>
          <a href="/docs/tutorials.md" target="_blank" rel="noopener" className="text-blue-400 underline">Tutorials</a>
        </div>

        <section className="grid" aria-label="Project grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <article key={i} className="card">
              <div className="thumb" />
              <div className="meta">
                <div className="name">{t('untitled')} {i + 1}</div>
                <div className="sub">{t('edited_days_ago', { days: 2 }) || 'Edited 2 days ago'}</div>
              </div>
            </article>
          ))}
        </section>
      </main>
      {/* Onboarding Tour Overlay */}
      {tourStep > 0 && tourStep <= tourSteps.length && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.4)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div className="tour-card bg-white text-gray-900 rounded-lg shadow-xl p-6 max-w-sm" role="dialog" aria-modal="true" aria-label="Onboarding Tour">
            <h3 className="font-bold text-xl mb-2 text-yellow-600">{tourSteps[tourStep-1].title}</h3>
            <p className="mb-4">{tourSteps[tourStep-1].desc}</p>
            <div className="flex gap-2">
              <button className="btn" onClick={prevStep} disabled={tourStep === 1}>Previous</button>
              <button className="btn" onClick={nextStep} disabled={tourStep === tourSteps.length}>Next</button>
              <button className="btn bg-yellow-400 text-gray-900 font-bold" onClick={endTour}>End Tour</button>
            </div>
            <div className="mt-2 text-xs text-gray-500">Step {tourStep} of {tourSteps.length}</div>
          </div>
        </div>
      )}
    </div>
  );
}
