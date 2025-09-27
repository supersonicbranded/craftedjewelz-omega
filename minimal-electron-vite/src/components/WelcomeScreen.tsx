import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

interface WelcomeScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Project {
  id: string;
  name: string;
  thumbnail: string;
  shapes: any[];
  createdAt: Date;
  modifiedAt: Date;
  type: string;
}

export default function WelcomeScreen({ onNavigate }: WelcomeScreenProps) {
  const [recentProjects, setRecentProjects] = useState<Project[]>([]);

  useEffect(() => {
    // Load recent projects from localStorage
    const savedProjects = JSON.parse(localStorage.getItem('craftedJewelz_projects') || '[]');
    setRecentProjects(savedProjects.slice(0, 5)); // Show only 5 most recent
  }, []);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return new Date(date).toLocaleDateString();
  };

  const loadProject = (projectId: string) => {
    // In a real implementation, this would load the project data
    // For now, navigate to design canvas
    onNavigate('design');
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-yellow-900 text-gray-100">
      {/* Header with Logo */}
      <header className="px-10 py-6 border-b border-yellow-700/30 backdrop-blur-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* CraftedJewelz Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="CraftedJewelz Logo"
                  className="w-12 h-12 rounded-lg shadow-lg object-contain"
                  onError={(e) => {
                    // Fallback to text logo if image fails to load
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = document.createElement('div');
                    fallback.className = 'w-12 h-12 bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center shadow-lg';
                    fallback.innerHTML = '<span class="text-gray-900 font-bold text-xl">CJ</span>';
                    (e.target as HTMLElement).parentNode?.appendChild(fallback);
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-wide">
                  CraftedJewelz
                </h1>
                <p className="text-sm text-yellow-300">Professional Jewelry CAD Suite</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('design')}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
          >
            New Design
          </button>
        </div>
      </header>

      <div className="flex flex-1 min-h-[calc(100vh-84px)]">
        {/* Sidebar Navigation */}
        <aside className="w-64 border-r border-yellow-700/20 backdrop-blur-sm bg-gray-900/50">
          <nav className="p-6 space-y-2">
            <button
              onClick={() => onNavigate('welcome')}
              className="w-full text-left hover:bg-yellow-600/10 hover:border-yellow-500/30 border border-transparent px-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-yellow-500/20 rounded group-hover:bg-yellow-500/30 transition-colors"></div>
                <span className="text-gray-200 group-hover:text-yellow-300">Home</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('templates')}
              className="w-full text-left hover:bg-yellow-600/10 hover:border-yellow-500/30 border border-transparent px-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-yellow-500/20 rounded group-hover:bg-yellow-500/30 transition-colors"></div>
                <span className="text-gray-200 group-hover:text-yellow-300">Templates</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('marketplace')}
              className="w-full text-left hover:bg-yellow-600/10 hover:border-yellow-500/30 border border-transparent px-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-yellow-500/20 rounded group-hover:bg-yellow-500/30 transition-colors"></div>
                <span className="text-gray-200 group-hover:text-yellow-300">Marketplace</span>
              </div>
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="w-full text-left hover:bg-yellow-600/10 hover:border-yellow-500/30 border border-transparent px-4 py-3 rounded-lg transition-all duration-200 group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-yellow-500/20 rounded group-hover:bg-yellow-500/30 transition-colors"></div>
                <span className="text-gray-200 group-hover:text-yellow-300">Settings</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-10 bg-gradient-to-b from-gray-800/30 to-gray-900/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <h2 className="text-3xl font-bold text-white mb-2">
              Welcome to CraftedJewelz
            </h2>
            <p className="text-yellow-300 text-lg mb-8">
              Professional-grade jewelry design with MatrixGold/Rhino-level precision
            </p>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                onClick={() => onNavigate('design')}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-yellow-700/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-500/30 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-gray-900 font-bold">3D</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">3D Modeling</h3>
                <p className="text-gray-300">Advanced parametric modeling tools for precision jewelry design</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                onClick={() => onNavigate('design')}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-yellow-700/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-500/30 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">AI</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
                <p className="text-gray-300">Intelligent design suggestions and automated optimization</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                onClick={() => onNavigate('design')}
                className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border border-yellow-700/20 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-yellow-500/30 cursor-pointer"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Cloud Render</h3>
                <p className="text-gray-300">High-quality cloud rendering for photorealistic previews</p>
              </motion.div>
            </div>

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h3 className="text-xl font-semibold text-white mb-6">Recent Projects</h3>
              <div className="space-y-3">
                {recentProjects.length > 0 ? (
                  recentProjects.map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.4 }}
                      onClick={() => loadProject(project.id)}
                      className="flex justify-between items-center bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-yellow-700/20 p-4 rounded-lg hover:border-yellow-500/30 hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-900/60 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 font-semibold text-sm">{project.name[0]}</span>
                        </div>
                        <div>
                          <span className="text-white font-medium">{project.name}</span>
                          <p className="text-gray-400 text-sm">{project.shapes.length} shapes</p>
                        </div>
                      </div>
                      <span className="text-sm text-yellow-300">{formatDate(project.modifiedAt)}</span>
                    </motion.div>
                  ))
                ) : (
                  // Show example projects when no saved projects exist
                  [
                    { name: "DiamondRingDesign.cjz", date: "Example", type: "Ring" },
                    { name: "GoldPendantDraft.cjz", date: "Example", type: "Pendant" },
                    { name: "3DKeychainModel.cjz", date: "Example", type: "Keychain" },
                  ].map((file, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.4 }}
                      onClick={() => onNavigate('design')}
                      className="flex justify-between items-center bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-yellow-700/20 p-4 rounded-lg hover:border-yellow-500/30 hover:bg-gradient-to-r hover:from-gray-800/60 hover:to-gray-900/60 cursor-pointer transition-all duration-200"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-400 font-semibold text-sm">{file.type[0]}</span>
                        </div>
                        <div>
                          <span className="text-white font-medium">{file.name}</span>
                          <p className="text-gray-400 text-sm">{file.type}</p>
                        </div>
                      </div>
                      <span className="text-sm text-yellow-300">{file.date}</span>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="flex gap-4 mt-12"
            >
              <button
                onClick={() => onNavigate('design')}
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-gray-900 font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 hover:shadow-xl"
              >
                Start New Project
              </button>
              <button
                onClick={() => onNavigate('design')}
                className="border border-yellow-500/30 hover:border-yellow-500/50 text-yellow-300 hover:text-yellow-200 font-semibold px-8 py-4 rounded-lg backdrop-blur-sm hover:bg-yellow-500/10 transition-all duration-200"
              >
                Open Workspace
              </button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
