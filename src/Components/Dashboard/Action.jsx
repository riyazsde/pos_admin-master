import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Package, ClipboardList } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function Action() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const actions = [
    {
      id: 1,
      labelKey: 'quickActions.addClient',
      icon: Plus,
      bg: 'bg-[#FFD1D1]', // Pastel Pink
      path: '/create-clients',
    },
    {
      id: 2,
      labelKey: 'quickActions.generateReport',
      icon: Calendar,
      bg: 'bg-[#E0D4FC]', // Pastel Purple
      path: '/report',
    },
    {
      id: 3,
      labelKey: 'quickActions.manageInventory',
      icon: Package,
      bg: 'bg-[#BDFCC9]', // Pastel Green
      path: '/pos-device',
    },
    {
      id: 4,
      labelKey: 'quickActions.viewSubscriptions',
      icon: ClipboardList,
      bg: 'bg-[#FFF3CD]', // Pastel Yellow
      path: '/subscription-list',
    },
  ];

  return (
    <section className="w-full">
      <h2 className="mb-4 text-lg font-bold text-gray-900">
        {t('quickActions.title')}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map(({ id, labelKey, icon: Icon, bg, path }) => (
          <button
            key={id}
            type="button"
            onClick={() => navigate(path)}
            className={`flex w-full flex-col items-center justify-center gap-3 rounded-xl p-6 transition-all hover:brightness-95 ${bg}`}
          >
            <Icon className="h-7 w-7 text-gray-800" strokeWidth={1.5} />
            <span className="text-sm font-semibold text-gray-800">
              {t(labelKey)}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default Action;