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
  ];
  const [activePlugin, setActivePlugin] = React.useState<string | null>(null);
  return (
    <section className="panel-card advanced-features">
      <h2>Advanced CAD Features & Plugins</h2>
      <div className="plugin-grid grid grid-cols-2 gap-3 mt-2">
        {plugins.map(p => (
          <div key={p.key} className="plugin-card bg-white border rounded shadow-sm p-3 flex flex-col gap-1 hover:bg-indigo-50 transition">
            <div className="font-bold text-indigo-700">{p.label}</div>
            <div className="text-xs text-gray-600">{p.desc}</div>
            <button className="btn mt-2" onClick={() => setActivePlugin(p.key)}>Enable</button>
          </div>
        ))}
      </div>
      {activePlugin && (
        <div className="plugin-modal fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow-lg p-6 min-w-[320px] max-w-[90vw]">
            <h3 className="font-bold text-lg mb-2">{plugins.find(p => p.key === activePlugin)?.label} Plugin</h3>
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
            ) : (
              <div className="text-sm text-gray-700 mb-4">Workflow and settings for this plugin will appear here.</div>
            )}
            {!["parametric","drawings","gemselect","scripting"].includes(activePlugin) && <button className="btn" onClick={() => setActivePlugin(null)}>Close</button>}
          </div>
        </div>
      )}
      <div className="feature-note mt-4">* These features are in development. Contact us for early access or partnership.</div>
    </section>
  );
}
