import React from "react";
import { motion } from "framer-motion";

const recentFiles = [
  { name: "DiamondRingDesign.cjz", date: "Today" },
  { name: "GoldPendantDraft.cjz", date: "Yesterday" },
  { name: "3DKeychainModel.cjz", date: "2 days ago" },
];

export default function WelcomeScreen() {
  return (
    <div className="min-h-screen bg-neutral-900 text-gray-200 flex flex-col">
      {/* Header */}
      <header className="px-10 py-6 border-b border-neutral-800 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white tracking-wide">
          CraftedJewelz
        </h1>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg shadow">
          New Project
        </button>
      </header>

      {/* Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 border-r border-neutral-800 p-6 space-y-4">
          <button className="w-full text-left hover:bg-neutral-800 px-4 py-2 rounded">
            Home
          </button>
          <button className="w-full text-left hover:bg-neutral-800 px-4 py-2 rounded">
            Templates
          </button>
          <button className="w-full text-left hover:bg-neutral-800 px-4 py-2 rounded">
            Marketplace
          </button>
          <button className="w-full text-left hover:bg-neutral-800 px-4 py-2 rounded">
            Settings
          </button>
        </aside>

        {/* Main area */}
        <main className="flex-1 p-10">
          <motion.h2
            className="text-xl font-semibold mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Recent Projects
          </motion.h2>
          <ul className="space-y-3">
            {recentFiles.map((file, idx) => (
              <motion.li
                key={idx}
                className="flex justify-between items-center bg-neutral-800 p-4 rounded-lg hover:bg-neutral-700 cursor-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <span>{file.name}</span>
                <span className="text-sm text-gray-400">{file.date}</span>
              </motion.li>
            ))}
          </ul>
        </main>
      </div>
    </div>
  );
}
