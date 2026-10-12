// src/Components/MDM/MdmPage.jsx
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
const isDeviceOnline = (d) => {
  if (!d) return false;
  if (d.isActive === false) return false;
  if (!d.Last_Seen) return false;
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
const StatusBadge = ({ online }) => (
  <div
    className={`flex items-center gap-1.5 text-xs font-semibold ${
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
// Enroll New Device Modal
// ---------------------------------------------------------------------------
const EnrollModal = ({ onClose, onSubmit, loading }) => {
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

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = () => {
    if (!form.Name.trim()) return toast.error('Device Name is required');
    if (!form.Serial_Number.trim())
      return toast.error('Serial Number is required');
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-start justify-between px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-white text-lg">Enroll New Device</h3>
            <p className="text-xs text-purple-100 mt-0.5">
              Lorem ipsum is simply dummy text of the printing and typesetting industry
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <h4 className="font-semibold text-gray-800 text-sm">Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Device Name
              </label>
              <input
                type="text"
                value={form.Name}
                onChange={(e) => update('Name', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Total Stocks
              </label>
              <input
                type="number"
                value={form.Total_Stocks}
                onChange={(e) => update('Total_Stocks', Number(e.target.value))}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Serial Number
              </label>
              <input
                type="text"
                value={form.Serial_Number}
                onChange={(e) => update('Serial_Number', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                IMEI
              </label>
              <input
                type="text"
                value={form.IMEI}
                onChange={(e) => update('IMEI', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Android ID
              </label>
              <input
                type="text"
                value={form.Android_ID}
                onChange={(e) => update('Android_ID', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Hardware Model
              </label>
              <input
                type="text"
                value={form.Devices_ModelNo}
                onChange={(e) => update('Devices_ModelNo', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Merchant Assignment
              </label>
              <input
                type="text"
                value={form.Merchant_Assignment}
                onChange={(e) => update('Merchant_Assignment', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Enrollment Token
              </label>
              <input
                type="text"
                value={form.Enrollment_Token}
                onChange={(e) => update('Enrollment_Token', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Provisioning Type
              </label>
              <input
                type="text"
                value={form.Provisioning_Type}
                onChange={(e) => update('Provisioning_Type', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Device Ownership
              </label>
              <input
                type="text"
                value={form.Device_Ownership}
                onChange={(e) => update('Device_Ownership', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Kiosk Profile
              </label>
              <input
                type="text"
                value={form.Kiosk_Profile}
                onChange={(e) => update('Kiosk_Profile', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                MDM Policy Assignment
              </label>
              <input
                type="text"
                value={form.MDM_Policy_Assignment}
                onChange={(e) => update('MDM_Policy_Assignment', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={form.location}
                onChange={(e) => update('location', e.target.value)}
                placeholder="Enter"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Enrollment Mode
              </label>
              <div className="relative">
                <select
                  value={form.Enrollment_Mode}
                  onChange={(e) => update('Enrollment_Mode', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="">Select one...</option>
                  <option value="Token">Token</option>
                  <option value="Manual">Manual</option>
                  <option value="Auto">Auto</option>
                  <option value="QR Code">QR Code</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">Status</span>
            <button
              onClick={() => update('Status', !form.Status)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
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
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-purple-600 rounded-xl hover:bg-purple-700 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Lock Modal
// ---------------------------------------------------------------------------
const LockModal = ({ device, onClose, onConfirm, loading }) => {
  const [reason, setReason] = useState('Device reported lost');

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Lock className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Remote Lock Device</h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800">
            This will immediately lock the device and require authentication to unlock.
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-medium">Device ID</p>
              <p className="font-semibold text-gray-800 mt-1">
                DEV-{String(device?.MyDevices_id).padStart(3, '0')}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Status</p>
              <p
                className={`font-semibold mt-1 ${
                  isDeviceOnline(device) ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {isDeviceOnline(device) ? 'online' : 'offline'}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-gray-500 font-medium">Location</p>
              <p className="font-semibold text-gray-800 mt-1">
                {device?.location || 'N/A'}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">Reason</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(reason)}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-orange-500 rounded-xl hover:bg-orange-600 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            Lock Device
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
  const [form, setForm] = useState({
    Restart_Reason: 'Apply configuration changes',
    Scheduled_Restart: new Date(Date.now() + 60 * 60 * 1000)
      .toISOString()
      .slice(0, 16),
    Restart_Queue: 'maintenance',
    Restart_Success_Confirmation: 'Required',
    Auto_Recovery_Mode: true,
  });

  const update = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <RotateCcw className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Remote Restart Device</h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
            This will restart the device. Any unsaved work will be lost.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Restart Reason
              </label>
              <input
                type="text"
                value={form.Restart_Reason}
                onChange={(e) => update('Restart_Reason', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Schedule Restart
              </label>
              <input
                type="datetime-local"
                value={form.Scheduled_Restart}
                onChange={(e) => update('Scheduled_Restart', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Restart Queue
              </label>
              <input
                type="text"
                value={form.Restart_Queue}
                onChange={(e) => update('Restart_Queue', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Restart Success Confirmation
              </label>
              <input
                type="text"
                value={form.Restart_Success_Confirmation}
                onChange={(e) =>
                  update('Restart_Success_Confirmation', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-sm font-medium text-gray-700">
              Auto-recovery mode
            </span>
            <button
              onClick={() => update('Auto_Recovery_Mode', !form.Auto_Recovery_Mode)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                form.Auto_Recovery_Mode ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  form.Auto_Recovery_Mode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(form)}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-blue-500 rounded-xl hover:bg-blue-600 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            Restart Device
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
              <h3 className="font-bold text-gray-900">Push Update</h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-800">
            This will push the latest app version to the device and install it.
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              App Version
            </label>
            <input
              type="text"
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(version)}
            disabled={loading}
            className="px-5 py-2.5 text-sm font-semibold text-white bg-green-500 rounded-xl hover:bg-green-600 disabled:opacity-60 flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            Push Update
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Wipe Modal (2-step: Credentials → 6-digit OTP)
// ---------------------------------------------------------------------------
const WipeModal = ({ device, onClose, onInitiate, onVerify, loading }) => {
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
      digits.forEach((d, i) => (newOtp[i] = d));
      setOtp(newOtp);
      const lastIndex = Math.min(digits.length, 5);
      inputRefs.current[lastIndex]?.focus();
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
    if (!email.trim()) return toast.error('Email is required');
    if (!password.trim()) return toast.error('Password is required');

    const ok = await onInitiate({ email: email.trim(), password });
    if (ok) {
      setStep(2);
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  };

  const handleWipe = async () => {
    if (!otpComplete) {
      toast.error('Please enter all 6 digits');
      return;
    }
    await onVerify({ otp: otpValue, mode });
  };

  const handleResendOtp = async () => {
    setResending(true);
    setOtp(['', '', '', '', '', '']);
    try {
      const ok = await onInitiate({ email: email.trim(), password });
      if (ok) {
        toast.success('OTP resent to your email');
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
              <h3 className="font-bold text-gray-900">Remote Wipe Device</h3>
              <p className="text-xs text-gray-500">{device?.Name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100"
            disabled={loading}
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-sm text-red-800">
                WARNING: This will erase all data on{' '}
                <strong>{device?.Name}</strong>. This action cannot be undone.
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email id"
                  autoComplete="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
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
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-gray-700">
                To wipe the device, you need to enter the 6-digit OTP sent to the
                registered email address.
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-3">
                  OTP
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData('text');
                        handleOtpChange(index, pasted);
                      }}
                      className="w-12 h-12 text-center text-lg font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
                    />
                  ))}
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={handleResendOtp}
                    disabled={resending || loading}
                    className="text-xs font-semibold text-red-500 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    {resending ? 'Resending…' : 'Resend OTP'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Wipe Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-red-500"
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
            disabled={loading}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={step === 1 ? handleNext : handleWipe}
            disabled={loading || (step === 2 && !otpComplete)}
            className="px-6 py-2.5 text-sm font-semibold text-white bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {step === 1 ? 'Next' : 'Wipe Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Session Logs Modal (with working Export)
// ---------------------------------------------------------------------------
const SessionLogsModal = ({ device, logs, loading, onClose, onExport }) => {
  const logDevice = device || {};
  const [exporting, setExporting] = useState(false);

  const handleExportClick = async () => {
    if (!onExport) return;
    setExporting(true);
    try {
      await onExport();
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Session Logs</h3>
            <p className="text-xs text-gray-500 mt-0.5">{logDevice.Name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              IP Address
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.IPAddress || '—'}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Uptime
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.Uptime_Days || 0} days
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Battery
            </p>
            <p className="text-sm font-semibold text-gray-800 mt-1">
              {logDevice.Battery_Percentage ?? '—'}
              {logDevice.Battery_Percentage != null ? '%' : ''}
            </p>
          </div>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
              Storage Used
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
              <span className="text-sm">Loading logs…</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <FileText className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No session logs</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log._id}
                className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50 hover:bg-gray-50 transition-colors"
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
                    {log.Status}
                  </span>
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {formatDate(log.CreateAt)}
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
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl font-semibold text-sm hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity flex items-center justify-center gap-2"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting…
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Logs
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
  const dispatch = useAppDispatch();
  const { devices, loading, hasLoaded } = useAppSelector((state) => state.mdm);
  const [actionLoading, setLocalActionLoading] = useState(false);

  const [activeFilter, setActiveFilter] = useState('All Devices');
  const [searchQuery, setSearchQuery] = useState('');

  const [modal, setModal] = useState(null);
  const [sessionLogs, setSessionLogs] = useState([]);
  const [sessionLogsLoading, setSessionLogsLoading] = useState(false);
  const [sessionDevice, setSessionDevice] = useState(null);

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

  // ---- Enroll ----
  const handleEnroll = async (formData) => {
    setLocalActionLoading(true);
    const toastId = toast.loading('Enrolling device...');
    try {
      await mdmService.enrollDevice(formData);
      toast.success('Device enrolled successfully', { id: toastId });
      setModal(null);
      const result = await mdmService.getAllDevices();
      dispatch(setDevicesData(result));
    } catch (err) {
      toast.error('Failed to enroll device', {
        id: toastId,
        description: err?.message || 'Please try again.',
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // ---- Lock ----
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

  // ---- Restart ----
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

  // ---- Push Update ----
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

  // ---- Wipe Step 1 ----
  const handleWipeInitiate = async ({ email, password }) => {
    setLocalActionLoading(true);
    const id = modal.device.MyDevices_id;
    try {
      await mdmService.wipeDevice(id, { email, password });
      toast.success('OTP sent to your email');
      return true;
    } catch (err) {
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Please try again.';
      toast.error('Failed to initiate wipe', { description: backendMsg });
      return false;
    } finally {
      setLocalActionLoading(false);
    }
  };

  // ---- Wipe Step 2 ----
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
      const backendMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Please try again.';
      toast.error('Failed to wipe device', {
        id: toastId,
        description: backendMsg,
      });
    } finally {
      setLocalActionLoading(false);
    }
  };

  // ---- Session Logs ----
  const openSessionLogs = async (device) => {
    setModal({ type: 'logs', device });
    setSessionDevice(device);
    setSessionLogsLoading(true);
    setSessionLogs([]);
    try {
      const result = await mdmService.getSessionLogs(device.MyDevices_id);
      setSessionDevice(result.device || device);
      setSessionLogs(result.logs || []);
    } catch (err) {
      toast.error('Failed to load session logs', {
        description: err?.message || 'Please try again.',
      });
    } finally {
      setSessionLogsLoading(false);
    }
  };

  // ---- Export Logs (calls the real backend endpoint) ----
  const exportLogs = async () => {
    const deviceId = modal?.device?.MyDevices_id;
    if (!deviceId) {
      toast.error('No device selected');
      return;
    }

    const toastId = toast.loading('Preparing export…');

    try {
      const blob = await mdmService.exportSessionLogs(deviceId);

      // Build a friendly filename
      const safeName = (modal.device.Name || 'device')
        .replace(/[^a-z0-9-_]/gi, '_')
        .toLowerCase();
      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `session-logs-${safeName}-${stamp}.csv`;

      // Trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      toast.success('Export downloaded', { id: toastId });
    } catch (err) {
      console.error('[exportLogs] Failed:', err);

      // Try to extract a friendly message if the error body is JSON-in-a-blob
      let message = err?.message || 'Failed to export logs';
      if (err?.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          message = parsed?.message || message;
        } catch {
          /* ignore */
        }
      }

      toast.error('Export failed', {
        id: toastId,
        description: message,
      });
    }
  };

  const ActionButton = ({ icon: Icon, label, onClick, color, hoverColor }) => (
    <button
      onClick={onClick}
      title={label}
      className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${color} ${hoverColor}`}
    >
      <Icon size={16} />
    </button>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            MDM Device Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {totalDevices} device{totalDevices !== 1 ? 's' : ''} in fleet
          </p>
        </div>
        <button
          onClick={() => setModal({ type: 'enroll' })}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-purple-200"
        >
          <Plus size={16} />
          Enroll New Device
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Total Devices</span>
            <Smartphone className="text-gray-400" size={18} />
          </div>
          <div className="text-2xl font-bold text-gray-800 tabular-nums">
            {totalDevices}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Online Devices</span>
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
            <span className="text-sm text-gray-500 font-medium">Offline Devices</span>
            <WifiOff className="text-red-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-red-500 tabular-nums">
            {offlineDevices}
          </div>
          <div className="text-xs text-gray-400 mt-1">Requires attention</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Needs Update</span>
            <Download className="text-orange-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-orange-500 tabular-nums">
            {needsUpdate}
          </div>
          <div className="text-xs text-gray-400 mt-1">Updates available</div>
        </div>
      </div>

      {/* Filter Bar */}
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
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={14} />
            Filter
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading && !hasLoaded ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading devices…</span>
          </div>
        ) : filteredDevices.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-2">
            <Smartphone className="w-8 h-8" />
            <p className="text-sm font-medium text-gray-500">No devices found</p>
            <p className="text-xs text-gray-400">Try adjusting your filters.</p>
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
                        <div className="text-xs text-gray-400">
                          {device.Devices_Operating_system || 'Android'}
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
                            icon={FileText}
                            label="View Logs"
                            onClick={() => openSessionLogs(device)}
                            color="text-gray-500"
                            hoverColor="hover:text-gray-700"
                          />
                          <ActionButton
                            icon={device.isLocked ? Unlock : Lock}
                            label={device.isLocked ? 'Unlock' : 'Lock'}
                            onClick={() => setModal({ type: 'lock', device })}
                            color="text-orange-500"
                            hoverColor="hover:text-orange-700"
                          />
                          <ActionButton
                            icon={RotateCcw}
                            label="Restart"
                            onClick={() => setModal({ type: 'restart', device })}
                            color="text-blue-500"
                            hoverColor="hover:text-blue-700"
                          />
                          <ActionButton
                            icon={Download}
                            label="Push Update"
                            onClick={() => setModal({ type: 'update', device })}
                            color="text-green-500"
                            hoverColor="hover:text-green-700"
                          />
                          <ActionButton
                            icon={Trash2}
                            label="Wipe"
                            onClick={() => setModal({ type: 'wipe', device })}
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