import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import {
  Wifi,
  WifiOff,
  Search,
  Filter,
  Smartphone,
  Tablet,
  Printer,
  Monitor,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Trash2,
  Plus,
  X,
  Loader2,
  FileText,
} from 'lucide-react';

import withAdminLayout from '../AdminPanel/withAdminLayout';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setMdmLoading,
  setDevicesData,
  patchDevice,
  setSessionLogs,
  setActionLoading,
  setMdmError,
} from '../../Store/Features/mdm/mdmSlice';
import { mdmService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isDeviceOnline = (d) => {
  if (!d) return false;
  if (d.isActive === false) return false;
  if (!d.Last_Seen) return false;
  // Consider "online" if last seen within 24h
  const diff = Date.now() - new Date(d.Last_Seen).getTime();
  return diff < 24 * 60 * 60 * 1000;
};

const formatDate = (iso) => {
  if (!iso) return 'Never';
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Never';
  }
};

const DeviceIcon = ({ type }) => {
  const props = { className: 'text-purple-600', size: 20 };
  switch (type) {
    case 'Tablet':
      return <Tablet {...props} />;
    case 'POS Terminal':
      return <Monitor {...props} />;
    case 'Printer':
      return <Printer {...props} />;
    default:
      return <Smartphone {...props} />;
  }
};

// ---------------------------------------------------------------------------
// Status badge
// ---------------------------------------------------------------------------
const StatusBadge = ({ online }) => (
  <div
    className={`flex items-center gap-1.5 text-sm font-medium ${
      online ? 'text-green-600' : 'text-red-500'
    }`}
  >
    <div
      className={`w-2 h-2 rounded-full ${
        online ? 'bg-green-500' : 'bg-red-500'
      }`}
    ></div>
    {online ? 'Online' : 'Offline'}
  </div>
);

// ---------------------------------------------------------------------------
// Action modals
// ---------------------------------------------------------------------------

// Lock modal
const LockModal = ({ device, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('Device reported lost');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Lock Device</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Locking <strong>{device?.Name}</strong> will prevent it from being
            used until unlocked.
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            Lock Device
          </button>
        </div>
      </div>
    </div>
  );
};

// Restart modal
const RestartModal = ({ device, onClose, onConfirm, loading }) => {
  const [form, setForm] = useState({
    Restart_Reason: 'Apply configuration changes',
    Scheduled_Restart: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16),
    Restart_Queue: 'maintenance',
    Restart_Success_Confirmation: 'Required',
    Auto_Recovery_Mode: true,
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Restart Device</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Restart <strong>{device?.Name}</strong>. You can schedule it in the
            future.
          </p>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Reason
            </label>
            <input
              type="text"
              value={form.Restart_Reason}
              onChange={(e) => update('Restart_Reason', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Scheduled Time
            </label>
            <input
              type="datetime-local"
              value={form.Scheduled_Restart}
              onChange={(e) => update('Scheduled_Restart', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="autoRecovery"
              checked={form.Auto_Recovery_Mode}
              onChange={(e) => update('Auto_Recovery_Mode', e.target.checked)}
              className="w-4 h-4 accent-purple-600"
            />
            <label htmlFor="autoRecovery" className="text-sm text-gray-700">
              Auto Recovery Mode
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(form)}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
            Schedule Restart
          </button>
        </div>
      </div>
    </div>
  );
};

// Update modal
const UpdateModal = ({ device, onClose, onConfirm, loading }) => {
  const [version, setVersion] = useState(device?.App_Version || 'v3.2.2');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900">Push Update</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-600">
            Push a new app version to <strong>{device?.Name}</strong>.
          </p>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              App Version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(version)}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-lg hover:opacity-90 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Push Update
          </button>
        </div>
      </div>
    </div>
  );
};

// Wipe modal (2-step)
const WipeModal = ({ device, onClose, onInitiate, onVerify, loading }) => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [mode, setMode] = useState('Full Factory Reset');

  const handleNext = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Email and password are required');
      return;
    }
    const ok = await onInitiate({ email, password });
    if (ok) setStep(2);
  };

  const handleWipe = async () => {
    if (!otp.trim()) {
      toast.error('OTP is required');
      return;
    }
    await onVerify({ otp, mode });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-red-500" />
            Wipe Device
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-700">
                ⚠️ This will erase all data on <strong>{device?.Name}</strong>.
                This action cannot be undone.
              </div>
              <p className="text-sm text-gray-600">
                Confirm your admin credentials to proceed.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-600">
                Enter the OTP sent to your email to confirm the wipe.
              </p>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  maxLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-center tracking-[0.5em] font-bold focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Wipe Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option>Full Factory Reset</option>
                  <option>Selective Wipe</option>
                  <option>Enterprise Reset</option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={step === 1 ? handleNext : handleWipe}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : step === 1 ? (
              'Continue'
            ) : (
              'Wipe Device'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// Session logs modal
const SessionLogsModal = ({ device, logs, loading, onClose, onExport }) => (
  <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <div>
          <h3 className="font-bold text-gray-900">Session Logs</h3>
          <p className="text-xs text-gray-500 mt-0.5">{device?.Name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <FileText className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading logs…</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <FileText className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No session logs</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Description
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map((log) => (
                <tr key={log._id}>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {formatDate(log.CreateAt)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-gray-800 font-medium">{log.Action}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{log.Description}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        log.Status === 'Completed'
                          ? 'bg-green-50 text-green-700'
                          : log.Status === 'Queued'
                          ? 'bg-yellow-50 text-yellow-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {log.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const MomPage = () => {
  const dispatch = useAppDispatch();

  const { devices, loading, hasLoaded } = useAppSelector((state) => state.mdm);
  const [actionLoading, setLocalActionLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState('All Devices');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal state
  const [modal, setModal] = useState(null); // { type, device }
  const [sessionLogs, setSessionLogs] = useState([]);
  const [sessionLogsLoading, setSessionLogsLoading] = useState(false);

  // ✅ Fetch devices on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchDevices = async () => {
      dispatch(setMdmLoading(true));
      try {
        const result = await mdmService.getAllDevices();
        dispatch(setDevicesData(result));
      } catch (err) {
        console.error('MDM fetch error:', err);
        dispatch(setMdmError(err?.message || 'Failed to load devices'));
        toast.error('Failed to load devices', {
          description: err?.message || 'Please try again.',
        });
      }
    };

    fetchDevices();
  }, [dispatch]);

  // Stats
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(isDeviceOnline).length;
  const offlineDevices = totalDevices - onlineDevices;
  const needsUpdate = devices.filter((d) => d.Needs_Update).length;

  // Filtered
  const filteredDevices = devices.filter((d) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matches =
        d.Name?.toLowerCase().includes(q) ||
        d.Devices_ModelNo?.toLowerCase().includes(q) ||
        d.Serial_Number?.toLowerCase().includes(q);
      if (!matches) return false;
    }
    const online = isDeviceOnline(d);
    if (activeFilter === 'All Devices') return true;
    if (activeFilter === 'Online') return online;
    if (activeFilter === 'Offline') return !online;
    if (activeFilter === 'Active') return d.isActive;
    if (activeFilter === 'Idle') return !d.isActive;
    if (activeFilter === 'Sync Delay') return d.Needs_Update;
    return true;
  });

  // ---- Action handlers ----
  const handleLock = async (reason) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    const toastId = toast.loading('Locking device...');
    try {
      await mdmService.lockDevice(id, reason);
      dispatch(patchDevice({ id, changes: { isLocked: true } }));
      toast.success('Device locked', { id: toastId });
      setModal(null);
    } catch (err) {
      toast.error('Failed to lock device', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  const handleRestart = async (payload) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    const toastId = toast.loading('Scheduling restart...');
    try {
      await mdmService.restartDevice(id, payload);
      dispatch(
        patchDevice({
          id,
          changes: {
            Last_Restart_Status: 'Queued',
            Scheduled_Restart: payload.Scheduled_Restart,
          },
        })
      );
      toast.success('Restart scheduled', { id: toastId });
      setModal(null);
    } catch (err) {
      toast.error('Failed to schedule restart', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  const handleUpdate = async (version) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    const toastId = toast.loading('Pushing update...');
    try {
      await mdmService.pushUpdate(id, version);
      dispatch(patchDevice({ id, changes: { Needs_Update: false } }));
      toast.success('Update pushed', { id: toastId });
      setModal(null);
    } catch (err) {
      toast.error('Failed to push update', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  const handleWipeInitiate = async ({ email, password }) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    try {
      await mdmService.wipeDevice(id, { email, password });
      toast.success('OTP sent to your email');
      return true;
    } catch (err) {
      toast.error('Failed to initiate wipe', {
        description: err?.message || 'Please try again.',
      });
      return false;
    } finally {
      setLocalActionLoading(false);
    }
  };

  const handleWipeVerify = async ({ otp, mode }) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    const toastId = toast.loading('Wiping device...');
    try {
      await mdmService.verifyWipeDevice(id, { otp, mode });
      dispatch(
        patchDevice({ id, changes: { WipedAt: new Date().toISOString() } })
      );
      toast.success('Device wiped', { id: toastId });
      setModal(null);
    } catch (err) {
      toast.error('Failed to wipe device', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  const openSessionLogs = async (device) => {
    setModal({ type: 'logs', device });
    setSessionLogsLoading(true);
    setSessionLogs([]);
    try {
      const result = await mdmService.getSessionLogs(device.MyDevices_id);
      setSessionLogs(result.logs || []);
    } catch (err) {
      toast.error('Failed to load session logs', {
        description: err?.message || 'Please try again.',
      });
    } finally {
      setSessionLogsLoading(false);
    }
  };

  const exportLogs = () => {
    if (!sessionLogs.length) {
      toast.error('No logs to export');
      return;
    }
    const rows = [
      ['Date', 'Action', 'Description', 'Status'],
      ...sessionLogs.map((l) => [
        l.CreateAt,
        l.Action,
        `"${(l.Description || '').replace(/"/g, '""')}"`,
        l.Status,
      ]),
    ];
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `session-logs-${modal.device.MyDevices_id}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV downloaded');
  };

  const ActionButton = ({ icon: Icon, label, onClick, color = 'text-gray-500', hoverColor = 'hover:text-gray-700' }) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${color} ${hoverColor}`}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* ============== Header ============== */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            MDM Device Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {totalDevices} device{totalDevices !== 1 ? 's' : ''} in fleet
          </p>
        </div>
      </div>

      {/* ============== Stats ============== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              Total Devices
            </span>
            <Smartphone className="text-gray-400" size={18} />
          </div>
          <div className="text-2xl font-bold text-gray-800 tabular-nums">
            {totalDevices}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              Online Devices
            </span>
            <Wifi className="text-green-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-green-600 tabular-nums">
            {onlineDevices}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {totalDevices > 0
              ? Math.round((onlineDevices / totalDevices) * 100)
              : 0}
            % uptime
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              Offline Devices
            </span>
            <WifiOff className="text-red-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-red-500 tabular-nums">
            {offlineDevices}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            Requires attention
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              Needs Update
            </span>
            <Download className="text-orange-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-orange-500 tabular-nums">
            {needsUpdate}
          </div>
          <div className="text-xs text-gray-400 mt-1">Updates available</div>
        </div>
      </div>

      {/* ============== Filter bar ============== */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {['All Devices', 'Online', 'Offline', 'Active', 'Idle', 'Sync Delay'].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                  activeFilter === filter
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {filter}
              </button>
            )
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search devices..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
        </div>
      </div>

      {/* ============== Table ============== */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !hasLoaded ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading devices…</span>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Smartphone className="w-8 h-8" />
            <p className="text-sm font-medium text-gray-500">
              No devices found
            </p>
            <p className="text-xs text-gray-400">
              Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Device Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">App Version</th>
                  <th className="px-6 py-4">Last Seen</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map((device) => {
                  const online = isDeviceOnline(device);
                  return (
                    <tr
                      key={device._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <StatusBadge online={online} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openSessionLogs(device)}
                          className="flex items-center gap-3 text-left hover:opacity-80"
                          title="View session logs"
                        >
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <DeviceIcon type={device.type} />
                          </div>
                          <div>
                            <div className="font-semibold text-gray-800">
                              {device.Name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {device.Devices_ModelNo || 'Unknown Model'}
                            </div>
                          </div>
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {device.location || 'N/A'}
                        </div>
                        <div className="text-xs text-gray-400">
                          {device.Merchant_Assignment || ''}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {device.App_Version || '—'}
                        </div>
                        {device.Needs_Update && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">
                            Update Available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {formatDate(device.Last_Seen)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <ActionButton
                            icon={device.isLocked ? Unlock : Lock}
                            label={device.isLocked ? 'Locked' : 'Lock'}
                            onClick={() => setModal({ type: 'lock', device })}
                            color={device.isLocked ? 'text-red-500' : 'text-gray-500'}
                          />
                          <ActionButton
                            icon={RotateCcw}
                            label="Restart"
                            onClick={() => setModal({ type: 'restart', device })}
                          />
                          <ActionButton
                            icon={Download}
                            label="Push Update"
                            onClick={() => setModal({ type: 'update', device })}
                          />
                          <ActionButton
                            icon={Trash2}
                            label="Wipe"
                            onClick={() => setModal({ type: 'wipe', device })}
                            color="text-red-400"
                            hoverColor="hover:text-red-600"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============== Modals ============== */}
      {modal?.type === 'lock' && (
        <LockModal
          device={modal.device}
          onClose={() => setModal(null)}
          onConfirm={handleLock}
          loading={actionLoading}
        />
      )}
      {modal?.type === 'restart' && (
        <RestartModal
          device={modal.device}
          onClose={() => setModal(null)}
          onConfirm={handleRestart}
          loading={actionLoading}
        />
      )}
      {modal?.type === 'update' && (
        <UpdateModal
          device={modal.device}
          onClose={() => setModal(null)}
          onConfirm={handleUpdate}
          loading={actionLoading}
        />
      )}
      {modal?.type === 'wipe' && (
        <WipeModal
          device={modal.device}
          onClose={() => setModal(null)}
          onInitiate={handleWipeInitiate}
          onVerify={handleWipeVerify}
          loading={actionLoading}
        />
      )}
      {modal?.type === 'logs' && (
        <SessionLogsModal
          device={modal.device}
          logs={sessionLogs}
          loading={sessionLogsLoading}
          onClose={() => setModal(null)}
          onExport={exportLogs}
        />
      )}
    </div>
  );
};

export default withAdminLayout(MomPage);