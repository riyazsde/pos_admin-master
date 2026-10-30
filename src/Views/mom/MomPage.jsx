// src/Components/MDM/MdmPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
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
  ChevronDown,
  Check,
} from 'lucide-react';

import withAdminLayout from '../AdminPanel/withAdminLayout';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setMdmLoading,
  setDevicesData,
  patchDevice,
  setMdmError,
} from '../../Store/Features/mdm/mdmSlice';
import { mdmService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const isDeviceOnline = (device) => {
  if (!device || device.isActive === false || !device.Last_Seen) {
    return false;
  }

  const lastSeen = new Date(device.Last_Seen).getTime();

  if (Number.isNaN(lastSeen)) return false;

  const diff = Date.now() - lastSeen;
  return diff < 24 * 60 * 60 * 1000 && diff >= 0;
};

const formatDate = (iso, locale = 'en-US', neverLabel = 'Never') => {
  if (!iso) return neverLabel;

  try {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) return neverLabel;

    return date.toLocaleString(locale, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return neverLabel;
  }
};

const DeviceIcon = ({ type }) => {
  const props = { className: 'text-purple-600', size: 18 };

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
// Status Badge
// ---------------------------------------------------------------------------
const StatusBadge = ({ online }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-center gap-1.5 text-xs font-semibold ${
        online ? 'text-green-600' : 'text-red-500'
      }`}
    >
      <div
        className={`w-2 h-2 rounded-full ${
          online ? 'bg-green-500' : 'bg-red-500'
        }`}
      />
      {online ? t('mdm.status.online') : t('mdm.status.offline')}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Enroll New Device Modal
// ---------------------------------------------------------------------------
const EnrollModal = ({ onClose, onSubmit, loading }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    Name: '',
    type: 'POS Terminal',
    Devices_ModelNo: '',
    Total_Stocks: 0,
    Serial_Number: '',
    IMEI: '',
    Android_ID: '',
    Merchant_Assignment: '',
    Enrollment_Token: '',
    Provisioning_Type: '',
    Device_Ownership: '',
    Kiosk_Profile: '',
    MDM_Policy_Assignment: '',
    Enrollment_Mode: '',
    location: '',
    Status: true,
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.Name.trim()) {
      return toast.error(t('mdm.enrollModal.validation.nameRequired'));
    }

    if (!form.Serial_Number.trim()) {
      return toast.error(t('mdm.enrollModal.validation.serialRequired'));
    }

    onSubmit(form);
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500';

  const renderInput = (label, key, type = 'text') => (
    <div>
      <label className="block text-xs font-medium text-gray-700 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={form[key]}
        onChange={(e) =>
          update(
            key,
            type === 'number' ? Number(e.target.value) : e.target.value
          )
        }
        placeholder={t('mdm.enrollModal.placeholder')}
        className={inputClass}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-white text-lg">
              {t('mdm.enrollModal.title')}
            </h3>
            <p className="text-xs text-purple-100 mt-0.5">
              {t('mdm.enrollModal.subtitle')}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h4 className="font-semibold text-gray-800 text-sm">
            {t('mdm.enrollModal.information')}
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput(t('mdm.enrollModal.deviceName'), 'Name')}
            {renderInput(t('mdm.enrollModal.totalStocks'), 'Total_Stocks', 'number')}
            {renderInput(t('mdm.enrollModal.serialNumber'), 'Serial_Number')}
            {renderInput(t('mdm.enrollModal.imei'), 'IMEI')}
            {renderInput(t('mdm.enrollModal.androidId'), 'Android_ID')}
            {renderInput(t('mdm.enrollModal.hardwareModel'), 'Devices_ModelNo')}
            {renderInput(
              t('mdm.enrollModal.merchantAssignment'),
              'Merchant_Assignment'
            )}
            {renderInput(
              t('mdm.enrollModal.enrollmentToken'),
              'Enrollment_Token'
            )}
            {renderInput(
              t('mdm.enrollModal.provisioningType'),
              'Provisioning_Type'
            )}
            {renderInput(
              t('mdm.enrollModal.deviceOwnership'),
              'Device_Ownership'
            )}
            {renderInput(t('mdm.enrollModal.kioskProfile'), 'Kiosk_Profile')}
            {renderInput(
              t('mdm.enrollModal.mdmPolicyAssignment'),
              'MDM_Policy_Assignment'
            )}
            {renderInput(t('mdm.enrollModal.location'), 'location')}

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {t('mdm.enrollModal.enrollmentMode')}
              </label>

              <div className="relative">
                <select
                  value={form.Enrollment_Mode}
                  onChange={(e) =>
                    update('Enrollment_Mode', e.target.value)
                  }
                  className={`${inputClass} appearance-none bg-white`}
                >
                  <option value="">
                    {t('mdm.enrollModal.selectOne')}
                  </option>
                  <option value="Token">
                    {t('mdm.enrollModal.modeToken')}
                  </option>
                  <option value="Manual">
                    {t('mdm.enrollModal.modeManual')}
                  </option>
                  <option value="Auto">
                    {t('mdm.enrollModal.modeAuto')}
                  </option>
                  <option value="QR Code">
                    {t('mdm.enrollModal.modeQrCode')}
                  </option>
                </select>

                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">
              {t('mdm.enrollModal.status')}
            </span>

            <button
              type="button"
              onClick={() => update('Status', !form.Status)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                form.Status ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.Status ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200"
          >
            {t('mdm.enrollModal.cancel')}
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {t('mdm.enrollModal.enroll')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Lock / Unlock Modal
// ---------------------------------------------------------------------------
const LockModal = ({
  device,
  action = 'lock',
  onClose,
  onConfirm,
  loading,
}) => {
  const { t } = useTranslation();

  const isUnlock = action === 'unlock';

  const [reason, setReason] = useState(
    isUnlock
      ? 'Device unlock requested by administrator'
      : t('mdm.lockModal.defaultReason')
  );

  const title = isUnlock ? 'Remote Unlock Device' : 'Remote Lock Device';

  const warning = isUnlock
    ? 'This action will remove the remote lock from this device and allow it to be used again.'
    : t('mdm.lockModal.warning');

  const buttonLabel = isUnlock ? 'Unlock Device' : 'Lock Device';

  const Icon = isUnlock ? Unlock : Lock;

  const theme = isUnlock
    ? {
        iconBg: 'bg-green-50',
        icon: 'text-green-600',
        warningBg: 'bg-green-50 border-green-100 text-green-800',
        focus: 'focus:ring-green-500',
        button: 'bg-green-600 hover:bg-green-700',
      }
    : {
        iconBg: 'bg-orange-50',
        icon: 'text-orange-500',
        warningBg: 'bg-orange-50 border-orange-100 text-orange-800',
        focus: 'focus:ring-orange-500',
        button: 'bg-orange-500 hover:bg-orange-600',
      };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${theme.iconBg}`}>
              <Icon className={`w-5 h-5 ${theme.icon}`} />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">{title}</h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div
            className={`border rounded-xl p-4 text-sm ${theme.warningBg}`}
          >
            {warning}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-medium">
                {t('mdm.lockModal.deviceId')}
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                DEV-{String(device?.MyDevices_id ?? 'N/A').padStart(3, '0')}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-medium">
                {t('mdm.lockModal.status')}
              </p>

              <p
                className={`font-semibold mt-1 ${
                  isDeviceOnline(device)
                    ? 'text-green-600'
                    : 'text-red-500'
                }`}
              >
                {isDeviceOnline(device)
                  ? t('mdm.status.online')
                  : t('mdm.status.offline')}
              </p>
            </div>

            <div className="col-span-2">
              <p className="text-xs text-gray-500 font-medium">
                {t('mdm.lockModal.location')}
              </p>

              <p className="font-semibold text-gray-800 mt-1">
                {device?.location || t('mdm.na')}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              {t('mdm.lockModal.reason')}
            </label>

            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 ${theme.focus}`}
              placeholder="Enter reason"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 disabled:opacity-50"
          >
            {t('mdm.lockModal.cancel')}
          </button>

          <button
            onClick={() => onConfirm(reason)}
            disabled={loading || !reason.trim()}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl disabled:opacity-60 flex items-center gap-2 transition-colors ${theme.button}`}
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Icon className="w-4 h-4" />
            )}

            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Restart Modal
// ---------------------------------------------------------------------------
const RestartModal = ({ device, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();

  const [form, setForm] = useState({
    Restart_Reason: t('mdm.restartModal.defaultReason'),
    Scheduled_Restart: new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    Restart_Queue: 'maintenance',
    Restart_Success_Confirmation: 'Required',
    Auto_Recovery_Mode: true,
  });

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500';

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-blue-500" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                {t('mdm.restartModal.title')}
              </h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            {t('mdm.restartModal.warning')}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {t('mdm.restartModal.restartReason')}
              </label>
              <input
                type="text"
                value={form.Restart_Reason}
                onChange={(e) =>
                  update('Restart_Reason', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {t('mdm.restartModal.scheduleRestart')}
              </label>
              <input
                type="datetime-local"
                value={form.Scheduled_Restart}
                onChange={(e) =>
                  update('Scheduled_Restart', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {t('mdm.restartModal.restartQueue')}
              </label>
              <input
                type="text"
                value={form.Restart_Queue}
                onChange={(e) =>
                  update('Restart_Queue', e.target.value)
                }
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {t('mdm.restartModal.restartSuccessConfirmation')}
              </label>
              <input
                type="text"
                value={form.Restart_Success_Confirmation}
                onChange={(e) =>
                  update('Restart_Success_Confirmation', e.target.value)
                }
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">
              {t('mdm.restartModal.autoRecoveryMode')}
            </span>

            <button
              type="button"
              onClick={() =>
                update('Auto_Recovery_Mode', !form.Auto_Recovery_Mode)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                form.Auto_Recovery_Mode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white ${
                  form.Auto_Recovery_Mode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl"
          >
            {t('mdm.restartModal.cancel')}
          </button>

          <button
            onClick={() => onConfirm(form)}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            {t('mdm.restartModal.restartDevice')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Update Modal
// ---------------------------------------------------------------------------
const UpdateModal = ({ device, onClose, onConfirm, loading }) => {
  const { t } = useTranslation();
  const [version, setVersion] = useState(device?.App_Version || 'v3.2.3');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <Download className="w-5 h-5 text-green-500" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                {t('mdm.updateModal.title')}
              </h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
            {t('mdm.updateModal.warning')}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              {t('mdm.updateModal.appVersion')}
            </label>

            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl"
          >
            {t('mdm.updateModal.cancel')}
          </button>

          <button
            onClick={() => onConfirm(version)}
            disabled={loading || !version.trim()}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-60 flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {t('mdm.updateModal.pushUpdate')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Wipe Modal
// ---------------------------------------------------------------------------
const WipeModal = ({ device, onClose, onInitiate, onVerify, loading }) => {
  const { t } = useTranslation();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [mode, setMode] = useState('Full Factory Reset');
  const [resending, setResending] = useState(false);

  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = ['', '', '', '', '', ''];

      digits.forEach((digit, i) => {
        newOtp[i] = digit;
      });

      setOtp(newOtp);
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const otpValue = otp.join('');
  const otpComplete = otpValue.length === 6;

  const handleNext = async () => {
    if (!email.trim()) {
      return toast.error(t('mdm.wipeModal.validation.emailRequired'));
    }

    if (!password.trim()) {
      return toast.error(t('mdm.wipeModal.validation.passwordRequired'));
    }

    const ok = await onInitiate({
      email: email.trim(),
      password,
    });

    if (ok) {
      setStep(2);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleWipe = async () => {
    if (!otpComplete) {
      return toast.error(t('mdm.wipeModal.validation.otpRequired'));
    }

    await onVerify({ otp: otpValue, mode });
  };

  const handleResendOtp = async () => {
    setResending(true);
    setOtp(['', '', '', '', '', '']);

    try {
      const ok = await onInitiate({
        email: email.trim(),
        password,
      });

      if (ok) {
        toast.success(t('mdm.wipeModal.toasts.otpResent'));
        inputRefs.current[0]?.focus();
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900">
                {t('mdm.wipeModal.title')}
              </h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
                {t('mdm.wipeModal.warning', { name: device?.Name })}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('mdm.wipeModal.email')}
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('mdm.wipeModal.emailPlaceholder')}
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('mdm.wipeModal.password')}
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('mdm.wipeModal.passwordPlaceholder')}
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
                {t('mdm.wipeModal.otpInstructions')}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-3">
                  {t('mdm.wipeModal.otp')}
                </label>

                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) =>
                        handleOtpChange(index, e.target.value)
                      }
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        handleOtpChange(
                          index,
                          e.clipboardData.getData('text')
                        );
                      }}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                    />
                  ))}
                </div>

                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleResendOtp}
                    disabled={resending || loading}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-50"
                  >
                    {resending
                      ? t('mdm.wipeModal.resending')
                      : t('mdm.wipeModal.resendOtp')}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  {t('mdm.wipeModal.wipeMode')}
                </label>

                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="Full Factory Reset">
                    {t('mdm.wipeModal.modeFullReset')}
                  </option>
                  <option value="Selective Wipe">
                    {t('mdm.wipeModal.modeSelective')}
                  </option>
                  <option value="Enterprise Reset">
                    {t('mdm.wipeModal.modeEnterprise')}
                  </option>
                </select>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl disabled:opacity-60"
          >
            {t('mdm.wipeModal.cancel')}
          </button>

          <button
            onClick={step === 1 ? handleNext : handleWipe}
            disabled={loading || (step === 2 && !otpComplete)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 1
              ? t('mdm.wipeModal.next')
              : t('mdm.wipeModal.wipeNow')}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Session Logs Modal
// ---------------------------------------------------------------------------
const SessionLogsModal = ({
  device,
  logs = [],
  loading,
  onClose,
  onExport,
}) => {
  const { t, i18n } = useTranslation();
  const logDevice = device || {};

  const [exporting, setExporting] = useState(false);
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const handleExportClick = async () => {
    if (!onExport) return;

    setExporting(true);

    try {
      await onExport();
    } finally {
      setExporting(false);
    }
  };

  const getStatusLabel = (status) => {
    const key = status?.toLowerCase();

    if (key === 'completed') {
      return t('mdm.sessionLogsModal.status.completed');
    }

    if (key === 'queued') {
      return t('mdm.sessionLogsModal.status.queued');
    }

    return status;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">
              {t('mdm.sessionLogsModal.title')}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {logDevice.Name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t('mdm.sessionLogsModal.ipAddress')}
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.IPAddress || '—'}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t('mdm.sessionLogsModal.uptime')}
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {t('mdm.sessionLogsModal.days', {
                count: logDevice.Uptime_Days || 0,
              })}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t('mdm.sessionLogsModal.battery')}
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.Battery_Percentage ?? '—'}
              {logDevice.Battery_Percentage != null ? '%' : ''}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              {t('mdm.sessionLogsModal.storageUsed')}
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.Storage_Used_Percentage ?? '—'}
              {logDevice.Storage_Used_Percentage != null ? '%' : ''}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
              <span className="text-sm">
                {t('mdm.sessionLogsModal.loading')}
              </span>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">
                {t('mdm.sessionLogsModal.noLogs')}
              </p>
            </div>
          ) : (
            logs.map((log, index) => (
              <div
                key={log._id || index}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50"
              >
                <div className="p-2 bg-white rounded-full shadow-sm mt-0.5">
                  <Check
                    className={`w-4 h-4 ${
                      log.Status === 'Completed'
                        ? 'text-green-500'
                        : log.Status === 'Queued'
                        ? 'text-yellow-500'
                        : 'text-gray-400'
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {log.Action}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {log.Description}
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold mb-1 ${
                      log.Status === 'Completed'
                        ? 'bg-green-50 text-green-700'
                        : log.Status === 'Queued'
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {getStatusLabel(log.Status)}
                  </span>

                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(log.CreateAt, locale, t('mdm.never'))}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-100">
          <button
            onClick={handleExportClick}
            disabled={exporting || loading || logs.length === 0}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t('mdm.sessionLogsModal.exporting')}
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                {t('mdm.sessionLogsModal.exportLogs')}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const MdmPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const { devices = [], loading, hasLoaded } = useAppSelector(
    (state) => state.mdm
  );

  const [actionLoading, setLocalActionLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modal, setModal] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [sessionLogsLoading, setSessionLogsLoading] = useState(false);
  const [sessionDevice, setSessionDevice] = useState(null);

  const hasFetched = useRef(false);

  // Fetch devices
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

        dispatch(
          setMdmError(err?.message || 'Failed to load devices')
        );

        toast.error(t('common.error'), {
          description:
            err?.message || t('mdm.enrollModal.toasts.tryAgain'),
        });
      }
    };

    fetchDevices();
  }, [dispatch, t]);

  // Stats
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(isDeviceOnline).length;
  const offlineDevices = totalDevices - onlineDevices;
  const needsUpdate = devices.filter((device) => device.Needs_Update).length;

  // Filters
  const FILTERS = [
    { id: 'all', label: t('mdm.filters.all') },
    { id: 'online', label: t('mdm.filters.online') },
    { id: 'offline', label: t('mdm.filters.offline') },
    { id: 'active', label: t('mdm.filters.active') },
    { id: 'idle', label: t('mdm.filters.idle') },
    { id: 'syncDelay', label: t('mdm.filters.syncDelay') },
  ];

  // Search and filtering
  const filteredDevices = devices.filter((device) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();

      const matches =
        device.Name?.toLowerCase().includes(query) ||
        device.Devices_ModelNo?.toLowerCase().includes(query) ||
        device.Serial_Number?.toLowerCase().includes(query);

      if (!matches) return false;
    }

    const online = isDeviceOnline(device);

    if (activeFilter === 'all') return true;
    if (activeFilter === 'online') return online;
    if (activeFilter === 'offline') return !online;
    if (activeFilter === 'active') return Boolean(device.isActive);
    if (activeFilter === 'idle') return !device.isActive;
    if (activeFilter === 'syncDelay') return Boolean(device.Needs_Update);

    return true;
  });

  // -------------------------------------------------------------------------
  // Enroll
  // -------------------------------------------------------------------------
  const handleEnroll = async (formData) => {
    setLocalActionLoading(true);

    const toastId = toast.loading(
      t('mdm.enrollModal.toasts.enrolling')
    );

    try {
      await mdmService.enrollDevice(formData);

      toast.success(t('mdm.enrollModal.toasts.enrollSuccess'), {
        id: toastId,
      });

      setModal(null);

      const result = await mdmService.getAllDevices();
      dispatch(setDevicesData(result));
    } catch (err) {
      toast.error(t('mdm.enrollModal.toasts.enrollFailed'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('mdm.enrollModal.toasts.tryAgain'),
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Lock / Unlock
  // -------------------------------------------------------------------------
  const handleLockAction = async (reason) => {
    const device = modal?.device;
    const action = modal?.action;

    if (!device || device.MyDevices_id == null) {
      toast.error('Unable to identify the selected device.');
      return;
    }

    if (action !== 'lock' && action !== 'unlock') {
      toast.error('Invalid device action.');
      return;
    }

    const id = device.MyDevices_id;
    const isUnlock = action === 'unlock';

    setLocalActionLoading(true);

    const toastId = toast.loading(
      isUnlock ? 'Unlocking device...' : t('mdm.lockModal.toasts.locking')
    );

    try {
      // Call the correct API according to the selected action.
      if (isUnlock) {
        await mdmService.unlockDevice(id, reason);
      } else {
        await mdmService.lockDevice(id, reason);
      }

      // Update Redux only after the API call succeeds.
      dispatch(
        patchDevice({
          id,
          changes: {
            isLocked: isUnlock ? false : true,
          },
        })
      );

      toast.success(
        isUnlock
          ? 'Device unlocked successfully'
          : t('mdm.lockModal.toasts.lockSuccess'),
        { id: toastId }
      );

      setModal(null);
    } catch (err) {
      console.error(
        `MDM ${action} device error:`,
        err
      );

      toast.error(
        isUnlock
          ? 'Failed to unlock device'
          : t('mdm.lockModal.toasts.lockFailed'),
        {
          id: toastId,
          description:
            err?.response?.data?.message ||
            err?.message ||
            t('mdm.lockModal.toasts.tryAgain'),
        }
      );
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Restart
  // -------------------------------------------------------------------------
  const handleRestart = async (payload) => {
    const id = modal?.device?.MyDevices_id;

    if (id == null) {
      toast.error('Unable to identify the selected device.');
      return;
    }

    setLocalActionLoading(true);

    const toastId = toast.loading(
      t('mdm.restartModal.toasts.scheduling')
    );

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

      toast.success(t('mdm.restartModal.toasts.restartSuccess'), {
        id: toastId,
      });

      setModal(null);
    } catch (err) {
      toast.error(t('mdm.restartModal.toasts.restartFailed'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('mdm.restartModal.toasts.tryAgain'),
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Push Update
  // -------------------------------------------------------------------------
  const handleUpdate = async (version) => {
    const id = modal?.device?.MyDevices_id;

    if (id == null) {
      toast.error('Unable to identify the selected device.');
      return;
    }

    setLocalActionLoading(true);

    const toastId = toast.loading(
      t('mdm.updateModal.toasts.pushing')
    );

    try {
      await mdmService.pushUpdate(id, version);

      dispatch(
        patchDevice({
          id,
          changes: { Needs_Update: false },
        })
      );

      toast.success(t('mdm.updateModal.toasts.updateSuccess'), {
        id: toastId,
      });

      setModal(null);
    } catch (err) {
      toast.error(t('mdm.updateModal.toasts.updateFailed'), {
        id: toastId,
        description:
          err?.response?.data?.message ||
          err?.message ||
          t('mdm.updateModal.toasts.tryAgain'),
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Wipe - Send OTP
  // -------------------------------------------------------------------------
  const handleWipeInitiate = async ({ email, password }) => {
    const id = modal?.device?.MyDevices_id;

    if (id == null) {
      toast.error('Unable to identify the selected device.');
      return false;
    }

    setLocalActionLoading(true);

    try {
      await mdmService.wipeDevice(id, { email, password });

      toast.success(t('mdm.wipeModal.toasts.otpSent'));
      return true;
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t('mdm.wipeModal.toasts.tryAgain');

      toast.error(t('mdm.wipeModal.toasts.otpFailed'), {
        description: backendMsg,
      });

      return false;
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Wipe - Verify OTP
  // -------------------------------------------------------------------------
  const handleWipeVerify = async ({ otp, mode }) => {
    const id = modal?.device?.MyDevices_id;

    if (id == null) {
      toast.error('Unable to identify the selected device.');
      return;
    }

    setLocalActionLoading(true);

    const toastId = toast.loading(
      t('mdm.wipeModal.toasts.wiping')
    );

    try {
      await mdmService.verifyWipeDevice(id, { otp, mode });

      dispatch(
        patchDevice({
          id,
          changes: {
            WipedAt: new Date().toISOString(),
          },
        })
      );

      toast.success(t('mdm.wipeModal.toasts.wipeSuccess'), {
        id: toastId,
      });

      setModal(null);
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        t('mdm.wipeModal.toasts.tryAgain');

      toast.error(t('mdm.wipeModal.toasts.wipeFailed'), {
        id: toastId,
        description: backendMsg,
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Session Logs
  // -------------------------------------------------------------------------
  const openSessionLogs = async (device) => {
    setModal({ type: 'logs', device });
    setSessionDevice(device);
    setSessionLogsLoading(true);
    setSessionLogs([]);

    try {
      const result = await mdmService.getSessionLogs(
        device.MyDevices_id
      );

      setSessionDevice(result.device || device);
      setSessionLogs(result.logs || []);
    } catch (err) {
      toast.error(t('mdm.sessionLogsModal.toasts.exportFailed'), {
        description:
          err?.message || t('mdm.wipeModal.toasts.tryAgain'),
      });
    } finally {
      setSessionLogsLoading(false);
    }
  };

  // -------------------------------------------------------------------------
  // Export Logs
  // -------------------------------------------------------------------------
  const exportLogs = async () => {
    const deviceId = modal?.device?.MyDevices_id;

    if (deviceId == null) {
      toast.error(t('mdm.sessionLogsModal.toasts.noDevice'));
      return;
    }

    const toastId = toast.loading(
      t('mdm.sessionLogsModal.toasts.preparing')
    );

    try {
      const blob = await mdmService.exportSessionLogs(deviceId);

      const safeName = (modal.device.Name || 'device')
        .replace(/[^a-z0-9-_]/gi, '_')
        .toLowerCase();

      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `session-logs-${safeName}-${stamp}.csv`;

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');

      anchor.href = url;
      anchor.download = filename;

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      URL.revokeObjectURL(url);

      toast.success(
        t('mdm.sessionLogsModal.toasts.exportSuccess'),
        { id: toastId }
      );
    } catch (err) {
      console.error('[exportLogs] Failed:', err);

      let message =
        err?.message ||
        t('mdm.sessionLogsModal.toasts.exportFailed');

      if (err?.response?.data instanceof Blob) {
        try {
          const responseText = await err.response.data.text();
          const parsed = JSON.parse(responseText);
          message = parsed?.message || message;
        } catch {
          // Ignore non-JSON response bodies.
        }
      }

      toast.error(
        t('mdm.sessionLogsModal.toasts.exportFailed'),
        {
          id: toastId,
          description: message,
        }
      );
    }
  };

  // -------------------------------------------------------------------------
  // Action Button
  // -------------------------------------------------------------------------
  const ActionButton = ({
    icon: Icon,
    label,
    onClick,
    color,
    hoverColor,
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${color} ${hoverColor}`}
    >
      <Icon size={16} />
    </button>
  );

  const locale = t('mdm.never') === 'Jamais' ? 'fr-FR' : 'en-US';

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {t('mdm.title')}
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            {t('mdm.subtitle', { count: totalDevices })}
          </p>
        </div>

        <button
          onClick={() => setModal({ type: 'enroll' })}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 shadow-lg shadow-purple-200"
        >
          <Plus size={16} />
          {t('mdm.enrollNewDevice')}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              {t('mdm.stats.totalDevices')}
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
              {t('mdm.stats.onlineDevices')}
            </span>
            <Wifi className="text-green-500" size={18} />
          </div>

          <div className="text-2xl font-bold text-green-600 tabular-nums">
            {onlineDevices}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {t('mdm.stats.uptime', {
              percent:
                totalDevices > 0
                  ? Math.round(
                      (onlineDevices / totalDevices) * 100
                    )
                  : 0,
            })}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              {t('mdm.stats.offlineDevices')}
            </span>
            <WifiOff className="text-red-500" size={18} />
          </div>

          <div className="text-2xl font-bold text-red-500 tabular-nums">
            {offlineDevices}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {t('mdm.stats.requiresAttention')}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">
              {t('mdm.stats.needsUpdate')}
            </span>
            <Download className="text-orange-500" size={18} />
          </div>

          <div className="text-2xl font-bold text-orange-500 tabular-nums">
            {needsUpdate}
          </div>

          <div className="text-xs text-gray-400 mt-1">
            {t('mdm.stats.updatesAvailable')}
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                activeFilter === filter.id
                  ? 'bg-purple-600 text-white border-purple-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.label}
            </button>
          ))}
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
              placeholder={t('mdm.searchPlaceholder')}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50"
          >
            <Filter size={14} />
            {t('mdm.filter')}
          </button>
        </div>
      </div>

      {/* Devices Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !hasLoaded ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">{t('mdm.loading')}</span>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Smartphone className="w-8 h-8" />

            <p className="text-sm font-medium text-gray-500">
              {t('mdm.noDevices')}
            </p>

            <p className="text-xs text-gray-400">
              {t('mdm.noDevicesDesc')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-4">
                    {t('mdm.table.status')}
                  </th>
                  <th className="px-6 py-4">
                    {t('mdm.table.deviceName')}
                  </th>
                  <th className="px-6 py-4">
                    {t('mdm.table.location')}
                  </th>
                  <th className="px-6 py-4">
                    {t('mdm.table.appVersion')}
                  </th>
                  <th className="px-6 py-4">
                    {t('mdm.table.lastSeen')}
                  </th>
                  <th className="px-6 py-4 text-center">
                    {t('mdm.table.actions')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map((device) => {
                  const online = isDeviceOnline(device);
                  const locked = Boolean(device.isLocked);

                  return (
                    <tr
                      key={device._id || device.MyDevices_id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <StatusBadge online={online} />
                      </td>

                      <td className="px-6 py-4">
                        <button
                          onClick={() => openSessionLogs(device)}
                          className="flex items-center gap-3 text-left hover:opacity-80"
                          title={t('mdm.actions.viewLogs')}
                        >
                          <div className="p-2 bg-purple-50 rounded-lg">
                            <DeviceIcon type={device.type} />
                          </div>

                          <div>
                            <div className="font-semibold text-gray-800">
                              {device.Name}
                            </div>

                            <div className="text-xs text-gray-500">
                              {device.Devices_ModelNo ||
                                t('mdm.unknownModel')}
                            </div>

                            {locked && (
                              <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-orange-600">
                                <Lock size={10} />
                                Locked
                              </span>
                            )}
                          </div>
                        </button>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {device.location || t('mdm.na')}
                        </div>

                        <div className="text-xs text-gray-400">
                          {device.Merchant_Assignment || ''}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {device.App_Version || '—'}
                        </div>

                        <div className="text-xs text-gray-400">
                          {device.Devices_Operating_system ||
                            t('mdm.table.android')}
                        </div>

                        {device.Needs_Update && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">
                            {t('mdm.table.updateAvailable')}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-gray-700">
                          {formatDate(
                            device.Last_Seen,
                            locale,
                            t('mdm.never')
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <ActionButton
                            icon={FileText}
                            label={t('mdm.actions.viewLogs')}
                            onClick={() => openSessionLogs(device)}
                            color="text-gray-500"
                            hoverColor="hover:text-gray-700"
                          />

                          {/* Correct Lock / Unlock action */}
                          <ActionButton
                            icon={locked ? Unlock : Lock}
                            label={
                              locked
                                ? t('mdm.actions.unlock')
                                : t('mdm.actions.lock')
                            }
                            onClick={() =>
                              setModal({
                                type: 'lock',
                                action: locked ? 'unlock' : 'lock',
                                device,
                              })
                            }
                            color={
                              locked
                                ? 'text-green-600'
                                : 'text-orange-500'
                            }
                            hoverColor={
                              locked
                                ? 'hover:text-green-700'
                                : 'hover:text-orange-700'
                            }
                          />

                          <ActionButton
                            icon={RotateCcw}
                            label={t('mdm.actions.restart')}
                            onClick={() =>
                              setModal({ type: 'restart', device })
                            }
                            color="text-blue-500"
                            hoverColor="hover:text-blue-700"
                          />

                          <ActionButton
                            icon={Download}
                            label={t('mdm.actions.pushUpdate')}
                            onClick={() =>
                              setModal({ type: 'update', device })
                            }
                            color="text-green-500"
                            hoverColor="hover:text-green-700"
                          />

                          <ActionButton
                            icon={Trash2}
                            label={t('mdm.actions.wipe')}
                            onClick={() =>
                              setModal({ type: 'wipe', device })
                            }
                            color="text-red-500"
                            hoverColor="hover:text-red-700"
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

      {/* Modals */}
      {modal?.type === 'enroll' && (
        <EnrollModal
          onClose={() => setModal(null)}
          onSubmit={handleEnroll}
          loading={actionLoading}
        />
      )}

      {modal?.type === 'lock' && (
        <LockModal
          device={modal.device}
          action={modal.action}
          onClose={() => {
            if (!actionLoading) setModal(null);
          }}
          onConfirm={handleLockAction}
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
          device={sessionDevice}
          logs={sessionLogs}
          loading={sessionLogsLoading}
          onClose={() => setModal(null)}
          onExport={exportLogs}
        />
      )}
    </div>
  );
};

export default withAdminLayout(MdmPage);