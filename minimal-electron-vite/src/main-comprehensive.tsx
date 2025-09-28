import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';

// YOUR Professional CraftedJewelz CAD Interface - Complete Version
export const ProfessionalCraftedJewelzInterface: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [selectedTool, setSelectedTool] = useState('select');
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentTemplate, setCurrentTemplate] = useState<string | null>(null);
  const [showToolTooltip, setShowToolTooltip] = useState<string | null>(null);

  // COMPREHENSIVE Template System - ALL jewelry types you requested
  const comprehensiveTemplates = {
    rings: [
      { name: 'Classic Solitaire', preview: '💍', description: '6-prong solitaire engagement ring', materials: ['14K Gold', 'Diamond 1ct'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Vintage Halo', preview: '👑', description: 'Art deco halo with accent diamonds', materials: ['18K White Gold', 'Diamonds'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Three Stone', preview: '💎', description: 'Past, present, future trilogy design', materials: ['Platinum', 'Diamonds 2ct'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Eternity Band', preview: '∞', description: 'Continuous diamond eternity band', materials: ['18K Gold', 'Diamonds 3ct'], time: '5-6 hrs', difficulty: 'Advanced' },
      { name: 'Cathedral Setting', preview: '⛪', description: 'Raised cathedral mounting', materials: ['14K White Gold', 'Diamond'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Vintage Art Deco', preview: '◇', description: 'Geometric 1920s inspired design', materials: ['Platinum', 'Diamonds'], time: '6-7 hrs', difficulty: 'Advanced' },
      { name: 'Celtic Knot', preview: '♾', description: 'Traditional Celtic knotwork band', materials: ['Sterling Silver'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Bypass Ring', preview: '〜', description: 'Modern bypass design', materials: ['14K Rose Gold'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Tension Setting', preview: '⚡', description: 'Modern tension-set diamond', materials: ['Titanium', 'Diamond'], time: '5-6 hrs', difficulty: 'Advanced' },
      { name: 'Cluster Ring', preview: '✨', description: 'Multi-stone cluster design', materials: ['18K Gold', 'Mixed Gems'], time: '4-5 hrs', difficulty: 'Intermediate' }
    ],
    necklaces: [
      { name: 'Cable Chain', preview: '○-○-○', description: 'Classic cable link chain', materials: ['14K Gold'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Box Chain', preview: '▢▢▢', description: 'Square box link chain', materials: ['Sterling Silver'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Curb Chain', preview: '◗◗◗', description: 'Twisted curb link design', materials: ['18K Gold'], time: '5-6 hrs', difficulty: 'Advanced' },
      { name: 'Rope Chain', preview: '🪢', description: 'Twisted rope pattern', materials: ['14K Gold'], time: '6-7 hrs', difficulty: 'Advanced' },
      { name: 'Tennis Necklace', preview: '◉-◉-◉', description: 'Continuous diamond riviere', materials: ['Platinum', 'Diamonds 10ct'], time: '8-10 hrs', difficulty: 'Expert' },
      { name: 'Pearl Strand', preview: '⚪⚪⚪', description: 'Classic cultured pearl necklace', materials: ['Cultured Pearls'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Choker Style', preview: '═══', description: 'Close-fitting modern choker', materials: ['Sterling Silver'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Layered Design', preview: '≡', description: 'Multi-strand layered necklace', materials: ['Mixed Metals'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Statement Collar', preview: '⬜⬜⬜', description: 'Bold geometric collar necklace', materials: ['18K Gold'], time: '7-8 hrs', difficulty: 'Advanced' },
      { name: 'Vintage Festoon', preview: '〰〰〰', description: 'Draped festoon style', materials: ['Platinum', 'Pearls'], time: '6-7 hrs', difficulty: 'Advanced' }
    ],
    bracelets: [
      { name: 'Tennis Bracelet', preview: '◉-◉-◉', description: 'Classic diamond line bracelet', materials: ['18K White Gold', 'Diamonds 5ct'], time: '6-8 hrs', difficulty: 'Advanced' },
      { name: 'Cuban Link', preview: '◗◗◗', description: 'Heavy Cuban link chain', materials: ['14K Gold'], time: '5-6 hrs', difficulty: 'Intermediate' },
      { name: 'Bangle Bracelet', preview: '○', description: 'Solid circular bangle', materials: ['Sterling Silver'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Charm Bracelet', preview: '○⭐○♥○', description: 'Chain with hanging charms', materials: ['14K Gold', 'Mixed Charms'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Cuff Bracelet', preview: '⊂⊃', description: 'Open-ended cuff design', materials: ['Sterling Silver'], time: '3-4 hrs', difficulty: 'Beginner' },
      { name: 'Beaded Bracelet', preview: '●●●', description: 'Natural gemstone beads', materials: ['Mixed Gemstones'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Link Bracelet', preview: '▢▢▢', description: 'Articulated link design', materials: ['18K Gold'], time: '5-6 hrs', difficulty: 'Advanced' },
      { name: 'Wrap Bracelet', preview: '〰', description: 'Multi-wrap leather style', materials: ['Leather', 'Metal'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Mesh Bracelet', preview: '▦▦▦', description: 'Flexible mesh design', materials: ['14K Gold'], time: '6-7 hrs', difficulty: 'Advanced' },
      { name: 'Byzantine Chain', preview: '⚡⚡⚡', description: 'Complex Byzantine links', materials: ['Sterling Silver'], time: '7-8 hrs', difficulty: 'Expert' }
    ],
    earrings: [
      { name: 'Stud Earrings', preview: '◉', description: 'Classic post-back studs', materials: ['14K Gold', 'Diamonds'], time: '1-2 hrs', difficulty: 'Beginner' },
      { name: 'Drop Earrings', preview: '◉↓', description: 'Elegant drop design', materials: ['Sterling Silver', 'Pearls'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Chandelier', preview: '◉↓↓', description: 'Multi-tier chandelier style', materials: ['18K Gold', 'Mixed Gems'], time: '6-7 hrs', difficulty: 'Advanced' },
      { name: 'Hoop Earrings', preview: '○', description: 'Classic circular hoops', materials: ['14K Gold'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Huggie Hoops', preview: '◯', description: 'Small close-fitting hoops', materials: ['Sterling Silver'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Threader Style', preview: '│', description: 'Modern threader earrings', materials: ['14K Gold'], time: '2-3 hrs', difficulty: 'Intermediate' },
      { name: 'Cluster Design', preview: '❋', description: 'Multi-stone cluster', materials: ['18K White Gold', 'Diamonds'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Geometric', preview: '◇', description: 'Modern geometric shapes', materials: ['Sterling Silver'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Tassel Earrings', preview: '◉⫸', description: 'Flowing tassel design', materials: ['14K Gold', 'Chains'], time: '4-5 hrs', difficulty: 'Advanced' },
      { name: 'Ear Cuffs', preview: '⌒', description: 'No-pierce ear cuffs', materials: ['Sterling Silver'], time: '2-3 hrs', difficulty: 'Intermediate' }
    ],
    pendants: [
      { name: 'Solitaire Pendant', preview: '◈', description: 'Single stone pendant', materials: ['14K Gold', 'Diamond'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Cross Pendant', preview: '✝', description: 'Religious cross design', materials: ['Sterling Silver'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Heart Pendant', preview: '♥', description: 'Romantic heart shape', materials: ['14K Rose Gold'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Initial Pendant', preview: 'A', description: 'Personalized letter pendant', materials: ['18K Gold'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Locket', preview: '◎', description: 'Photo locket pendant', materials: ['Sterling Silver'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Geometric', preview: '◇', description: 'Modern geometric design', materials: ['14K Gold'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Nature Inspired', preview: '🍃', description: 'Leaf and floral motifs', materials: ['Sterling Silver', 'Enamel'], time: '4-5 hrs', difficulty: 'Intermediate' },
      { name: 'Abstract Art', preview: '◊', description: 'Artistic abstract design', materials: ['18K Gold'], time: '5-6 hrs', difficulty: 'Advanced' },
      { name: 'Birthstone', preview: '💎', description: 'Zodiac birthstone pendant', materials: ['14K Gold', 'Birthstone'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Religious Medal', preview: '●', description: 'Saint medal pendant', materials: ['Sterling Silver'], time: '3-4 hrs', difficulty: 'Intermediate' }
    ],
    watches: [
      { name: 'Rolex Submariner Face', preview: '⌚', description: 'Luxury dive watch face design', materials: ['Stainless Steel', 'Ceramic Bezel'], time: '12-15 hrs', difficulty: 'Expert' },
      { name: 'Rolex Datejust Face', preview: '📅', description: 'Classic dress watch face', materials: ['18K Gold', 'Diamond Hour Marks'], time: '10-12 hrs', difficulty: 'Expert' },
      { name: 'Rolex GMT Face', preview: '🌍', description: 'Dual-time GMT watch face', materials: ['Steel/Gold Two-Tone'], time: '14-16 hrs', difficulty: 'Expert' },
      { name: 'Apple Watch Face', preview: '⌚', description: 'Digital smart watch interface', materials: ['Aluminum/Steel'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Apple Watch Sport', preview: '🏃', description: 'Athletic watch face design', materials: ['Sport Band', 'Aluminum'], time: '6-8 hrs', difficulty: 'Intermediate' },
      { name: 'G-Shock Digital', preview: '💪', description: 'Rugged sports watch face', materials: ['Resin', 'Steel'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'G-Shock Analog', preview: '⏰', description: 'Hybrid analog-digital design', materials: ['Carbon Fiber', 'Titanium'], time: '10-12 hrs', difficulty: 'Advanced' },
      { name: 'Cartier Tank Face', preview: '▬', description: 'Luxury rectangular watch', materials: ['18K Gold', 'Leather'], time: '15-18 hrs', difficulty: 'Expert' },
      { name: 'Cartier Santos Face', preview: '✚', description: 'Aviation-inspired luxury watch', materials: ['Steel/Gold', 'Sapphire'], time: '16-20 hrs', difficulty: 'Expert' },
      { name: 'Custom Watch Face', preview: '⚙️', description: 'Personalized watch face design', materials: ['Custom Materials'], time: '20-25 hrs', difficulty: 'Master' }
    ],
    watchBands: [
      { name: 'Oyster Bracelet', preview: '▬▬▬', description: 'Classic Rolex oyster link', materials: ['Stainless Steel'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Jubilee Bracelet', preview: '◈◈◈', description: 'Five-piece link bracelet', materials: ['Steel/Gold'], time: '10-12 hrs', difficulty: 'Advanced' },
      { name: 'Apple Sport Band', preview: '〰〰〰', description: 'Fluoroelastomer sport band', materials: ['Silicone', 'Steel Buckle'], time: '4-6 hrs', difficulty: 'Intermediate' },
      { name: 'Apple Milanese', preview: '▦▦▦', description: 'Mesh steel watch band', materials: ['Stainless Steel Mesh'], time: '6-8 hrs', difficulty: 'Advanced' },
      { name: 'Leather Strap', preview: '═══', description: 'Classic leather watch strap', materials: ['Italian Leather'], time: '3-4 hrs', difficulty: 'Beginner' },
      { name: 'NATO Strap', preview: '|||', description: 'Military-style nylon strap', materials: ['Nylon', 'Steel Hardware'], time: '2-3 hrs', difficulty: 'Beginner' },
      { name: 'Rubber Strap', preview: '▬▬▬', description: 'Sports rubber watch band', materials: ['Silicone Rubber'], time: '3-4 hrs', difficulty: 'Intermediate' },
      { name: 'Chain Link', preview: '○-○-○', description: 'Traditional chain link band', materials: ['Gold/Silver'], time: '6-8 hrs', difficulty: 'Advanced' }
    ],
    signetRings: [
      { name: 'Classic Family Crest', preview: '🛡️', description: 'Traditional heraldic signet', materials: ['18K Gold'], time: '10-12 hrs', difficulty: 'Expert' },
      { name: 'Monogram Signet', preview: '🔤', description: 'Personalized initial design', materials: ['Sterling Silver'], time: '6-8 hrs', difficulty: 'Advanced' },
      { name: 'Masonic Signet', preview: '▲', description: 'Traditional Masonic symbols', materials: ['18K Gold'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'University Ring', preview: '🎓', description: 'College graduation signet', materials: ['14K Gold'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Military Signet', preview: '⚔️', description: 'Armed forces insignia', materials: ['Sterling Silver'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Corporate Logo', preview: '🏢', description: 'Company logo signet ring', materials: ['18K Gold'], time: '10-12 hrs', difficulty: 'Expert' },
      { name: 'Coat of Arms', preview: '👑', description: 'Noble family coat of arms', materials: ['Platinum'], time: '15-18 hrs', difficulty: 'Master' },
      { name: 'Religious Symbol', preview: '✝️', description: 'Faith-based signet design', materials: ['14K Gold'], time: '6-8 hrs', difficulty: 'Advanced' }
    ],
    championshipRings: [
      { name: 'Super Bowl Ring', preview: '🏆', description: 'NFL championship ring design', materials: ['18K Gold', 'Diamonds 3ct'], time: '20-25 hrs', difficulty: 'Master' },
      { name: 'NBA Championship', preview: '🏀', description: 'Basketball championship ring', materials: ['18K White Gold', 'Diamonds'], time: '18-22 hrs', difficulty: 'Master' },
      { name: 'World Series Ring', preview: '⚾', description: 'Baseball championship ring', materials: ['18K Gold', 'Sapphires'], time: '18-22 hrs', difficulty: 'Master' },
      { name: 'Stanley Cup Ring', preview: '🏒', description: 'Hockey championship ring', materials: ['Platinum', 'Diamonds'], time: '20-25 hrs', difficulty: 'Master' },
      { name: 'College Championship', preview: '🎓', description: 'University sports championship', materials: ['14K Gold', 'School Gemstone'], time: '15-18 hrs', difficulty: 'Expert' },
      { name: 'Olympic Medal Ring', preview: '🥇', description: 'Olympic games victory ring', materials: ['18K Gold', 'Olympic Stones'], time: '25-30 hrs', difficulty: 'Master' },
      { name: 'Soccer World Cup', preview: '⚽', description: 'FIFA World Cup ring design', materials: ['18K Gold', 'Emeralds'], time: '20-25 hrs', difficulty: 'Master' },
      { name: 'Custom Championship', preview: '👑', description: 'Personalized championship ring', materials: ['Custom Materials'], time: '30-40 hrs', difficulty: 'Master' }
    ],
    glasses: [
      { name: 'Aviator Frames', preview: '🕶️', description: 'Classic pilot sunglasses', materials: ['Titanium', 'Polarized Glass'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Wayfarer Style', preview: '🤓', description: 'Retro rectangular frames', materials: ['Acetate', 'CR-39 Lens'], time: '6-8 hrs', difficulty: 'Intermediate' },
      { name: 'Cat Eye Vintage', preview: '👓', description: '1950s inspired cat eye frames', materials: ['Acetate', 'Rhinestones'], time: '8-10 hrs', difficulty: 'Advanced' },
      { name: 'Round Wire Frames', preview: '⊙', description: 'Minimalist wire glasses', materials: ['Titanium Wire'], time: '4-6 hrs', difficulty: 'Intermediate' },
      { name: 'Sports Wraparound', preview: '🏃', description: 'Athletic wraparound design', materials: ['Polycarbonate'], time: '6-8 hrs', difficulty: 'Intermediate' },
      { name: 'Designer Oversized', preview: '👸', description: 'Fashion oversized frames', materials: ['Luxury Acetate'], time: '10-12 hrs', difficulty: 'Advanced' },
      { name: 'Smart Glasses', preview: '📱', description: 'Tech-integrated eyewear', materials: ['Titanium', 'Electronics'], time: '15-20 hrs', difficulty: 'Expert' },
      { name: 'Blue Light Gaming', preview: '🎮', description: 'Gaming blue light glasses', materials: ['TR90', 'Blue Light Filter'], time: '4-6 hrs', difficulty: 'Intermediate' }
    ]
  };

  const templateCategories = [
    { id: 'all', name: 'All Templates', icon: '✦', count: Object.values(comprehensiveTemplates).flat().length },
    { id: 'rings', name: 'Rings', icon: '💍', count: comprehensiveTemplates.rings.length },
    { id: 'necklaces', name: 'Necklaces', icon: '📿', count: comprehensiveTemplates.necklaces.length },
    { id: 'bracelets', name: 'Bracelets', icon: '📿', count: comprehensiveTemplates.bracelets.length },
    { id: 'earrings', name: 'Earrings', icon: '💎', count: comprehensiveTemplates.earrings.length },
    { id: 'pendants', name: 'Pendants', icon: '🔸', count: comprehensiveTemplates.pendants.length },
    { id: 'watches', name: 'Watches', icon: '⌚', count: comprehensiveTemplates.watches.length },
    { id: 'watchBands', name: 'Watch Bands', icon: '▬', count: comprehensiveTemplates.watchBands.length },
    { id: 'signetRings', name: 'Signet Rings', icon: '🛡️', count: comprehensiveTemplates.signetRings.length },
    { id: 'championshipRings', name: 'Championship Rings', icon: '🏆', count: comprehensiveTemplates.championshipRings.length },
    { id: 'glasses', name: 'Glasses', icon: '🕶️', count: comprehensiveTemplates.glasses.length }
  ];

  const getCurrentTemplates = () => {
    if (selectedCategory === 'all') {
      return Object.entries(comprehensiveTemplates).flatMap(([category, templates]) =>
        templates.map(template => ({ ...template, category }))
      );
    }
    return comprehensiveTemplates[selectedCategory as keyof typeof comprehensiveTemplates]?.map(template =>
      ({ ...template, category: selectedCategory })
    ) || [];
  };

  // Professional jewelry CAD tools
  const professionalTools = [
    { id: 'select', icon: '↖', name: 'Select Objects', shortcut: 'SPACE' },
    { id: 'move', icon: '⤴', name: 'Move', shortcut: 'M' },
    { id: 'rotate', icon: '↻', name: 'Rotate', shortcut: 'R' },
    { id: 'scale', icon: '⤢', name: 'Scale', shortcut: 'S' },
    { id: 'mirror', icon: '⟷', name: 'Mirror', shortcut: 'MI' },
    { id: 'copy', icon: '⧉', name: 'Copy', shortcut: 'CO' },
    '---',
    { id: 'line', icon: '╱', name: 'Line', shortcut: 'L' },
    { id: 'polyline', icon: '╲', name: 'Polyline', shortcut: 'PL' },
    { id: 'arc', icon: '⌒', name: 'Arc', shortcut: 'A' },
    { id: 'circle', icon: '○', name: 'Circle', shortcut: 'C' },
    { id: 'rectangle', icon: '▭', name: 'Rectangle', shortcut: 'REC' },
    { id: 'polygon', icon: '⬢', name: 'Polygon', shortcut: 'POL' },
    '---',
    { id: 'extrude', icon: '⬆', name: 'Extrude', shortcut: 'EXT' },
    { id: 'revolve', icon: '↺', name: 'Revolve', shortcut: 'REV' },
    { id: 'sweep', icon: '⤷', name: 'Sweep', shortcut: 'SWEEP' },
    { id: 'loft', icon: '🎯', name: 'Loft', shortcut: 'LOFT' },
    '---',
    { id: 'boolean_union', icon: '⊕', name: 'Boolean Union', shortcut: 'UNION' },
    { id: 'boolean_subtract', icon: '⊖', name: 'Boolean Subtract', shortcut: 'DIFF' },
    { id: 'boolean_intersect', icon: '⊗', name: 'Boolean Intersect', shortcut: 'INT' }
  ];

  const jewelrySpecificTools = [
    { id: 'ring_builder', icon: '💍', name: 'Ring Builder', shortcut: 'RB' },
    { id: 'band_designer', icon: '⭕', name: 'Band Designer', shortcut: 'BD' },
    { id: 'size_ring', icon: '📏', name: 'Size Ring', shortcut: 'SR' },
    '---',
    { id: 'prong_setting', icon: '⟡', name: 'Prong Setting', shortcut: 'PS' },
    { id: 'bezel_setting', icon: '◉', name: 'Bezel Setting', shortcut: 'BS' },
    { id: 'channel_setting', icon: '⬜', name: 'Channel Setting', shortcut: 'CS' },
    { id: 'pave_setting', icon: '◦', name: 'Pave Setting', shortcut: 'PV' },
    '---',
    { id: 'place_diamond', icon: '💎', name: 'Place Diamond', shortcut: 'PD' },
    { id: 'place_ruby', icon: '🔴', name: 'Place Ruby', shortcut: 'PR' },
    { id: 'place_emerald', icon: '🟢', name: 'Place Emerald', shortcut: 'PE' },
    { id: 'place_sapphire', icon: '🔵', name: 'Place Sapphire', shortcut: 'PSA' },
    { id: 'place_amethyst', icon: '🟣', name: 'Place Amethyst', shortcut: 'PA' },
    { id: 'place_topaz', icon: '🟡', name: 'Place Topaz', shortcut: 'PT' },
    '---',
    { id: 'chain_builder', icon: '🔗', name: 'Chain Builder', shortcut: 'CB' },
    { id: 'clasp_designer', icon: '🔒', name: 'Clasp Designer', shortcut: 'CD' },
    '---',
    { id: 'texture_library', icon: '⬣', name: 'Texture Library', shortcut: 'TL' },
    { id: 'pattern_tools', icon: '⧨', name: 'Pattern Tools', shortcut: 'PAT' }
  ];

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
      color: '#ffffff'
    }}>
      {/* YOUR Professional Title Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #1f1f1f 0%, #2d2d2d 100%)',
        borderBottom: '1px solid #404040',
        padding: '8px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(45deg, #FFD700 0%, #FFA500 50%, #FF8C00 100%)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '18px',
            color: '#000',
            boxShadow: '0 2px 8px rgba(255,215,0,0.3)'
          }}>C</div>
          <div>
            <span style={{
              fontSize: '18px',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>CraftedJewelz</span>
            <span style={{ color: '#9ca3af', marginLeft: '8px', fontSize: '14px' }}>
              Professional Jewelry CAD - [New Design.cjz]
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          <button style={{
            background: 'transparent',
            border: 'none',
            width: '32px',
            height: '24px',
            cursor: 'pointer',
            color: '#9ca3af',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px'
          }} onMouseEnter={e => e.currentTarget.style.background = '#404040'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>_</button>
          <button style={{
            background: 'transparent',
            border: 'none',
            width: '32px',
            height: '24px',
            cursor: 'pointer',
            color: '#9ca3af',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px'
          }} onMouseEnter={e => e.currentTarget.style.background = '#404040'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>□</button>
          <button style={{
            background: 'transparent',
            border: 'none',
            width: '32px',
            height: '24px',
            cursor: 'pointer',
            color: '#f87171',
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '2px'
          }} onMouseEnter={e => e.currentTarget.style.background = '#ef4444'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>×</button>
        </div>
      </div>

      {/* Professional Menu Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
        borderBottom: '1px solid #404040',
        padding: '4px 8px'
      }}>
        <div style={{ display: 'flex', gap: '2px' }}>
          {['File', 'Edit', 'View', 'Create', 'Jewelry', 'Transform', 'Analyze', 'Render', 'Templates', 'Tools', 'Window', 'Help'].map(menu => (
            <button
              key={menu}
              onClick={() => setActiveMenu(activeMenu === menu ? null : menu)}
              style={{
                background: activeMenu === menu ? 'linear-gradient(135deg, #404040 0%, #353535 100%)' : 'transparent',
                border: 'none',
                color: '#ffffff',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '14px',
                borderRadius: '4px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => {
                if (activeMenu !== menu) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #353535 0%, #2a2a2a 100%)';
                }
              }}
              onMouseLeave={e => {
                if (activeMenu !== menu) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {menu}
            </button>
          ))}
        </div>
      </div>

      {/* Main Toolbar */}
      <div style={{
        background: 'linear-gradient(135deg, #2d2d2d 0%, #242424 100%)',
        borderBottom: '1px solid #404040',
        padding: '8px 12px'
      }}>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '2px', marginRight: '8px' }}>
            {professionalTools.map((tool, index) => (
              tool === '---' ? (
                <div key={index} style={{ width: '1px', height: '32px', background: '#404040', margin: '0 4px' }} />
              ) : (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  onMouseEnter={() => setShowToolTooltip(`${tool.name} (${tool.shortcut})`)}
                  onMouseLeave={() => setShowToolTooltip(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    background: selectedTool === tool.id ?
                      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
                      'linear-gradient(135deg, #404040 0%, #353535 100%)',
                    border: `1px solid ${selectedTool === tool.id ? '#FFB000' : '#555555'}`,
                    borderRadius: '4px',
                    color: selectedTool === tool.id ? '#000000' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    transition: 'all 0.2s',
                    boxShadow: selectedTool === tool.id ? '0 2px 8px rgba(255,215,0,0.3)' : 'none'
                  }}
                >
                  {tool.icon}
                </button>
              )
            ))}
          </div>
          <button
            onClick={() => setShowTemplates(true)}
            style={{
              background: 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)',
              border: '1px solid #3b82f6',
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(59,130,246,0.3)'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            📋 Template Library
          </button>
        </div>
      </div>

      {/* Jewelry-Specific Toolbar */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
        borderBottom: '1px solid #404040',
        padding: '8px 12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            color: '#FFD700',
            fontSize: '14px',
            fontWeight: '600',
            marginRight: '8px'
          }}>Jewelry Tools:</span>
          <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
            {jewelrySpecificTools.map((tool, index) => (
              tool === '---' ? (
                <div key={index} style={{ width: '1px', height: '28px', background: '#404040', margin: '0 4px' }} />
              ) : (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  onMouseEnter={() => setShowToolTooltip(`${tool.name} (${tool.shortcut})`)}
                  onMouseLeave={() => setShowToolTooltip(null)}
                  style={{
                    width: '32px',
                    height: '32px',
                    background: selectedTool === tool.id ?
                      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
                      'linear-gradient(135deg, #404040 0%, #353535 100%)',
                    border: `1px solid ${selectedTool === tool.id ? '#FFB000' : '#555555'}`,
                    borderRadius: '4px',
                    color: selectedTool === tool.id ? '#000000' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    transition: 'all 0.2s'
                  }}
                >
                  {tool.icon}
                </button>
              )
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel - Layers & Properties */}
        <div style={{
          width: '280px',
          background: 'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',
          borderRight: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
            borderBottom: '1px solid #404040',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFD700'
          }}>
            Project Properties
          </div>

          <div style={{ padding: '12px', flex: 1 }}>
            {/* Layers Section */}
            <div style={{
              background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
              border: '1px solid #404040',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600'
              }}>Layers</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { name: 'Default', color: '#10b981', visible: true },
                  { name: 'Gemstones', color: '#3b82f6', visible: true },
                  { name: 'Settings', color: '#ef4444', visible: true },
                  { name: 'Band', color: '#f59e0b', visible: false }
                ].map((layer, i) => (
                  <div key={layer.name} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '4px 0',
                    borderBottom: i < 3 ? '1px solid #404040' : 'none'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: layer.color
                      }} />
                      <span style={{ fontSize: '12px', color: '#ffffff' }}>{i} - {layer.name}</span>
                    </div>
                    <button style={{
                      background: 'none',
                      border: 'none',
                      color: layer.visible ? '#10b981' : '#6b7280',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}>
                      {layer.visible ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Section */}
            <div style={{
              background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
              border: '1px solid #404040',
              borderRadius: '6px',
              padding: '12px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600'
              }}>Object Properties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['X', 'Y', 'Z'].map(coord => (
                  <div key={coord} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{ fontSize: '12px', color: '#ffffff', width: '20px' }}>{coord}:</span>
                    <input
                      type="number"
                      defaultValue="0.000"
                      style={{
                        background: '#1f1f1f',
                        border: '1px solid #404040',
                        borderRadius: '4px',
                        padding: '4px 8px',
                        color: '#ffffff',
                        fontSize: '11px',
                        width: '80px'
                      }}
                    />
                  </div>
                ))}
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: '4px' }}>Material:</div>
                  <select style={{
                    background: '#1f1f1f',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#ffffff',
                    fontSize: '11px',
                    width: '100%'
                  }}>
                    <option>14K Yellow Gold</option>
                    <option>18K White Gold</option>
                    <option>Platinum</option>
                    <option>Sterling Silver</option>
                    <option>14K Rose Gold</option>
                  </select>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#ffffff', marginBottom: '4px' }}>Ring Size:</div>
                  <select style={{
                    background: '#1f1f1f',
                    border: '1px solid #404040',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#ffffff',
                    fontSize: '11px',
                    width: '100%'
                  }}>
                    <option>6.0</option>
                    <option>6.5</option>
                    <option>7.0</option>
                    <option>7.5</option>
                    <option>8.0</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center - Design Viewport */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            flex: 1,
            background: 'radial-gradient(circle at center, #1a1a1a 0%, #0f0f0f 100%)',
            border: '1px solid #404040',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none'
            }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>💍</div>
              <div style={{
                fontSize: '28px',
                fontWeight: '700',
                background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '12px'
              }}>CraftedJewelz Professional</div>
              <div style={{ fontSize: '16px', color: '#9ca3af', marginBottom: '8px' }}>
                Professional Jewelry CAD Design Software
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>
                {currentTemplate ? `Active Template: ${currentTemplate}` : 'Start by selecting a tool or template'}
              </div>
              {selectedTool !== 'select' && (
                <div style={{
                  fontSize: '12px',
                  color: '#FFD700',
                  marginTop: '12px',
                  padding: '6px 12px',
                  background: 'rgba(255,215,0,0.1)',
                  borderRadius: '20px',
                  display: 'inline-block'
                }}>
                  Active Tool: {professionalTools.concat(jewelrySpecificTools).find((t: any) => t.id === selectedTool)?.name || selectedTool}
                </div>
              )}
            </div>

            {/* Grid overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
              `,
              backgroundSize: '20px 20px',
              opacity: 0.3
            }} />
          </div>
        </div>

        {/* Right Panel - Tools & History */}
        <div style={{
          width: '280px',
          background: 'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',
          borderLeft: '1px solid #404040',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
            borderBottom: '1px solid #404040',
            padding: '8px 12px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#FFD700'
          }}>
            Tools & History
          </div>

          <div style={{ padding: '12px', flex: 1 }}>
            <div style={{
              background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
              border: '1px solid #404040',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '12px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600'
              }}>Recent Actions</h3>
              <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                <div style={{ marginBottom: '4px' }}>• Tool selected: {selectedTool}</div>
                <div style={{ marginBottom: '4px' }}>• Ready for input</div>
                <div style={{ marginBottom: '4px' }}>• Grid: ON</div>
                <div style={{ marginBottom: '4px' }}>• Snap: ON</div>
              </div>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
              border: '1px solid #404040',
              borderRadius: '6px',
              padding: '12px'
            }}>
              <h3 style={{
                margin: '0 0 12px 0',
                color: '#FFD700',
                fontSize: '14px',
                fontWeight: '600'
              }}>Quick Stats</h3>
              <div style={{ fontSize: '12px', color: '#ffffff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Objects:</span>
                  <span>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Gemstones:</span>
                  <span>0</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>Est. Weight:</span>
                  <span>0.0g</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Est. Value:</span>
                  <span>$0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div style={{
        background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
        borderTop: '1px solid #404040',
        padding: '6px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#9ca3af'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span style={{ color: '#10b981' }}>READY</span>
          <span>SNAP</span>
          <span>GRID</span>
          <span>ORTHO</span>
          <span>POLAR</span>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <span>Units: mm</span>
          <span>Cursor: 0.00, 0.00, 0.00</span>
          <span style={{
            background: 'linear-gradient(45deg, #FFD700, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: '600'
          }}>CraftedJewelz Professional v3.0</span>
        </div>
      </div>

      {/* COMPREHENSIVE Template Library Dialog */}
      {showTemplates && (
        <div style={{
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #1f1f1f 0%, #1a1a1a 100%)',
            border: '1px solid #404040',
            borderRadius: '12px',
            maxWidth: '90vw',
            maxHeight: '90vh',
            width: '1200px',
            height: '800px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
          }}>
            {/* Template Dialog Header */}
            <div style={{
              background: 'linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%)',
              borderBottom: '1px solid #404040',
              padding: '16px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: '700',
                  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Comprehensive Jewelry Template Library</h2>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#9ca3af' }}>
                  Professional templates for all jewelry types - {Object.values(comprehensiveTemplates).flat().length} templates available
                </p>
              </div>
              <button
                onClick={() => setShowTemplates(false)}
                style={{
                  background: '#ef4444',
                  border: 'none',
                  color: '#ffffff',
                  width: '32px',
                  height: '32px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                ×
              </button>
            </div>

            {/* Template Categories */}
            <div style={{
              background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
              borderBottom: '1px solid #404040',
              padding: '12px 20px',
              display: 'flex',
              gap: '8px',
              flexWrap: 'wrap'
            }}>
              {templateCategories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    background: selectedCategory === category.id ?
                      'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)' :
                      'linear-gradient(135deg, #404040 0%, #353535 100%)',
                    border: 'none',
                    color: selectedCategory === category.id ? '#000000' : '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.2s'
                  }}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span style={{
                    fontSize: '11px',
                    opacity: 0.8,
                    background: selectedCategory === category.id ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                    padding: '2px 6px',
                    borderRadius: '10px'
                  }}>
                    {category.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div style={{
              padding: '20px',
              flex: 1,
              overflowY: 'auto',
              height: '600px'
            }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px'
              }}>
                {getCurrentTemplates().map((template, index) => (
                  <div
                    key={`${template.category}-${template.name}`}
                    onClick={() => {
                      setCurrentTemplate(`${template.category}: ${template.name}`);
                      setShowTemplates(false);
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #262626 0%, #1f1f1f 100%)',
                      border: '1px solid #404040',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      transform: 'translateY(0)'
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.borderColor = '#FFD700';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(255,215,0,0.2)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.borderColor = '#404040';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Template Preview */}
                    <div style={{
                      height: '120px',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px'
                    }}>
                      {template.preview}
                    </div>

                    {/* Template Info */}
                    <div style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <h4 style={{
                          margin: 0,
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#ffffff'
                        }}>
                          {template.name}
                        </h4>
                        <span style={{
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px',
                          background: template.difficulty === 'Beginner' ? '#10b981' :
                                   template.difficulty === 'Intermediate' ? '#f59e0b' :
                                   template.difficulty === 'Advanced' ? '#ef4444' : '#8b5cf6',
                          color: '#ffffff'
                        }}>
                          {template.difficulty}
                        </span>
                      </div>
                      <p style={{
                        margin: '0 0 8px 0',
                        fontSize: '12px',
                        color: '#9ca3af',
                        lineHeight: '1.4'
                      }}>
                        {template.description}
                      </p>
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280',
                        marginBottom: '6px'
                      }}>
                        <strong>Materials:</strong> {template.materials.join(', ')}
                      </div>
                      <div style={{
                        fontSize: '11px',
                        color: '#6b7280'
                      }}>
                        <strong>Est. Time:</strong> {template.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tool Tooltip */}
      {showToolTooltip && (
        <div style={{
          position: 'fixed',
          bottom: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.9)',
          color: '#ffffff',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          zIndex: 100,
          pointerEvents: 'none',
          border: '1px solid #404040'
        }}>
          {showToolTooltip}
        </div>
      )}
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ProfessionalCraftedJewelzInterface />
  </React.StrictMode>,
);
