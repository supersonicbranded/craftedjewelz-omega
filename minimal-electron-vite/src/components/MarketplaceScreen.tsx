import React, { useState } from 'react';
import { motion } from 'framer-motion';

export type Screen = 'welcome' | 'design' | 'templates' | 'marketplace' | 'settings';

interface MarketplaceScreenProps {
  onNavigate: (screen: Screen) => void;
}

interface MarketplaceItem {
  id: string;
  name: string;
  type: 'plugin' | 'template' | 'material' | 'tool';
  price: number;
  rating: number;
  reviews: number;
  thumbnail: string;
  description: string;
  author: string;
  featured: boolean;
  tags: string[];
}

export default function MarketplaceScreen({ onNavigate }: MarketplaceScreenProps) {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState('');

  const marketplaceItems: MarketplaceItem[] = [
    {
      id: 'ai-price-suggest',
      name: 'AI Price Suggestion Plugin',
      type: 'plugin',
      price: 29.99,
      rating: 4.8,
      reviews: 156,
      thumbnail: '/api/placeholder/200/150',
      description: 'Intelligent pricing suggestions based on market data and material costs',
      author: 'CraftedJewelz Team',
      featured: true,
      tags: ['AI', 'Pricing', 'Business']
    },
    {
      id: 'diamond-grid',
      name: 'Diamond Grid Layout Tool',
      type: 'plugin',
      price: 19.99,
      rating: 4.9,
      reviews: 89,
      thumbnail: '/api/placeholder/200/150',
      description: 'Professional diamond placement grid for precise pavé and micro-pavé settings',
      author: 'ProJeweler Studio',
      featured: true,
      tags: ['Diamonds', 'Layout', 'Professional']
    },
    {
      id: 'cad-export-pro',
      name: 'CAD Export Pro',
      type: 'plugin',
      price: 49.99,
      rating: 4.7,
      reviews: 234,
      thumbnail: '/api/placeholder/200/150',
      description: 'Export to multiple CAD formats including Rhino 3DM, SolidWorks, and more',
      author: 'TechCraft Solutions',
      featured: false,
      tags: ['Export', 'CAD', 'Professional']
    },
    {
      id: 'vintage-collection',
      name: 'Vintage Design Collection',
      type: 'template',
      price: 39.99,
      rating: 4.6,
      reviews: 78,
      thumbnail: '/api/placeholder/200/150',
      description: '50 authentic vintage jewelry designs from Art Deco to Victorian eras',
      author: 'Heritage Designs',
      featured: false,
      tags: ['Vintage', 'Templates', 'Historical']
    },
    {
      id: 'gemstone-lib',
      name: 'Complete Gemstone Library',
      type: 'material',
      price: 24.99,
      rating: 4.9,
      reviews: 167,
      thumbnail: '/api/placeholder/200/150',
      description: 'Comprehensive library of gemstone properties, colors, and 3D models',
      author: 'GemTech Resources',
      featured: true,
      tags: ['Gemstones', 'Materials', 'Library']
    },
    {
      id: 'measurement-tools',
      name: 'Precision Measurement Tools',
      type: 'tool',
      price: 15.99,
      rating: 4.8,
      reviews: 123,
      thumbnail: '/api/placeholder/200/150',
      description: 'Professional measurement and dimensioning tools for accurate jewelry design',
      author: 'Precision Craft',
      featured: false,
      tags: ['Measurement', 'Tools', 'Precision']
    }
  ];

  const types = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'plugin', name: 'Plugins', icon: '🔧' },
    { id: 'template', name: 'Templates', icon: '📐' },
    { id: 'material', name: 'Materials', icon: '💎' },
    { id: 'tool', name: 'Tools', icon: '⚒️' }
  ];

  const sortOptions = [
    { id: 'featured', name: 'Featured' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest' }
  ];

  const filteredAndSortedItems = marketplaceItems
    .filter(item => {
      const typeMatch = selectedType === 'all' || item.type === selectedType;
      const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return typeMatch && searchMatch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
          return b.featured ? 1 : -1;
        default:
          return 0;
      }
    });

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
            <h1 className="text-xl font-semibold text-white">Marketplace</h1>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search marketplace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800 border border-yellow-700/30 rounded-lg px-4 py-2 pr-10 text-white placeholder-gray-400 focus:border-yellow-500 focus:outline-none w-64"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/80 border-r border-yellow-700/20 backdrop-blur-sm p-4">
          <div className="space-y-6">
            {/* Types */}
            <div>
              <h3 className="text-yellow-300 font-semibold mb-3">Categories</h3>
              <div className="space-y-1">
                {types.map(type => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                      selectedType === type.id
                        ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-yellow-300'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort */}
            <div>
              <h3 className="text-yellow-300 font-semibold mb-3">Sort By</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-gray-800 border border-yellow-700/30 rounded-lg px-3 py-2 text-white focus:border-yellow-500 focus:outline-none"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Featured Banner */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-2">Featured Marketplace Items</h2>
              <p className="text-yellow-300">Discover professional tools and templates to enhance your jewelry design workflow</p>
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className={`bg-gray-800/50 rounded-xl border overflow-hidden hover:border-yellow-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-yellow-500/10 ${
                  item.featured
                    ? 'border-yellow-500/40 shadow-lg shadow-yellow-500/10'
                    : 'border-yellow-700/20'
                }`}
              >
                {/* Item Image */}
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 p-8 flex items-center justify-center relative">
                  {item.featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>
                  )}
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 border border-yellow-500/30 rounded-lg flex items-center justify-center">
                    <span className="text-yellow-400 text-2xl">
                      {item.type === 'plugin' ? '🔧' :
                       item.type === 'template' ? '📐' :
                       item.type === 'material' ? '💎' : '⚒️'}
                    </span>
                  </div>
                </div>

                {/* Item Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white leading-tight">{item.name}</h3>
                      <p className="text-gray-400 text-sm">by {item.author}</p>
                    </div>
                    <span className="text-yellow-300 font-bold text-lg">${item.price}</span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">{item.description}</p>

                  {/* Rating */}
                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < Math.floor(item.rating) ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm ml-2">
                      {item.rating} ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.tags.slice(0, 3).map(tag => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-medium py-2 px-4 rounded-lg hover:from-yellow-400 hover:to-yellow-500 transition-all duration-200 text-sm">
                      Purchase
                    </button>
                    <button className="px-4 py-2 border border-yellow-500/30 text-yellow-300 rounded-lg hover:bg-yellow-500/10 transition-all duration-200 text-sm">
                      Preview
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-500 text-xl">🛍️</span>
              </div>
              <p className="text-gray-400">No items found matching your search</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
