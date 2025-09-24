import React from 'react';

interface RecentItemProps {
  name: string;
  updated: string;
}

const RecentItem: React.FC<RecentItemProps> = ({ name, updated }) => (
  <div className="recent-item bg-white border rounded shadow-sm px-4 py-2 flex flex-col gap-1 hover:bg-indigo-50 transition">
    <span className="font-semibold text-gray-800">{name}</span>
    <span className="text-xs text-gray-500">Last updated: {updated}</span>
  </div>
);

export default RecentItem;
