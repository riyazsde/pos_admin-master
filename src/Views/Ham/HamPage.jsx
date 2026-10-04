import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Plus, X, Loader2, Package, PackageCheck, PackageX } from 'lucide-react';

import withAdminLayout from '../AdminPanel/withAdminLayout';
import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import {
  setHamLoading,
  setDevicesData,
  setAssignedDevicesData,
  setInventoryStatus,
  addDevice,
  setCreating,
  setHamError,
} from '../../Store/Features/ham/hamSlice';
import { hamService } from '../../Services/apiService';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const TYPE_LABELS = {
  'POS Terminal': 'Payment Terminal',
  Printer: 'Receipt Printer',
  Scanner: 'Barcode scanner',
  'Cash Drawer': 'Cash Drawer',
  KDS: 'KDS Display',
  Tablet: 'Tablet',
  default: 'Device',
};

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
};

const formatDateRange = (start, end) => {
  if (!start) return '—';
  const s = formatDate(start);
  return `${s}`;
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------
const TABS = [
  { id: 'all', label: 'All Devices' },
  { id: 'assigned', label: 'Assigned Devices' },
  { id: 'out', label: 'Out of Stock' },
];

// ---------------------------------------------------------------------------
// Add Device Modal
// ---------------------------------------------------------------------------
const AddDeviceModal = ({ onClose, onCreated }) => {
  const dispatch = useAppDispatch();

  const [form, setForm] = useState({
    Name: '',
    Serial_Number: '',
    Hardware_Model: '',
    Manufacturer: '',
    IMEI: '',
    type: 'Printer',
    MAC_Address: '',
    Firmware: '',
    Purchase_Vendor: '',
    Warehouse: '',
    Procurement_Batch: '',
    Import_Batch: '',
    Total_Stocks: 0,
    Acquisition_Cost: 0,
    Status: true,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const validate = () => {
    if (!form.Name.trim()) return 'Device Name is required';
    if (!form.Serial_Number.trim()) return 'Serial Number is required';
    if (!form.type.trim()) return 'Device Type is required';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    setIsSubmitting(true);
    dispatch(setCreating(true));
    const toastId = toast.loading('Adding device...');

    try {
      // Payload maps UI → backend field names
      const payload = {
        Name: form.Name.trim(),
        type: form.type,
        Serial_Number: form.Serial_Number.trim(),
        Hardware_Model: form.Hardware_Model.trim(),
        Manufacturer: form.Manufacturer.trim(),
        IMEI: form.IMEI.trim() || null,
        MAC_Address: form.MAC_Address.trim() || null,
        Firmware: form.Firmware.trim() || null,
        Purchase_Vendor: form.Purchase_Vendor.trim() || null,
        Warehouse: form.Warehouse.trim() || null,
        Procurement_Batch: form.Procurement_Batch.trim() || null,
        Import_Batch: form.Import_Batch.trim() || null,
        Total_Stocks: Number(form.Total_Stocks) || 0,
        Acquisition_Cost: Number(form.Acquisition_Cost) || 0,
        Status: form.Status,
      };

      const created = await hamService.createDevice(payload);

      toast.success('Device added successfully!', {
        id: toastId,
        description: `"${created?.Name || form.Name}" is now in inventory.`,
        duration: 2500,
      });

      dispatch(addDevice(created));
      onCreated?.(created);
      onClose();
    } catch (error) {
      console.error('Create device error:', error);
      toast.error('Failed to add device', {
        id: toastId,
        description:
          error?.response?.data?.errors?.[0]?.msg ||
          error?.response?.data?.message ||
          error?.message ||
          'Please try again.',
      });
      dispatch(setHamError(error?.message || 'Failed to create device'));
    } finally {
      setIsSubmitting(false);
      dispatch(setCreating(false));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add New Devices</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 py-5 space-y-5"
        >
          {/* Device Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Device Name
            </label>
            <input
              type="text"
              value={form.Name}
              onChange={(e) => update('Name', e.target.value)}
              placeholder="Enter device name"
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Serial + Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                value={form.Serial_Number}
                onChange={(e) => update('Serial_Number', e.target.value)}
                placeholder="Enter"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Hardware Model
              </label>
              <input
                type="text"
                value={form.Hardware_Model}
                onChange={(e) => update('Hardware_Model', e.target.value)}
                placeholder="Enter"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Manufacturer + IMEI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                value={form.Manufacturer}
                onChange={(e) => update('Manufacturer', e.target.value)}
                placeholder="Enter"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                IMEI
              </label>
              <input
                type="text"
                value={form.IMEI}
                onChange={(e) => update('IMEI', e.target.value)}
                placeholder="Enter"
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              Device Type
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Printer">Printer</option>
              <option value="POS Terminal">POS Terminal</option>
              <option value="Scanner">Scanner</option>
              <option value="Cash Drawer">Cash Drawer</option>
              <option value="KDS">KDS</option>
              <option value="Tablet">Tablet</option>
            </select>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3.5 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-xl text-white font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Adding...
              </>
            ) : (
              'Add Device'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Table Row
// ---------------------------------------------------------------------------
const DeviceRow = ({ device, index }) => {
  const type = device.type || 'default';
  const stock = device.Total_Stocks ?? 0;
  const active = stock > 0;
  const warranty = device.Extended_Warranty || null;
  const sla = device.SLA_Coverage || 'Not Eligible';
  const swapEligible = device.Swap_Eligibility || false;
  const replacementCycle = device.Replacement_Cycle || 24;

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Device Type */}
      <td className="px-5 py-4">
        <span className="text-sm font-semibold text-gray-800">
          {TYPE_LABELS[type] || type}
        </span>
      </td>

      {/* Total Stock */}
      <td className="px-5 py-4">
        <span className="text-sm font-bold text-gray-800 tabular-nums">
          {String(stock).padStart(2, '0')}
        </span>
      </td>

      {/* Available */}
      <td className="px-5 py-4">
        <span className="text-sm text-gray-700 tabular-nums">
          {String(active ? stock : 0).padStart(2, '0')}
        </span>
      </td>

      {/* Assigned */}
      <td className="px-5 py-4">
        <span className="text-sm text-gray-700 tabular-nums">
          {String(device.Assigned || 0).padStart(2, '0')}
        </span>
      </td>

      {/* Manufacturer Warranty */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-medium">
            Exp: {formatDate(device.Warranty_End || '2027-01-15')}
          </span>
          <span className="text-gray-400">
            Purchased {formatDate(device.Purchase_Date || '2024-01-15')}
          </span>
        </div>
      </td>

      {/* Extended Warranty */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          {warranty ? (
            <>
              <span className="text-gray-800 font-medium">
                Exp: {formatDate(warranty)}
              </span>
              <span className="text-gray-400">
                Purchased {formatDate(device.Purchase_Date || '2024-01-15')}
              </span>
            </>
          ) : (
            <span className="text-gray-400">No Coverage</span>
          )}
        </div>
      </td>

      {/* SLA Coverage */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-medium">{sla}</span>
          <span className="text-gray-400">
            {sla === 'Not Eligible' ? 'Not Eligible' : 'Next Business Day'}
          </span>
        </div>
      </td>

      {/* Swap Eligibility */}
      <td className="px-5 py-4">
        {swapEligible ? (
          <div className="flex flex-col text-xs">
            <span className="text-green-600 font-bold">Eligible</span>
            <span className="text-green-600">Swap Now</span>
          </div>
        ) : (
          <div className="flex flex-col text-xs">
            <span className="text-red-500 font-bold">Not Eligible</span>
            <span className="text-red-500">Not Eligible</span>
          </div>
        )}
      </td>

      {/* Replacement Cycle */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-bold tabular-nums">
            {replacementCycle}
          </span>
          <span className="text-gray-400">months</span>
        </div>
      </td>
    </tr>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const HamPage = () => {
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);

  const { devices, totalDevices, assignedDevices, loading, hasLoaded } =
    useAppSelector((state) => state.ham);

  // ✅ Fetch all data on mount
  const hasFetched = useRef(false);
  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchAll = async () => {
      dispatch(setHamLoading(true));

      // Devices
      try {
        const result = await hamService.getMyDevices();
        dispatch(setDevicesData(result));
      } catch (err) {
        console.error('Devices fetch error:', err);
        dispatch(setHamError(err?.message || 'Failed to load devices'));
        toast.error('Failed to load devices', {
          description: err?.message || 'Please try again.',
        });
      }

      // Assigned devices
      try {
        const assigned = await hamService.getSoldInRestaurant();
        dispatch(setAssignedDevicesData(assigned));
      } catch (err) {
        console.error('Assigned devices fetch error:', err);
      }

      // Inventory status
      try {
        const status = await hamService.getInventoryStatus();
        dispatch(setInventoryStatus(status));
      } catch (err) {
        console.error('Inventory status fetch error:', err);
      }
    };

    fetchAll();
  }, [dispatch]);

  // ✅ Filter devices by tab
  const filteredDevices = devices.filter((d) => {
    const stock = d.Total_Stocks ?? 0;
    if (activeTab === 'assigned') return d.Merchant_Assignment;
    if (activeTab === 'out') return stock === 0;
    return true; // all
  });

  const isEmpty = filteredDevices.length === 0;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Hardware Asset Management (HAM)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {totalDevices} device{totalDevices !== 1 ? 's' : ''} in inventory
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Device
        </button>
      </div>

      {/* ==================== Tabs ==================== */}
      <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 mb-6">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-semibold transition-colors relative ${
                isActive ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* ==================== Table ==================== */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading && !hasLoaded ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
            <span className="text-sm">Loading devices…</span>
          </div>
        ) : isEmpty ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              No devices found
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {activeTab === 'all'
                ? 'Add your first device to get started.'
                : 'No devices match this filter.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-purple-50 to-red-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Device Type
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Total Stock
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Available
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Assigned
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Manufacturer Warranty
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Extended Warranty
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SLA Coverage
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Swap Eligibility
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Replacement Cycle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredDevices.map((device, index) => (
                  <DeviceRow
                    key={device._id || device.MyDevices_id || index}
                    device={device}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ==================== Modal ==================== */}
      {showModal && (
        <AddDeviceModal
          onClose={() => setShowModal(false)}
          onCreated={() => {}}
        />
      )}
    </div>
  );
};

export default withAdminLayout(HamPage);