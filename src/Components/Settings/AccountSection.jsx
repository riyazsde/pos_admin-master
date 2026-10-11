// src/Components/Settings/AccountSection.jsx

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { 
  Pencil, 
  ChevronRight, 
  Shield, 
  Monitor, 
  Smartphone, 
  Tablet, 
  AlertTriangle, 
  Key, 
  FileText,
  X,
  Copy,
  Trash2,
  Plus,
  CheckCircle2,
  XCircle,
  MapPin,
  Loader2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import { accountSettingsService } from '../../Services/apiService';
import { setProfile } from '../../Store/Features/subadmin/subadminSlice';

// ============================================================
// --- Reusable UI Components ---
// ============================================================

const ModalWrapper = ({ title, icon: Icon, onClose, children, maxWidth = 'max-w-lg' }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
    <div className={`bg-white rounded-xl shadow-2xl w-full ${maxWidth} overflow-hidden flex flex-col max-h-[90vh]`}>
      <div 
        className="flex items-center justify-between p-4 text-white shrink-0"
        style={{ background: 'linear-gradient(90deg, #6A1B9A 0%, #D32F2F 100%)' }}
      >
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-5 h-5" />}
          <h3 className="font-semibold text-lg">{title}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-5 overflow-y-auto flex-1">
        {children}
      </div>
    </div>
  </div>
);

const LoadingState = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-10 text-gray-500">
      <Loader2 className="w-8 h-8 animate-spin mb-2 text-purple-600" />
      <p className="text-sm">{t('accountSettings.common.loading')}</p>
    </div>
  );
};

const EmptyState = ({ message, icon: Icon = Shield }) => (
  <div className="flex flex-col items-center justify-center py-10 text-gray-500">
    <Icon className="w-10 h-10 mb-2 text-gray-300" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

const copyToClipboard = (text) => {
  navigator.clipboard.writeText(text).catch(() => {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  });
};

// ============================================================
// --- Two-Factor Auth Modal ---
// ============================================================

const TwoFactorAuthModal = ({ onClose }) => {
  const { t } = useTranslation();

  return (
    <ModalWrapper title={t('accountSettings.twoFactor.title')} icon={Shield} onClose={onClose}>
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
          <div>
            <p className="font-medium text-gray-800 text-sm">{t('accountSettings.twoFactor.status')}</p>
            <p className="text-xs text-gray-500">{t('accountSettings.twoFactor.enabledMessage')}</p>
          </div>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
            {t('accountSettings.twoFactor.enabled')}
          </span>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">{t('accountSettings.twoFactor.aboutTitle')}</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('accountSettings.twoFactor.aboutDescription')}
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-gray-800 mb-2 text-sm">{t('accountSettings.twoFactor.supportedMethods')}</h4>
          <ul className="text-sm text-gray-600 space-y-1.5 list-disc pl-4 marker:text-purple-600">
            <li>{t('accountSettings.twoFactor.methods.authenticator')}</li>
            <li>{t('accountSettings.twoFactor.methods.sms')}</li>
            <li>{t('accountSettings.twoFactor.methods.email')}</li>
          </ul>
        </div>

        <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
          <h4 className="font-semibold text-orange-800 mb-1 text-sm">{t('accountSettings.twoFactor.backupCodeTitle')}</h4>
          <p className="text-xs text-orange-700 mb-3">{t('accountSettings.twoFactor.backupCodeDescription')}</p>
          <div className="flex items-center justify-between bg-white border border-orange-200 rounded p-2">
            <code className="text-sm font-mono text-gray-700">TRXX-4829-9273-1847</code>
            <button
              onClick={() => {
                copyToClipboard('TRXX-4829-9273-1847');
                toast.success(t('accountSettings.toasts.backupCodeCopied'));
              }}
              className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" /> {t('accountSettings.common.copy')}
            </button>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
            {t('accountSettings.twoFactor.disableButton')}
          </button>
          <button onClick={onClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
            {t('accountSettings.common.close')}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ============================================================
// --- Active Sessions Modal ---
// ============================================================

const ActiveSessionsModal = ({ onClose, onChanged }) => {
  const { t } = useTranslation();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const data = await accountSettingsService.getSessions();
        setSessions(data);
      } catch (err) {
        setError(err.message || t('accountSettings.sessions.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, [t]);

  const handleRevoke = async (sessionId) => {
    try {
      await accountSettingsService.revokeSession(sessionId);
      setSessions(prev => prev.filter(s => s.session_id !== sessionId));
      toast.success(t('accountSettings.toasts.sessionRevoked'));
      onChanged?.();  // ✅ notify parent to refresh counts
    } catch (err) {
      toast.error(err.message || t('accountSettings.toasts.sessionRevokeFailed'));
    }
  };

  const handleClose = () => {
    onChanged?.();    // ✅ refresh counts on close too
    onClose();
  };

  if (loading) return <ModalWrapper title={t('accountSettings.sessions.title')} icon={Monitor} onClose={handleClose}><LoadingState /></ModalWrapper>;
  if (error) return <ModalWrapper title={t('accountSettings.sessions.title')} icon={Monitor} onClose={handleClose}><EmptyState message={error} /></ModalWrapper>;

  return (
    <ModalWrapper title={t('accountSettings.sessions.title')} icon={Monitor} onClose={handleClose}>
      <p className="text-sm text-gray-500 mb-4">{t('accountSettings.sessions.description')}</p>
      
      <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
        {sessions.length === 0 ? (
          <EmptyState message={t('accountSettings.sessions.empty')} />
        ) : (
          sessions.map((session) => {
            const Icon = session.device === 'Mobile' ? Smartphone : Monitor;
            return (
              <div key={session.session_id} className={`border rounded-lg p-4 ${session.current ? 'border-green-200 bg-green-50/50' : 'border-gray-200'}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="font-semibold text-gray-800 text-sm">
                      {session.device} - {session.browser}
                    </span>
                    {session.current && (
                      <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {t('accountSettings.sessions.current')}
                      </span>
                    )}
                  </div>
                  {!session.current && (
                    <button 
                      onClick={() => handleRevoke(session.session_id)}
                      className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs font-semibold transition-colors"
                    >
                      {t('accountSettings.sessions.revoke')}
                    </button>
                  )}
                </div>
                <div className="text-xs text-gray-500 space-y-1 ml-7">
                  <p>{session.operatingSystem} • {session.ipAddress === '::1' ? 'Localhost' : session.ipAddress}</p>
                  <p>
                    {session.current
                      ? t('accountSettings.sessions.activeNow')
                      : t('accountSettings.sessions.lastActive', { time: new Date(session.lastActivityAt).toLocaleString() })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex gap-3">
        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg text-sm font-medium transition-colors">
          {t('accountSettings.sessions.revokeAllOther')}
        </button>
        <button onClick={handleClose} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {t('accountSettings.common.close')}
        </button>
      </div>
    </ModalWrapper>
  );
};

// ============================================================
// ✅ Add Device Modal
// ============================================================

const AddDeviceModal = ({ onClose, onAdded }) => {
  const { t } = useTranslation();
  const [deviceName, setDeviceName] = useState('');
  const [deviceType, setDeviceType] = useState('Desktop');
  const [submitting, setSubmitting] = useState(false);

  const deviceTypes = [
    { value: 'Desktop', labelKey: 'desktop', icon: Monitor },
    { value: 'Mobile', labelKey: 'mobile', icon: Smartphone },
    { value: 'Tablet', labelKey: 'tablet', icon: Tablet },
  ];

  const handleAdd = async () => {
    if (!deviceName.trim()) {
      toast.warning(t('accountSettings.toasts.deviceNameRequired'));
      return;
    }

    try {
      setSubmitting(true);
      await accountSettingsService.addTrustedDevice({
        device_name: deviceName.trim(),
        device_type: deviceType,
      });
      toast.success(t('accountSettings.toasts.deviceAdded', { name: deviceName.trim() }));
      onAdded?.();
      onClose();
    } catch (err) {
      toast.error(err.message || t('accountSettings.toasts.deviceAddFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      title={t('accountSettings.addDevice.title')}
      icon={Plus}
      onClose={onClose}
      maxWidth="max-w-md"
    >
      <div className="space-y-5">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {t('accountSettings.addDevice.deviceName')}
          </label>
          <input
            type="text"
            value={deviceName}
            onChange={(e) => setDeviceName(e.target.value)}
            placeholder={t('accountSettings.addDevice.deviceNamePlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {t('accountSettings.addDevice.deviceType')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {deviceTypes.map(({ value, labelKey, icon: Icon }) => {
              const isSelected = deviceType === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDeviceType(value)}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">
                    {t(`accountSettings.addDevice.types.${labelKey}`)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {t('accountSettings.common.cancel')}
          </button>
          <button
            onClick={handleAdd}
            disabled={!deviceName.trim() || submitting}
            className="flex-1 bg-[#6A1B9A] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('accountSettings.addDevice.adding')}
              </>
            ) : (
              t('accountSettings.addDevice.addButton')
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ============================================================
// --- Trusted Devices Modal ---
// ============================================================

const TrustedDevicesModal = ({ onClose, onChanged }) => {
  const { t } = useTranslation();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      const data = await accountSettingsService.getTrustedDevices();
      setDevices(data);
      setError(null);
    } catch (err) {
      setError(err.message || t('accountSettings.trustedDevices.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleRemove = async (deviceId) => {
    if (!window.confirm(t('accountSettings.trustedDevices.confirmRemove'))) return;
    try {
      await accountSettingsService.removeTrustedDevice(deviceId);
      setDevices(prev => prev.filter(d => (d.device_id || d.id) !== deviceId));
      toast.success(t('accountSettings.toasts.deviceRemoved'));
      onChanged?.();  // ✅ notify parent to refresh counts
    } catch (err) {
      toast.error(err.message || t('accountSettings.toasts.deviceRemoveFailed'));
    }
  };

  const handleAdded = () => {
    fetchDevices();
    onChanged?.();  // ✅ notify parent to refresh counts
  };

  const handleClose = () => {
    onChanged?.();  // ✅ refresh counts on close too
    onClose();
  };

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—';

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'Mobile':
        return Smartphone;
      case 'Tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  return (
    <>
      <ModalWrapper title={t('accountSettings.trustedDevices.title')} icon={Shield} onClose={handleClose}>
        <div className="flex justify-between items-start mb-4 gap-4">
          <p className="text-xs text-gray-500">
            {t('accountSettings.trustedDevices.description')}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#6A1B9A] hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t('accountSettings.trustedDevices.addDevice')}
          </button>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState message={error} />
        ) : devices.length === 0 ? (
          <EmptyState message={t('accountSettings.trustedDevices.empty')} />
        ) : (
          <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
            {devices.map((device) => {
              const id = device.device_id || device.id;
              const Icon = getDeviceIcon(device.device_type || device.deviceType);
              return (
                <div
                  key={id}
                  className="flex items-center justify-between border border-gray-100 rounded-lg p-3"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-500 shrink-0" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {device.device_name || device.name}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        {t('accountSettings.trustedDevices.addedOn', {
                          date: formatDate(device.createdAt || device.added_at),
                        })}
                        {device.lastUsedAt
                          ? ` • ${t('accountSettings.trustedDevices.lastUsed', { date: formatDate(device.lastUsedAt) })}`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(id)}
                    className="text-red-500 hover:text-red-700 p-1.5 bg-red-50 rounded-md transition-colors"
                    aria-label={t('accountSettings.trustedDevices.remove')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          {t('accountSettings.common.close')}
        </button>
      </ModalWrapper>

      {showAddModal && (
        <AddDeviceModal
          onClose={() => setShowAddModal(false)}
          onAdded={handleAdded}
        />
      )}
    </>
  );
};

// ============================================================
// --- Login History Modal ---
// ============================================================

const LoginHistoryModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await accountSettingsService.getLoginHistory(1, 20);
        setLogs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <ModalWrapper title={t('accountSettings.loginHistory.title')} icon={FileText} onClose={onClose}>
      <p className="text-xs text-gray-500 mb-4">{t('accountSettings.loginHistory.description')}</p>
      {loading ? <LoadingState /> : (
        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <EmptyState message={t('accountSettings.loginHistory.empty')} icon={FileText} />
          ) : logs.map((log, idx) => {
            const isBlocked = log.status?.toLowerCase() === 'blocked';
            return (
              <div key={idx} className={`flex gap-3 p-3 rounded-lg border ${isBlocked ? 'bg-red-50/50 border-red-100' : 'border-gray-100'}`}>
                <div className="mt-0.5">
                  {isBlocked ? <XCircle className="w-5 h-5 text-red-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-gray-800 text-sm">{new Date(log.createdAt || log.date).toLocaleString()}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isBlocked ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {log.status || t('accountSettings.loginHistory.success')}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mt-2">
                    <p className="flex items-center gap-1.5 truncate"><Monitor className="w-3 h-3 shrink-0" /> <span className="truncate">{log.browser || t('accountSettings.common.unknown')}</span></p>
                    <p className="flex items-center gap-1.5 truncate"><MapPin className="w-3 h-3 shrink-0" /> <span className="truncate">{log.location || t('accountSettings.common.unknown')}</span></p>
                    <p className="truncate">{t('accountSettings.loginHistory.ip')}: {log.ipAddress}</p>
                    <p className="truncate">{t('accountSettings.loginHistory.method')}: {log.method || t('accountSettings.loginHistory.password')}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
        {t('accountSettings.common.close')}
      </button>
    </ModalWrapper>
  );
};

// ============================================================
// --- Suspicious Activity Modal ---
// ============================================================

const SuspiciousActivityModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await accountSettingsService.getSuspiciousActivity(1, 20);
        setActivities(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <ModalWrapper title={t('accountSettings.suspiciousActivity.title')} icon={AlertTriangle} onClose={onClose}>
      <p className="text-xs text-gray-500 mb-4">{t('accountSettings.suspiciousActivity.description')}</p>
      {loading ? <LoadingState /> : (
        <div className="space-y-4 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {activities.length === 0 ? (
            <EmptyState message={t('accountSettings.suspiciousActivity.empty')} icon={AlertTriangle} />
          ) : activities.map((activity, idx) => {
            const isHigh = activity.severity?.toLowerCase() === 'high';
            const bgColor = isHigh ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100';
            const iconColor = isHigh ? 'text-red-500' : 'text-orange-500';
            const textColor = isHigh ? 'text-red-800' : 'text-orange-800';
            const descColor = isHigh ? 'text-red-700' : 'text-orange-700';
            const metaColor = isHigh ? 'text-red-600' : 'text-orange-600';
            return (
              <div key={idx} className={`${bgColor} border rounded-lg p-4`}>
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`w-5 h-5 ${iconColor} mt-0.5 shrink-0`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`font-medium ${textColor} text-sm`}>{activity.title || activity.type}</p>
                      <div className="flex gap-1">
                        <span className={`${bgColor} ${textColor} text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider`}>{activity.severity}</span>
                        <span className="bg-green-100 text-green-700 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          {activity.status || t('accountSettings.suspiciousActivity.resolved')}
                        </span>
                      </div>
                    </div>
                    <p className={`text-xs ${descColor} mb-2`}>{activity.description}</p>
                    <div className={`text-[10px] ${metaColor} flex gap-4 font-medium`}>
                      <span>{new Date(activity.createdAt).toLocaleString()}</span>
                      <span>{activity.location} • {activity.ipAddress}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-blue-800 text-xs mb-2">
          {t('accountSettings.suspiciousActivity.securityTipsTitle')}
        </h4>
        <ul className="text-xs text-blue-700 space-y-1 list-disc pl-4 marker:text-blue-500">
          <li>{t('accountSettings.suspiciousActivity.tips.enable2fa')}</li>
          <li>{t('accountSettings.suspiciousActivity.tips.strongPassword')}</li>
          <li>{t('accountSettings.suspiciousActivity.tips.reviewSessions')}</li>
        </ul>
      </div>
      <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
        {t('accountSettings.common.close')}
      </button>
    </ModalWrapper>
  );
};

// ============================================================
// --- Password Reset Logs Modal ---
// ============================================================

const PasswordResetLogsModal = ({ onClose }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await accountSettingsService.getPasswordResetLogs(1, 20);
        setLogs(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const handleChangePassword = () => {
    onClose();
    navigate('/change-password');
  };

  return (
    <ModalWrapper title={t('accountSettings.passwordResetLogs.title')} icon={FileText} onClose={onClose}>
      <p className="text-xs text-gray-500 mb-4">{t('accountSettings.passwordResetLogs.description')}</p>
      {loading ? <LoadingState /> : (
        <div className="space-y-3 mb-6 max-h-[50vh] overflow-y-auto pr-1">
          {logs.length === 0 ? (
            <EmptyState message={t('accountSettings.passwordResetLogs.empty')} icon={FileText} />
          ) : logs.map((log, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg p-3">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                  <p className="font-medium text-gray-800 text-sm">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
                <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  {log.status || t('accountSettings.passwordResetLogs.completed')}
                </span>
              </div>
              <div className="text-[10px] text-gray-500 grid grid-cols-2 gap-1.5 ml-6">
                <p className="truncate">{log.method}</p>
                <p className="truncate">{log.location}</p>
                <p className="truncate">{log.browser} - {log.operatingSystem}</p>
                <p className="truncate">{t('accountSettings.passwordResetLogs.ip')}: {log.ipAddress}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-orange-800 text-xs mb-1">
          {t('accountSettings.passwordResetLogs.noticeTitle')}
        </h4>
        <p className="text-xs text-orange-700 mb-3 leading-relaxed">
          {t('accountSettings.passwordResetLogs.noticeDescription')}
        </p>
        <button
          onClick={handleChangePassword}
          className="bg-[#6A1B9A] hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-xs font-medium transition-colors"
        >
          {t('accountSettings.passwordResetLogs.changePasswordNow')}
        </button>
      </div>
      <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
        {t('accountSettings.common.close')}
      </button>
    </ModalWrapper>
  );
};

// ============================================================
// --- Create API Key Modal ---
// ============================================================

const CreateApiKeyModal = ({ onClose, onCreated }) => {
  const { t } = useTranslation();
  const [keyName, setKeyName] = useState('');
  const [permissions, setPermissions] = useState({
    read: true,
    write: false,
    delete: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [createdKey, setCreatedKey] = useState(null);
  const [error, setError] = useState(null);

  const togglePermission = (perm) => {
    setPermissions((prev) => ({ ...prev, [perm]: !prev[perm] }));
  };

  const handleCreate = async () => {
    setError(null);
    const selectedPermissions = Object.entries(permissions)
      .filter(([, checked]) => checked)
      .map(([key]) => key);

    if (selectedPermissions.length === 0) {
      setError(t('accountSettings.createApiKey.selectAtLeastOne'));
      return;
    }

    try {
      setSubmitting(true);
      const result = await accountSettingsService.createApiKey({
        name: keyName.trim(),
        environment: 'Production',
        permissions: selectedPermissions,
      });
      setCreatedKey(result.data);
      toast.success(t('accountSettings.toasts.apiKeyCreated'));
    } catch (err) {
      setError(err.message || t('accountSettings.toasts.apiKeyCreateFailed'));
      toast.error(err.message || t('accountSettings.toasts.apiKeyCreateFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (createdKey) {
    return (
      <ModalWrapper title={t('accountSettings.apiKeyCreated.title')} icon={Key} onClose={onCreated}>
        <div className="space-y-5">
          <div className="bg-green-50 border border-green-100 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
            <div>
              <p className="font-medium text-green-800 text-sm">{t('accountSettings.apiKeyCreated.successTitle')}</p>
              <p className="text-xs text-green-700 mt-0.5">
                {createdKey.name} • {createdKey.environment}
              </p>
            </div>
          </div>

          <div className="bg-orange-50 border border-orange-100 p-4 rounded-lg">
            <h4 className="font-semibold text-orange-800 text-xs mb-2">
              ⚠ {t('accountSettings.apiKeyCreated.importantTitle')}
            </h4>
            <p className="text-xs text-orange-700 mb-3">
              {t('accountSettings.apiKeyCreated.importantDescription')}
            </p>
            <div className="flex items-center justify-between bg-white border border-orange-200 rounded p-2 gap-2">
              <code className="text-[11px] font-mono text-gray-700 break-all">
                {createdKey.apiKey}
              </code>
              <button
                onClick={() => {
                  copyToClipboard(createdKey.apiKey);
                  toast.success(t('accountSettings.toasts.apiKeyCopied'));
                }}
                className="text-purple-600 hover:text-purple-800 flex items-center gap-1 text-xs font-semibold shrink-0 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" /> {t('accountSettings.common.copy')}
              </button>
            </div>
          </div>

          <div className="text-xs text-gray-500 flex flex-wrap gap-2">
            <span className="font-medium">{t('accountSettings.createApiKey.permissionsLabel')}:</span>
            {createdKey.permissions?.map((p) => (
              <span key={p} className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]">
                {t(`accountSettings.createApiKey.permissions.${p}.label`)}
              </span>
            ))}
          </div>

          <button
            onClick={onCreated}
            className="w-full bg-[#6A1B9A] hover:bg-purple-800 text-white py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            {t('accountSettings.apiKeyCreated.doneButton')}
          </button>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper title={t('accountSettings.createApiKey.title')} icon={Key} onClose={onClose}>
      <div className="space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            {t('accountSettings.createApiKey.keyNameLabel')}
          </label>
          <input
            type="text"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            placeholder={t('accountSettings.createApiKey.keyNamePlaceholder')}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            {t('accountSettings.createApiKey.permissionsLabel')}
          </label>
          <div className="space-y-2.5">
            {['read', 'write', 'delete'].map((perm) => {
              const isSelected = permissions[perm];
              return (
                <label
                  key={perm}
                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50/50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePermission(perm)}
                    className="mt-0.5 w-4 h-4 accent-purple-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-800">
                        {t(`accountSettings.createApiKey.permissions.${perm}.label`)}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                          perm === 'read'
                            ? 'bg-green-100 text-green-700'
                            : perm === 'write'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {t(`accountSettings.createApiKey.permissions.${perm}.badge`)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {t(`accountSettings.createApiKey.permissions.${perm}.description`)}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3.5">
          <h4 className="text-xs font-semibold text-blue-800 mb-1">
            {t('accountSettings.createApiKey.importantTitle')}
          </h4>
          <p className="text-[11px] text-blue-700 leading-relaxed">
            {t('accountSettings.createApiKey.importantDescription')}
          </p>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {t('accountSettings.common.cancel')}
          </button>
          <button
            onClick={handleCreate}
            disabled={!keyName.trim() || submitting}
            className="flex-1 bg-[#6A1B9A] hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('accountSettings.createApiKey.creating')}
              </>
            ) : (
              t('accountSettings.createApiKey.createButton')
            )}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
};

// ============================================================
// --- API Keys Modal ---
// ============================================================

const ApiKeysModal = ({ onClose }) => {
  const { t } = useTranslation();
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchKeys = async () => {
    try {
      setLoading(true);
      const data = await accountSettingsService.getApiKeys();
      setKeys(data);
    } catch (err) {
      setError(err.message || t('accountSettings.apiKeys.loadFailed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const handleRevoke = async (keyId) => {
    if (!window.confirm(t('accountSettings.apiKeys.confirmRevoke'))) return;
    try {
      await accountSettingsService.revokeApiKey(keyId);
      setKeys(prev => prev.map(k => k.key_id === keyId ? { ...k, status: 'Revoked' } : k));
      toast.success(t('accountSettings.toasts.apiKeyRevoked'));
    } catch (err) {
      toast.error(err.message || t('accountSettings.toasts.apiKeyRevokeFailed'));
    }
  };

  const handleDelete = async (keyId) => {
    if (!window.confirm(t('accountSettings.apiKeys.confirmDelete'))) return;
    try {
      await accountSettingsService.deleteApiKey(keyId);
      setKeys(prev => prev.filter(k => k.key_id !== keyId));
      toast.success(t('accountSettings.toasts.apiKeyDeleted'));
    } catch (err) {
      toast.error(err.message || t('accountSettings.toasts.apiKeyDeleteFailed'));
    }
  };

  const handleCreated = () => {
    setShowCreateModal(false);
    fetchKeys();
  };

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <>
      <ModalWrapper title={t('accountSettings.apiKeys.title')} icon={Key} onClose={onClose}>
        <div className="flex justify-between items-start mb-4 gap-4">
          <p className="text-xs text-gray-500">{t('accountSettings.apiKeys.description')}</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#6A1B9A] hover:bg-purple-800 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> {t('accountSettings.apiKeys.createNewKey')}
          </button>
        </div>

        {loading ? (
          <LoadingState />
        ) : error ? (
          <EmptyState message={error} icon={Key} />
        ) : keys.length === 0 ? (
          <EmptyState message={t('accountSettings.apiKeys.empty')} icon={Key} />
        ) : (
          <div className="space-y-4 mb-6 max-h-[55vh] overflow-y-auto pr-1">
            {keys.map((apiKey) => {
              const isActive = apiKey.status === 'Active';
              return (
                <div
                  key={apiKey.key_id}
                  className={`border rounded-lg p-4 ${isActive ? 'border-gray-200' : 'border-red-100 bg-red-50/30'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-gray-800 text-sm">{apiKey.name}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {apiKey.status}
                      </span>
                      <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        {apiKey.environment}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded p-2 mb-3">
                    <code className="text-xs font-mono text-gray-600">
                      trxx_{apiKey.environment?.toLowerCase().slice(0, 4)}_••••••••••••••••••••••••
                    </code>
                  </div>

                  <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider mb-3 flex-wrap">
                    {apiKey.permissions?.map((p) => (
                      <span key={p} className="bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                        {t(`accountSettings.createApiKey.permissions.${p}.label`)}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <p className="text-[10px] text-gray-400">
                      {t('accountSettings.apiKeys.createdOn', { date: formatDate(apiKey.createdAt) })}
                      {apiKey.lastUsedAt
                        ? ` • ${t('accountSettings.apiKeys.lastUsed', { date: formatDate(apiKey.lastUsedAt) })}`
                        : ''}
                    </p>
                    <div className="flex gap-2">
                      {isActive && (
                        <button
                          onClick={() => handleRevoke(apiKey.key_id)}
                          className="text-orange-600 bg-orange-50 hover:bg-orange-100 px-3 py-1 rounded text-xs font-medium transition-colors"
                        >
                          {t('accountSettings.apiKeys.revoke')}
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(apiKey.key_id)}
                        className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1 rounded text-xs font-medium transition-colors"
                      >
                        {t('accountSettings.apiKeys.delete')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button onClick={onClose} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2.5 rounded-lg text-sm font-medium transition-colors">
          {t('accountSettings.common.close')}
        </button>
      </ModalWrapper>

      {showCreateModal && (
        <CreateApiKeyModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
};

// ============================================================
// --- Main Component ---
// ============================================================

function AccountSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.subadmin.profile);
  const fetchedRef = useRef(false);

  const [activeModal, setActiveModal] = useState(null);

  // ✅ Real counts for Security section
  const [sessionsCount, setSessionsCount] = useState(null);
  const [trustedDevicesCount, setTrustedDevicesCount] = useState(null);

  // Fetch profile once
  useEffect(() => {
    if (fetchedRef.current || profile) return;
    fetchedRef.current = true;

    accountSettingsService
      .getProfile()
      .then((data) => dispatch(setProfile(data)))
      .catch((err) => console.warn('Profile fetch failed:', err));
  }, [dispatch, profile]);

  // ✅ Fetch real counts
  const refreshCounts = useCallback(async () => {
    try {
      const [sessions, devices] = await Promise.all([
        accountSettingsService.getSessions().catch(() => []),
        accountSettingsService.getTrustedDevices().catch(() => []),
      ]);
      setSessionsCount(Array.isArray(sessions) ? sessions.length : 0);
      setTrustedDevicesCount(Array.isArray(devices) ? devices.length : 0);
    } catch (err) {
      console.warn('Counts fetch failed:', err);
    }
  }, []);

  useEffect(() => {
    refreshCounts();
  }, [refreshCounts]);

  const userEmail = profile?.email || 'hello@TRIAXX.Admin';
  const roleName = profile?.Role_id?.role_name || 'Admin';

  const SettingsRow = ({ label, hasChevron = false, onClick, icon: Icon, subtext, badge }) => (
    <div 
      className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0 cursor-pointer hover:bg-gray-50 transition-colors px-2 -mx-2 rounded"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-gray-500" />}
        <div>
          <div className="flex items-center gap-2">
            <p className="text-gray-800 font-medium text-sm">{label}</p>
            {badge && (
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
          {subtext && <p className="text-xs text-gray-500">{subtext}</p>}
        </div>
      </div>
      <button className="focus:outline-none shrink-0">
        {hasChevron ? (
          <ChevronRight className="w-5 h-5 text-gray-400" />
        ) : (
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
            <Pencil className="w-3 h-3 text-white" />
          </div>
        )}
      </button>
    </div>
  );

  const SectionCard = ({ title, children }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 flex flex-col">
      <div
        className="px-5 py-3 shrink-0"
        style={{ background: 'linear-gradient(90deg, #6A1B9A 0%, #D32F2F 100%)' }}
      >
        <h2 className="text-white text-sm font-semibold tracking-wide uppercase">{title}</h2>
      </div>
      <div className="px-5 flex-1">{children}</div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-black mb-8">
        {t('accountSettings.title')}
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectionCard title={t('accountSettings.accountDetails.title')}>
          <SettingsRow label={userEmail} />
          <SettingsRow
            label={t('accountSettings.accountDetails.password')}
            subtext="••••••••••"
            onClick={() => navigate('/change-password')}
          />
          <SettingsRow
            label={t('accountSettings.accountDetails.manageAdmin', { role: roleName })}
            hasChevron
            onClick={() => navigate('/account-management')}
          />
        </SectionCard>

        <SectionCard title={t('accountSettings.regionalPreference.title')}>
          <SettingsRow
            label={t('accountSettings.regionalPreference.languages')}
            onClick={() => navigate('/language')}
          />
          <SettingsRow
            label={t('accountSettings.regionalPreference.dateTime')}
            onClick={() => navigate('/date-time')}
          />
          <SettingsRow
            label={t('accountSettings.regionalPreference.currency')}
            onClick={() => navigate('/currency')}
          />
        </SectionCard>
      </div>

      <div className="mt-2">
        <SectionCard title={t('accountSettings.security.title')}>
          <SettingsRow
            label={t('accountSettings.security.twoFactor')}
            icon={Shield}
            badge={t('accountSettings.twoFactor.enabled')}
            hasChevron
            onClick={() => setActiveModal('2fa')}
          />
          <SettingsRow
            label={t('accountSettings.security.activeSessions')}
            subtext={
              sessionsCount !== null
                ? t('accountSettings.security.activeSessionsCount', { count: sessionsCount })
                : t('accountSettings.common.loading')
            }
            icon={Monitor}
            hasChevron
            onClick={() => setActiveModal('sessions')}
          />
          <SettingsRow
            label={t('accountSettings.security.trustedDevices')}
            subtext={
              trustedDevicesCount !== null
                ? t('accountSettings.security.trustedDevicesCount', { count: trustedDevicesCount })
                : t('accountSettings.common.loading')
            }
            icon={Smartphone}
            hasChevron
            onClick={() => setActiveModal('trusted')}
          />
          <SettingsRow
            label={t('accountSettings.security.loginHistory')}
            icon={FileText}
            hasChevron
            onClick={() => setActiveModal('loginHistory')}
          />
          <SettingsRow
            label={t('accountSettings.security.suspiciousActivity')}
            subtext={t('accountSettings.security.noAlerts')}
            icon={AlertTriangle}
            hasChevron
            onClick={() => setActiveModal('suspicious')}
          />
          <SettingsRow
            label={t('accountSettings.security.passwordResetLogs')}
            icon={FileText}
            hasChevron
            onClick={() => setActiveModal('resetLogs')}
          />
          <SettingsRow
            label={t('accountSettings.security.apiKeys')}
            icon={Key}
            hasChevron
            onClick={() => setActiveModal('apiKeys')}
          />
        </SectionCard>
      </div>

      {activeModal === '2fa' && <TwoFactorAuthModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'sessions' && (
        <ActiveSessionsModal
          onClose={() => setActiveModal(null)}
          onChanged={refreshCounts}
        />
      )}
      {activeModal === 'trusted' && (
        <TrustedDevicesModal
          onClose={() => setActiveModal(null)}
          onChanged={refreshCounts}
        />
      )}
      {activeModal === 'loginHistory' && <LoginHistoryModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'suspicious' && <SuspiciousActivityModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'resetLogs' && <PasswordResetLogsModal onClose={() => setActiveModal(null)} />}
      {activeModal === 'apiKeys' && <ApiKeysModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}

export default AccountSection;