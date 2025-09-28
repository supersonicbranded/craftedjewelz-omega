import React, { useState, useEffect } from 'react';
import './PluginMarketplace.css';

interface Plugin {
  id: string;
  name: string;
  description: string;
  category: string;
  version: string;
  author: string;
  price: number;
  rating: number;
  downloads: number;
  installed: boolean;
  enabled: boolean;
  icon: string;
  features: string[];
  screenshots: string[];
  tags: string[];
}

interface PluginCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
}

const PluginMarketplace: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlugin, setSelectedPlugin] = useState<Plugin | null>(null);
  const [installedPlugins, setInstalledPlugins] = useState<string[]>([]);
  const [enabledPlugins, setEnabledPlugins] = useState<string[]>([]);

  // Professional Plugin Categories
  const categories: PluginCategory[] = [
    { id: 'all', name: 'All Plugins', description: 'Browse all available plugins', icon: '🔌', count: 0 },
    { id: 'jewelry-design', name: 'Jewelry Design', description: 'Ring, necklace, bracelet design tools', icon: '💍', count: 0 },
    { id: 'watch-design', name: 'Watch Design', description: 'Watch faces, bands, complications', icon: '⌚', count: 0 },
    { id: 'glasses-design', name: 'Glasses Design', description: 'Eyewear frames and lens tools', icon: '🕶️', count: 0 },
    { id: 'ai-automation', name: 'AI & Automation', description: 'AI-powered design and pricing tools', icon: '🤖', count: 0 },
    { id: 'manufacturing', name: 'Manufacturing', description: 'Production and casting tools', icon: '⚙️', count: 0 },
    { id: 'analysis', name: 'Analysis', description: 'Weight, cost, and structural analysis', icon: '📊', count: 0 },
    { id: 'export-import', name: 'Export/Import', description: 'File format converters and exporters', icon: '📁', count: 0 },
    { id: 'rendering', name: 'Rendering', description: 'Visualization and presentation tools', icon: '🎨', count: 0 }
  ];

  // Comprehensive Plugin Library - Including YOUR existing plugins plus new ones
  const plugins: Plugin[] = [
    // YOUR EXISTING PLUGINS (from /apps/plugins/)
    {
      id: 'ai-price-suggestion',
      name: 'AI Price Suggestion',
      description: 'Uses AI to suggest optimal pricing based on materials, labor, and market data.',
      category: 'ai-automation',
      version: '2.1.0',
      author: 'CraftedJewelz Team',
      price: 49.99,
      rating: 4.8,
      downloads: 2847,
      installed: true,
      enabled: true,
      icon: '🤖',
      features: ['AI-powered pricing', 'Market analysis', 'Material cost tracking', 'Regional pricing'],
      screenshots: ['ai-price-1.jpg', 'ai-price-2.jpg'],
      tags: ['AI', 'pricing', 'automation', 'business']
    },
    {
      id: 'diamond-grid-fitter',
      name: 'Diamond Grid Fitter',
      description: 'Automatically fits diamonds into a selected region using advanced grid algorithms.',
      category: 'manufacturing',
      version: '1.5.2',
      author: 'CraftedJewelz Team',
      price: 79.99,
      rating: 4.9,
      downloads: 1923,
      installed: true,
      enabled: true,
      icon: '💎',
      features: ['Automatic diamond fitting', 'Multiple grid patterns', 'Size optimization', 'Conflict detection'],
      screenshots: ['diamond-grid-1.jpg', 'diamond-grid-2.jpg'],
      tags: ['diamonds', 'automation', 'manufacturing', 'grid']
    },
    {
      id: 'technical-drawing-export',
      name: 'Technical Drawing Export',
      description: 'Export detailed technical drawings with dimensions and manufacturing notes.',
      category: 'export-import',
      version: '3.0.1',
      author: 'CraftedJewelz Team',
      price: 29.99,
      rating: 4.7,
      downloads: 3456,
      installed: true,
      enabled: false,
      icon: '📐',
      features: ['Technical drawings', 'Dimension annotations', 'Manufacturing notes', 'PDF/DWG export'],
      screenshots: ['tech-draw-1.jpg', 'tech-draw-2.jpg'],
      tags: ['export', 'technical', 'manufacturing', 'drawings']
    },

    // NEW WATCH DESIGN PLUGINS
    {
      id: 'rolex-watch-designer',
      name: 'Rolex Watch Designer',
      description: 'Professional Rolex-style watch face and case designer with authentic proportions.',
      category: 'watch-design',
      version: '1.0.0',
      author: 'Premium Watch Tools',
      price: 199.99,
      rating: 4.9,
      downloads: 567,
      installed: false,
      enabled: false,
      icon: '👑',
      features: ['Submariner faces', 'Datejust designs', 'GMT complications', 'Oyster cases', 'Authentic bezels'],
      screenshots: ['rolex-1.jpg', 'rolex-2.jpg'],
      tags: ['rolex', 'luxury', 'watch', 'professional']
    },
    {
      id: 'apple-watch-customizer',
      name: 'Apple Watch Customizer',
      description: 'Design custom Apple Watch faces, bands, and digital complications.',
      category: 'watch-design',
      version: '2.1.3',
      author: 'Tech Watch Studio',
      price: 89.99,
      rating: 4.6,
      downloads: 1234,
      installed: false,
      enabled: false,
      icon: '📱',
      features: ['Digital faces', 'Sport bands', 'Milanese loops', 'Custom complications', 'WatchOS compatibility'],
      screenshots: ['apple-watch-1.jpg', 'apple-watch-2.jpg'],
      tags: ['apple', 'smartwatch', 'digital', 'bands']
    },
    {
      id: 'gshock-builder',
      name: 'G-Shock Builder Pro',
      description: 'Create rugged G-Shock style watches with digital displays and shock protection.',
      category: 'watch-design',
      version: '1.2.0',
      author: 'Sports Watch Labs',
      price: 69.99,
      rating: 4.5,
      downloads: 892,
      installed: false,
      enabled: false,
      icon: '💪',
      features: ['Shock resistance', 'Digital displays', 'Sport functions', 'Rugged bezels', 'Water resistance'],
      screenshots: ['gshock-1.jpg', 'gshock-2.jpg'],
      tags: ['gshock', 'sports', 'rugged', 'digital']
    },
    {
      id: 'cartier-luxury-designer',
      name: 'Cartier Luxury Designer',
      description: 'Design luxury Cartier-style watches including Tank, Santos, and Ballon Bleu.',
      category: 'watch-design',
      version: '1.1.0',
      author: 'Luxury Watch Atelier',
      price: 299.99,
      rating: 5.0,
      downloads: 345,
      installed: false,
      enabled: false,
      icon: '💫',
      features: ['Tank designs', 'Santos aviation', 'Ballon Bleu', 'Roman numerals', 'Luxury materials'],
      screenshots: ['cartier-1.jpg', 'cartier-2.jpg'],
      tags: ['cartier', 'luxury', 'tank', 'santos', 'premium']
    },

    // NEW GLASSES DESIGN PLUGINS
    {
      id: 'aviator-designer-pro',
      name: 'Aviator Designer Pro',
      description: 'Professional aviator sunglasses designer with authentic military specifications.',
      category: 'glasses-design',
      version: '1.3.0',
      author: 'Eyewear Studio',
      price: 59.99,
      rating: 4.7,
      downloads: 1567,
      installed: false,
      enabled: false,
      icon: '🛩️',
      features: ['Military specs', 'Polarized lenses', 'Metal frames', 'Nose pads', 'Temple designs'],
      screenshots: ['aviator-1.jpg', 'aviator-2.jpg'],
      tags: ['aviator', 'military', 'sunglasses', 'professional']
    },
    {
      id: 'smart-glasses-builder',
      name: 'Smart Glasses Builder',
      description: 'Design AR/VR smart glasses with integrated electronics and displays.',
      category: 'glasses-design',
      version: '1.0.5',
      author: 'Future Vision Tech',
      price: 149.99,
      rating: 4.4,
      downloads: 234,
      installed: false,
      enabled: false,
      icon: '🤖',
      features: ['AR displays', 'Camera integration', 'Battery housing', 'Connectivity', 'Ergonomic fit'],
      screenshots: ['smart-glasses-1.jpg', 'smart-glasses-2.jpg'],
      tags: ['smart', 'AR', 'VR', 'technology', 'futuristic']
    },

    // NEW CHAMPIONSHIP RING PLUGINS
    {
      id: 'super-bowl-ring-designer',
      name: 'Super Bowl Ring Designer',
      description: 'Create authentic NFL Super Bowl championship rings with team logos and details.',
      category: 'jewelry-design',
      version: '1.0.0',
      author: 'Championship Jewelers',
      price: 199.99,
      rating: 4.9,
      downloads: 456,
      installed: false,
      enabled: false,
      icon: '🏆',
      features: ['NFL team logos', 'Championship details', 'Diamond settings', 'Custom engravings', 'Authentic proportions'],
      screenshots: ['superbowl-1.jpg', 'superbowl-2.jpg'],
      tags: ['NFL', 'superbowl', 'championship', 'sports', 'rings']
    },
    {
      id: 'nba-championship-designer',
      name: 'NBA Championship Designer',
      description: 'Design NBA championship rings with team colors, logos, and trophy details.',
      category: 'jewelry-design',
      version: '1.1.0',
      author: 'Sports Ring Studio',
      price: 179.99,
      rating: 4.8,
      downloads: 678,
      installed: false,
      enabled: false,
      icon: '🏀',
      features: ['NBA team designs', 'Larry O\'Brien trophy', 'Player customization', 'Year engravings', 'Diamond accents'],
      screenshots: ['nba-1.jpg', 'nba-2.jpg'],
      tags: ['NBA', 'basketball', 'championship', 'rings', 'teams']
    },

    // NEW SIGNET RING PLUGINS
    {
      id: 'family-crest-designer',
      name: 'Family Crest Designer',
      description: 'Create heraldic family crest signet rings with traditional coat of arms.',
      category: 'jewelry-design',
      version: '2.0.0',
      author: 'Heraldic Arts',
      price: 89.99,
      rating: 4.8,
      downloads: 1234,
      installed: false,
      enabled: false,
      icon: '🛡️',
      features: ['Heraldic symbols', 'Coat of arms', 'Family mottos', 'Traditional engraving', 'Metal selection'],
      screenshots: ['crest-1.jpg', 'crest-2.jpg'],
      tags: ['heraldic', 'family', 'crest', 'signet', 'tradition']
    },
    {
      id: 'masonic-ring-builder',
      name: 'Masonic Ring Builder',
      description: 'Design traditional Masonic signet rings with authentic symbols and degrees.',
      category: 'jewelry-design',
      version: '1.5.0',
      author: 'Masonic Craftsmen',
      price: 79.99,
      rating: 4.9,
      downloads: 567,
      installed: false,
      enabled: false,
      icon: '📐',
      features: ['Masonic symbols', 'Degree indicators', 'Lodge customization', 'Traditional metals', 'Sacred geometry'],
      screenshots: ['masonic-1.jpg', 'masonic-2.jpg'],
      tags: ['masonic', 'symbols', 'fraternal', 'traditional', 'signet']
    }
  ];

  // Update category counts
  categories.forEach(cat => {
    if (cat.id === 'all') {
      cat.count = plugins.length;
    } else {
      cat.count = plugins.filter(p => p.category === cat.id).length;
    }
  });

  const filteredPlugins = plugins.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesSearch = plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const handleInstallPlugin = (pluginId: string) => {
    setInstalledPlugins(prev => [...prev, pluginId]);
    console.log(`Installing plugin: ${pluginId}`);
    // In real app, this would download and install the plugin
  };

  const handleUninstallPlugin = (pluginId: string) => {
    setInstalledPlugins(prev => prev.filter(id => id !== pluginId));
    setEnabledPlugins(prev => prev.filter(id => id !== pluginId));
    console.log(`Uninstalling plugin: ${pluginId}`);
  };

  const handleTogglePlugin = (pluginId: string) => {
    if (enabledPlugins.includes(pluginId)) {
      setEnabledPlugins(prev => prev.filter(id => id !== pluginId));
    } else {
      setEnabledPlugins(prev => [...prev, pluginId]);
    }
  };

  return (
    <div className="plugin-marketplace">
      <div className="marketplace-header">
        <h1>CraftedJewelz Plugin Marketplace</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search plugins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="marketplace-content">
        {/* Category Sidebar */}
        <div className="category-sidebar">
          <h3>Categories</h3>
          {categories.map(category => (
            <div
              key={category.id}
              className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <div className="category-info">
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.count} plugins</div>
              </div>
            </div>
          ))}
        </div>

        {/* Plugin Grid */}
        <div className="plugin-grid">
          {filteredPlugins.map(plugin => (
            <div key={plugin.id} className="plugin-card">
              <div className="plugin-header">
                <span className="plugin-icon">{plugin.icon}</span>
                <div className="plugin-title">
                  <h4>{plugin.name}</h4>
                  <div className="plugin-author">by {plugin.author}</div>
                </div>
                <div className="plugin-price">
                  {plugin.price === 0 ? 'Free' : `$${plugin.price}`}
                </div>
              </div>

              <div className="plugin-description">
                {plugin.description}
              </div>

              <div className="plugin-stats">
                <div className="rating">
                  ⭐ {plugin.rating}
                </div>
                <div className="downloads">
                  📥 {plugin.downloads.toLocaleString()}
                </div>
                <div className="version">
                  v{plugin.version}
                </div>
              </div>

              <div className="plugin-tags">
                {plugin.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="plugin-tag">{tag}</span>
                ))}
              </div>

              <div className="plugin-actions">
                {plugin.installed || installedPlugins.includes(plugin.id) ? (
                  <div className="installed-actions">
                    <button
                      className={`toggle-btn ${enabledPlugins.includes(plugin.id) || plugin.enabled ? 'enabled' : 'disabled'}`}
                      onClick={() => handleTogglePlugin(plugin.id)}
                    >
                      {enabledPlugins.includes(plugin.id) || plugin.enabled ? 'Disable' : 'Enable'}
                    </button>
                    <button
                      className="uninstall-btn"
                      onClick={() => handleUninstallPlugin(plugin.id)}
                    >
                      Uninstall
                    </button>
                  </div>
                ) : (
                  <button
                    className="install-btn"
                    onClick={() => handleInstallPlugin(plugin.id)}
                  >
                    Install
                  </button>
                )}
                <button
                  className="details-btn"
                  onClick={() => setSelectedPlugin(plugin)}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plugin Details Modal */}
      {selectedPlugin && (
        <div className="plugin-modal-overlay" onClick={() => setSelectedPlugin(null)}>
          <div className="plugin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedPlugin.name}</h2>
              <button onClick={() => setSelectedPlugin(null)}>×</button>
            </div>
            <div className="modal-content">
              <div className="plugin-features">
                <h4>Features:</h4>
                <ul>
                  {selectedPlugin.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div className="plugin-screenshots">
                <h4>Screenshots:</h4>
                <div className="screenshot-grid">
                  {selectedPlugin.screenshots.map((screenshot, index) => (
                    <div key={index} className="screenshot-placeholder">
                      Screenshot {index + 1}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PluginMarketplace;
