// components/AdminSettings/SettingsRow.jsx
import React from 'react';
import { Pencil, ChevronRight } from 'lucide-react';

const SettingsRow = ({ label, hasChevron = false }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
    <p className="text-gray-800 font-medium">{label}</p>
    <button className="focus:outline-none">
      {hasChevron ? (
        <ChevronRight className="w-5 h-5 text-gray-600" />
      ) : (
        <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
          <Pencil className="w-3.5 h-3.5 text-white" />
        </div>
      )}
    </button>
  </div>
);

export default SettingsRow;
