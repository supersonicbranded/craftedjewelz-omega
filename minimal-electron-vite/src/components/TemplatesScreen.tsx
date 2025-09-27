import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

interface TemplatesScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface Template {
  id: string;
  name: string;
  category: 'rings' | 'pendants' | 'earrings' | 'bracelets' | 'necklaces';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  thumbnail: string;
  description: string;
  shapes: any[]; // Would contain actual shape data
  estimatedTime: string;
  materials: string[];
}

export default function TemplatesScreen({ onNavigate }: TemplatesScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const templates: Template[] = [
    {
      id: 'classic-solitaire',
      name: 'Classic Solitaire Ring',
      category: 'rings',
      difficulty: 'beginner',
      thumbnail: '/api/placeholder/200/150',
      description: 'Elegant single-stone engagement ring with traditional six-prong setting',
      shapes: [],
      estimatedTime: '2-3 hours',
      materials: ['14k Gold', 'Diamond (1ct)']
    },
    {
      id: 'vintage-halo',
      name: 'Vintage Halo Ring',
      category: 'rings',
      difficulty: 'intermediate',
      thumbnail: '/api/placeholder/200/150',
      description: 'Art Deco inspired ring with center stone surrounded by smaller diamonds',
      shapes: [],
      estimatedTime: '4-5 hours',
      materials: ['18k White Gold', 'Diamond (1ct)', 'Accent Diamonds (0.5ct)']
    },
    {
      id: 'heart-pendant',
      name: 'Heart Pendant',
      category: 'pendants',
      difficulty: 'beginner',
      thumbnail: '/api/placeholder/200/150',
      description: 'Simple and elegant heart-shaped pendant perfect for everyday wear',
      shapes: [],
      estimatedTime: '1-2 hours',
      materials: ['Sterling Silver']
    },
    {
      id: 'drop-earrings',
      name: 'Teardrop Earrings',
      category: 'earrings',
      difficulty: 'intermediate',
      thumbnail: '/api/placeholder/200/150',
      description: 'Graceful teardrop earrings with gemstone accent',
      shapes: [],
      estimatedTime: '3-4 hours',
      materials: ['14k Gold', 'Blue Sapphires (2ct)']
    },
    {
      id: 'tennis-bracelet',
      name: 'Tennis Bracelet',
      category: 'bracelets',
      difficulty: 'advanced',
      thumbnail: '/api/placeholder/200/150',
      description: 'Classic tennis bracelet with uniform diamond settings',
      shapes: [],
      estimatedTime: '6-8 hours',
      materials: ['18k White Gold', 'Diamonds (5ct total)']
    },
    {
      id: 'station-necklace',
      name: 'Station Necklace',
      category: 'necklaces',
      difficulty: 'intermediate',
      thumbnail: '/api/placeholder/200/150',
      description: 'Modern necklace with evenly spaced gemstone stations',
      shapes: [],
      estimatedTime: '3-4 hours',
      materials: ['14k Gold', 'Various Gemstones']
    }
  ];

  const categories = [
    { id: 'all', name: 'All Templates', icon: '✦' },
    { id: 'rings', name: 'Rings', icon: '💍' },
    { id: 'pendants', name: 'Pendants', icon: '🔸' },
    { id: 'earrings', name: 'Earrings', icon: '💎' },
    { id: 'bracelets', name: 'Bracelets', icon: '📿' },
    { id: 'necklaces', name: 'Necklaces', icon: '📿' }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'beginner', name: 'Beginner' },
    { id: 'intermediate', name: 'Intermediate' },
    { id: 'advanced', name: 'Advanced' }
  ];

  const filteredTemplates = templates.filter(template => {
    const categoryMatch = selectedCategory === 'all' || template.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const useTemplate = (template: Template) => {
    // In a real app, this would load the template into the design canvas
    // For now, navigate to design screen
    onNavigate('design');
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
            <h1 className="text-xl font-semibold text-white">Jewelry Templates</h1>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/80 border-r border-yellow-700/20 backdrop-blur-sm p-4">
          <div className="space-y-6">
            {/* Categories */}
            <div>
              <h3 className="text-yellow-300 font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      selectedCategory === category.id
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-300'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <h3 className="text-yellow-300 font-semibold mb-3">Difficulty</h3>
              <div className="space-y-1">
                {difficulties.map(difficulty => (
                  <button
                    key={difficulty.id}
                    onClick={() => setSelectedDifficulty(difficulty.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                      selectedDifficulty === difficulty.id
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-300'
                    }`}
                  >
                    {difficulty.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">Professional Templates</h2>
            <p className="text-gray-300">Choose from our collection of professionally designed jewelry templates</p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template, index) => (
              <motion.div
                key={template.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800/50 rounded-xl border border-yellow-700/20 overflow-hidden hover:border-yellow-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10"
              >
                {/* Template Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 p-8 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 text-2xl">
                      {template.category === 'rings' ? '💍' :
                       template.category === 'pendants' ? '🔸' :
                       template.category === 'earrings' ? '💎' :
                       template.category === 'bracelets' ? '📿' : '📿'}
                    </span>
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      template.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                      template.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {template.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{template.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-xs text-gray-400">
                      <span className="w-4 h-4 mr-2">⏱</span>
                      <span>{template.estimatedTime}</span>
                    </div>
                    <div className="flex items-start text-xs text-gray-400">
                      <span className="w-4 h-4 mr-2 mt-0.5">💎</span>
                      <span>{template.materials.join(', ')}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => useTemplate(template)}
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 shadow-lg hover:shadow-yellow-500/25"
                  >
                    Use Template
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-500 text-xl">📋</span>
              </div>
              <p className="text-gray-400">No templates found matching your filters</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
