import React from "react";
import ParametricModelingForm from "./ParametricModelingForm";
import DrawingExportForm from "./DrawingExportForm";
import StonePatternForm from "./StonePatternForm";
import ScriptingForm from "./ScriptingForm";
import MeasurementForm from "./MeasurementForm";
import AssemblyForm from "./AssemblyForm";
import Export3DForm from "./Export3DForm";
import PricingForm from "./PricingForm";
import ProjectManagementForm from "./ProjectManagementForm";
import MarketplaceForm from "./MarketplaceForm";
import CloudRenderForm from "./CloudRenderForm";
import TutorialsForm from "./TutorialsForm";
import GeometryViewport3D from "./GeometryViewport3D";
import JewelryTemplateLibraryForm from "./JewelryTemplateLibraryForm";
import WatchDesignModule from "./WatchDesignModule";
import GlassesDesignModule from "./GlassesDesignModule";
import AIAutomationSystem from "./AIAutomationSystem";

export default function CADFeaturePanel() {
  const plugins = [
    { key: "parametric", label: "Parametric Modeling", desc: "Stones, prongs, shanks, settings, chains" },
    { key: "3dpreview", label: "3D Preview & Rendering", desc: "Real-time, photorealistic" },
    { key: "templates", label: "Jewelry Template Library", desc: "Rings, bracelets, necklaces, earrings, pendants, chains" },
    { key: "gemselect", label: "Gemstone & Material Selection", desc: "Shape, cut, carat, metal type" },
    { key: "measure", label: "Measurement & Sizing Tools", desc: "Finger size, chain length, stone spacing" },
    { key: "assembly", label: "Assembly & Component Management", desc: "Multi-part, hinges, clasps" },
    { key: "export3d", label: "Export for 3D Printing & Casting", desc: "STL, OBJ, STEP" },
    { key: "drawings", label: "Automated Technical Drawings", desc: "Blueprints, cross-sections" },
    { key: "pricing", label: "Pricing & BOM Calculation", desc: "Materials, labor, stones" },
    { key: "projectmgmt", label: "Project Management", desc: "Versioning, client notes, history" },
    { key: "marketplace", label: "Marketplace for Plugins & Assets", desc: "Premium packs, assets, fonts" },
    { key: "cloud", label: "Cloud Rendering & Collaboration", desc: "Remote rendering, team workflows" },
    { key: "tutorials", label: "Tutorials & Guided Workflows", desc: "Step-by-step help" },

    // 🚀 PROFESSIONAL ADVANCED FEATURES 🚀
    { key: "watch-designer", label: "Professional Watch Designer ⌚", desc: "Design luxury and sport watches" },
    { key: "glasses-designer", label: "Eyewear Design Studio 👓", desc: "Professional optical and sunglasses design" },
    { key: "ai-automation", label: "AI Design Assistant 🤖", desc: "AI-powered design generation & optimization" },
  ];
  const [activePlugin, setActivePlugin] = React.useState<string | null>(null);

  return (
    <div className="cad-tool-panel">
      {/* Core Tools Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Core Tools</h3>
        <div className="space-y-1">
          {plugins.slice(0, 6).map(p => (
            <button
              key={p.key}
              onClick={() => setActivePlugin(p.key)}
              className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors group"
            >
              <div className="font-medium text-sm">{p.label}</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Professional Features Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide mb-3">
          ⭐ Professional Features
        </h3>
        <div className="space-y-1">
          {plugins.filter(p => ['watch-designer', 'glasses-designer', 'ai-automation'].includes(p.key)).map(p => (
            <button
              key={p.key}
              onClick={() => setActivePlugin(p.key)}
              className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-white transition-all group shadow-lg"
            >
              <div className="font-medium text-sm flex items-center gap-2">
                {p.label}
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded">PRO</span>
              </div>
              <div className="text-xs text-yellow-100 group-hover:text-white">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Tools Section */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-3">Advanced Tools</h3>
        <div className="space-y-1">
          {plugins.slice(6, -3).map(p => (
            <button
              key={p.key}
              onClick={() => setActivePlugin(p.key)}
              className="w-full text-left p-3 rounded-lg bg-slate-700 hover:bg-slate-600 text-white transition-colors group"
            >
              <div className="font-medium text-sm">{p.label}</div>
              <div className="text-xs text-slate-400 group-hover:text-slate-300">{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Modal for Tools */}
      {activePlugin && (
        <div className="plugin-modal fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`bg-white rounded-lg shadow-2xl ${
            ['watch-designer', 'glasses-designer', 'ai-automation'].includes(activePlugin)
              ? 'w-full h-full m-0 rounded-none'
              : 'p-6 min-w-[320px] max-w-[90vw] max-h-[90vh] overflow-auto'
          }`}>
            {!['watch-designer', 'glasses-designer', 'ai-automation'].includes(activePlugin) && (
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-slate-800">{plugins.find(p => p.key === activePlugin)?.label}</h3>
                <button
                  onClick={() => setActivePlugin(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>
            )}
            {activePlugin === "parametric" ? (
              <ParametricModelingForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "drawings" ? (
              <DrawingExportForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "gemselect" ? (
              <StonePatternForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "measure" ? (
              <MeasurementForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "assembly" ? (
              <AssemblyForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "export3d" ? (
              <Export3DForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "pricing" ? (
              <PricingForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "projectmgmt" ? (
              <ProjectManagementForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "marketplace" ? (
              <MarketplaceForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "cloud" ? (
              <CloudRenderForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "tutorials" ? (
              <TutorialsForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "3dpreview" ? (
              <GeometryViewport3D onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "templates" ? (
              <JewelryTemplateLibraryForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "scripting" ? (
              <ScriptingForm onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "watch-designer" ? (
              <WatchDesignModule onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "glasses-designer" ? (
              <GlassesDesignModule onClose={() => setActivePlugin(null)} />
            ) : activePlugin === "ai-automation" ? (
              <AIAutomationSystem onClose={() => setActivePlugin(null)} />
            ) : (
              <div className="text-sm text-gray-700 mb-4">Workflow and settings for this plugin will appear here.</div>
            )}
            {!["parametric","drawings","gemselect","scripting"].includes(activePlugin) && <button className="btn" onClick={() => setActivePlugin(null)}>Close</button>}
          </div>
        </div>
      )}
    </div>
  );
}
