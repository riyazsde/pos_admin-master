// src/Components/Clients/ViewEmployeesModal.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import {
  Loader2,
  X,
  Search,
  Users,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Clock,
  Star,
  ShoppingBag,
  DollarSign,
} from 'lucide-react';
import { employeeService } from '../../Services/apiService';

const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || '?';

const RoleBadge = ({ role }) => (
  <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 text-[11px] font-semibold">
    {role}
  </span>
);

const EmployeeRow = ({ emp, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition text-left"
  >
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6A1B9A] to-[#D32F2F] text-white flex items-center justify-center font-semibold text-sm shrink-0 overflow-hidden">
      {emp.image ? (
        <img
          src={emp.image}
          alt={emp.name}
          className="w-full h-full object-cover"
        />
      ) : (
        initials(emp.name)
      )}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-gray-900 truncate">
        {emp.name}
      </p>
      <p className="text-xs text-gray-500 truncate">
        {emp.email}
        {emp.timing ? ` · ${emp.timing}` : ''}
      </p>
    </div>
    <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
  </button>
);

const InfoTile = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-50 rounded-lg p-3">
    <div className="flex items-center gap-1.5 text-gray-500 mb-1">
      <Icon className="w-3.5 h-3.5" />
      <p className="text-xs font-medium">{label}</p>
    </div>
    <p className="text-sm font-semibold text-gray-900 truncate">
      {value ?? '—'}
    </p>
  </div>
);

const EmployeeDetail = ({ empId, onBack }) => {
  const { t } = useTranslation();
  const [emp, setEmp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    employeeService
      .getById(empId)
      .then((d) => !cancelled && setEmp(d))
      .catch((err) => !cancelled && setError(err.message))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [empId]);

  if (loading) {
    return (
      <div className="py-10 flex items-center justify-center gap-2 text-gray-500 text-sm">
        <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
        {t('common.loading', 'Loading…')}
      </div>
    );
  }
  if (error || !emp) {
    return (
      <div className="py-6 text-center text-red-500 text-sm">
        {error || 'Employee not found'}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1 text-sm text-purple-600 hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        {t('employees.backToList', 'Back to employees')}
      </button>

      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#6A1B9A] to-[#D32F2F] text-white flex items-center justify-center text-xl font-semibold overflow-hidden">
          {emp.image ? (
            <img
              src={emp.image}
              alt={emp.name}
              className="w-full h-full object-cover"
            />
          ) : (
            initials(emp.name)
          )}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-gray-900 truncate">
            {emp.name}
          </h3>
          <p className="text-sm text-gray-500 truncate">{emp.email}</p>
          <div className="mt-1 flex items-center gap-2">
            <RoleBadge role={emp.role} />
            <span
              className={`text-xs font-medium ${
                emp.isActive ? 'text-green-600' : 'text-red-500'
              }`}
            >
              {emp.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <InfoTile icon={Mail} label="Email" value={emp.email} />
        <InfoTile icon={Phone} label="Phone" value={emp.phone} />
        <InfoTile
          icon={Clock}
          label="Timing / Shift"
          value={emp.timing || '—'}
        />
        <InfoTile
          icon={ShoppingBag}
          label="Orders"
          value={emp.performance.orders}
        />
        <InfoTile
          icon={DollarSign}
          label="Revenue"
          value={emp.performance.revenue}
        />
        <InfoTile
          icon={Star}
          label="Rating"
          value={emp.performance.rating ?? '—'}
        />
      </div>
    </div>
  );
};

const ViewEmployeesModal = ({
  clientId,
  restaurantUserId,
  businessName,
  onClose,
}) => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedEmpId, setSelectedEmpId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (restaurantUserId) {
          result = await employeeService.getByRestaurant(restaurantUserId);
        } else if (clientId) {
          result = await employeeService.getByClient(clientId);
        } else {
          throw new Error('Missing clientId or restaurantUserId');
        }
        if (!cancelled) setData(result);
      } catch (err) {
        if (!cancelled) {
          const msg = err?.message || 'Failed to load employees';
          setError(msg);
          toast.error(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [clientId, restaurantUserId]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!data) return { grouped: {}, total: 0 };
    const q = search.trim().toLowerCase();
    if (!q) return { grouped: data.grouped, total: data.employees.length };

    const matched = data.employees.filter(
      (e) =>
        (e.name || '').toLowerCase().includes(q) ||
        (e.email || '').toLowerCase().includes(q) ||
        (e.role || '').toLowerCase().includes(q)
    );
    const grouped = matched.reduce((acc, emp) => {
      const key = emp.role || 'Unassigned';
      if (!acc[key]) acc[key] = [];
      acc[key].push(emp);
      return acc;
    }, {});
    return { grouped, total: matched.length };
  }, [data, search]);

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[720px] max-h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                {t('employees.title', 'Employee Details')}
              </h2>
              <p className="text-xs text-gray-500 truncate">
                {businessName
                  ? `${t('employees.for', 'For')} ${businessName}`
                  : ''}
                {data
                  ? ` · ${data.total} ${t('employees.total', 'total')}`
                  : ''}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-800 ml-2"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {selectedEmpId ? (
            <EmployeeDetail
              empId={selectedEmpId}
              onBack={() => setSelectedEmpId(null)}
            />
          ) : loading ? (
            <div className="py-12 flex flex-col items-center gap-3 text-gray-500 text-sm">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              {t('employees.loading', 'Loading employees…')}
            </div>
          ) : error ? (
            <div className="py-10 text-center text-red-500 text-sm">
              {error}
            </div>
          ) : filtered.total === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              {t('employees.empty', 'No employees found')}
            </div>
          ) : (
            <>
              {/* Search */}
              <div className="relative mb-5">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t(
                    'employees.search',
                    'Search by name, email, or role…'
                  )}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Role summary chips */}
              {data.roleCounts?.length > 0 && !search && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {data.roleCounts.map((r) => (
                    <span
                      key={r.role}
                      className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-medium"
                    >
                      {r.role}: {r.count}
                    </span>
                  ))}
                </div>
              )}

              {/* Grouped list */}
              <div className="space-y-6">
                {Object.entries(filtered.grouped).map(([role, emps]) => (
                  <div key={role}>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-sm font-semibold text-gray-800">
                        {role}
                      </h3>
                      <span className="text-xs text-gray-400">
                        ({emps.length})
                      </span>
                    </div>
                    <div className="space-y-1">
                      {emps.map((emp) => (
                        <EmployeeRow
                          key={emp.userId || emp.email}
                          emp={emp}
                          onClick={() => setSelectedEmpId(emp.userId)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeesModal;