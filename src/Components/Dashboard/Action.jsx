import React from 'react';
import { Plus, Calendar, Package, ClipboardList } from 'lucide-react';

function Action() {
  const actions = [
    {
      id: 1,
      label: 'Add Client',
      icon: Plus,
      bg: 'bg-[#FFD1D1]', // Pastel Pink
    },
    {
      id: 2,
      label: 'Generate Report',
      icon: Calendar,
      bg: 'bg-[#E0D4FC]', // Pastel Purple
    },
    {
      id: 3,
      label: 'Manage Inventory',
      icon: Package,
      bg: 'bg-[#BDFCC9]', // Pastel Green
    },
    {
      id: 4,
      label: 'View Subscriptions',
      icon: ClipboardList,
      bg: 'bg-[#FFF3CD]', // Pastel Yellow
    },
  ];

  return (
    <section className="w-full">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ id, label, icon: Icon, bg }) => (
          <button
            key={id}
            type="button"
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl p-6 transition-all hover:brightness-95 ${bg}`}
          >
            {/* Icon with dark color to match design */}
            <Icon className="h-7 w-7 text-gray-800" strokeWidth={1.5} />
            
            {/* Text */}
            <span className="text-sm font-semibold text-gray-800">
              {label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Action;