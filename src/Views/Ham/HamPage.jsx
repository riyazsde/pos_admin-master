import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Plus, X, Loader2, Package } from 'lucide-react';

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
const formatDate = (iso, locale = 'en-US') => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(locale, {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch {
    return '—';
  }
};

// ---------------------------------------------------------------------------
// Add Device Modal
// ---------------------------------------------------------------------------
const AddDeviceModal = ({ onClose, onCreated }) => {
  const { t } = useTranslation();
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
    if (!form.Name.trim())
      return t('ham.modal.validation.nameRequired');
    if (!form.Serial_Number.trim())
      return t('ham.modal.validation.serialRequired');
    if (!form.type.trim()) return t('ham.modal.validation.typeRequired');
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
    const toastId = toast.loading(t('ham.modal.toasts.adding'));

    try {
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

      toast.success(t('ham.modal.toasts.addSuccess'), {
        id: toastId,
        description: t('ham.modal.toasts.addSuccessDesc', {
          name: created?.Name || form.Name,
        }),
        duration: 2500,
      });

      dispatch(addDevice(created));
      onCreated?.(created);
      onClose();
    } catch (error) {
      console.error('Create device error:', error);
      toast.error(t('ham.modal.toasts.addFailed'), {
        id: toastId,
        description:
          error?.response?.data?.errors?.[0]?.msg ||
          error?.response?.data?.message ||
          error?.message ||
          t('ham.modal.toasts.addFailedDesc'),
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
          <h2 className="text-lg font-bold text-gray-900">
            {t('ham.modal.title')}
          </h2>
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
              {t('ham.modal.deviceName')}
            </label>
            <input
              type="text"
              value={form.Name}
              onChange={(e) => update('Name', e.target.value)}
              placeholder={t('ham.modal.deviceNamePlaceholder')}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Serial + Model */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('ham.modal.serialNumber')}
              </label>
              <input
                type="text"
                value={form.Serial_Number}
                onChange={(e) => update('Serial_Number', e.target.value)}
                placeholder={t('ham.modal.serialNumberPlaceholder')}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('ham.modal.hardwareModel')}
              </label>
              <input
                type="text"
                value={form.Hardware_Model}
                onChange={(e) => update('Hardware_Model', e.target.value)}
                placeholder={t('ham.modal.hardwareModelPlaceholder')}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Manufacturer + IMEI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('ham.modal.manufacturer')}
              </label>
              <input
                type="text"
                value={form.Manufacturer}
                onChange={(e) => update('Manufacturer', e.target.value)}
                placeholder={t('ham.modal.manufacturerPlaceholder')}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-2">
                {t('ham.modal.imei')}
              </label>
              <input
                type="text"
                value={form.IMEI}
                onChange={(e) => update('IMEI', e.target.value)}
                placeholder={t('ham.modal.imeiPlaceholder')}
                disabled={isSubmitting}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Device Type */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-2">
              {t('ham.modal.deviceType')}
            </label>
            <select
              value={form.type}
              onChange={(e) => update('type', e.target.value)}
              disabled={isSubmitting}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="Printer">{t('ham.modal.options.printer')}</option>
              <option value="POS Terminal">
                {t('ham.modal.options.posTerminal')}
              </option>
              <option value="Scanner">{t('ham.modal.options.scanner')}</option>
              <option value="Cash Drawer">
                {t('ham.modal.options.cashDrawer')}
              </option>
              <option value="KDS">{t('ham.modal.options.kds')}</option>
              <option value="Tablet">{t('ham.modal.options.tablet')}</option>
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
                {t('ham.modal.adding')}
              </>
            ) : (
              t('ham.modal.addDevice')
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
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  const type = device.type || 'default';
  const stock = device.Total_Stocks ?? 0;
  const active = stock > 0;
  const warranty = device.Extended_Warranty || null;
  const sla = device.SLA_Coverage || 'Not Eligible';
  const swapEligible = device.Swap_Eligibility || false;
  const replacementCycle = device.Replacement_Cycle || 24;

  // Type label with i18n fallback
  const getTypeLabel = () => {
    const keyMap = {
      'POS Terminal': 'ham.deviceTypes.posTerminal',
      Printer: 'ham.deviceTypes.printer',
      Scanner: 'ham.deviceTypes.scanner',
      'Cash Drawer': 'ham.deviceTypes.cashDrawer',
      KDS: 'ham.deviceTypes.kds',
      Tablet: 'ham.deviceTypes.tablet',
    };
    const key = keyMap[type];
    return key ? t(key) : t('ham.deviceTypes.default');
  };

  const notEligibleLabel = t('ham.row.notEligible');

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      {/* Device Type */}
      <td className="px-5 py-4">
        <span className="text-sm font-semibold text-gray-800">
          {getTypeLabel()}
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
            {t('ham.row.exp', {
              date: formatDate(device.Warranty_End || '2027-01-15', locale),
            })}
          </span>
          <span className="text-gray-400">
            {t('ham.row.purchased', {
              date: formatDate(
                device.Purchase_Date || '2024-01-15',
                locale
              ),
            })}
          </span>
        </div>
      </td>

      {/* Extended Warranty */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          {warranty ? (
            <>
              <span className="text-gray-800 font-medium">
                {t('ham.row.exp', { date: formatDate(warranty, locale) })}
              </span>
              <span className="text-gray-400">
                {t('ham.row.purchased', {
                  date: formatDate(
                    device.Purchase_Date || '2024-01-15',
                    locale
                  ),
                })}
              </span>
            </>
          ) : (
            <span className="text-gray-400">
              {t('ham.row.noCoverage')}
            </span>
          )}
        </div>
      </td>

      {/* SLA Coverage */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-medium">
            {sla === 'Not Eligible' ? notEligibleLabel : sla}
          </span>
          <span className="text-gray-400">
            {sla === 'Not Eligible'
              ? notEligibleLabel
              : t('ham.row.nextBusinessDay')}
          </span>
        </div>
      </td>

      {/* Swap Eligibility */}
      <td className="px-5 py-4">
        {swapEligible ? (
          <div className="flex flex-col text-xs">
            <span className="text-green-600 font-bold">
              {t('ham.row.eligible')}
            </span>
            <span className="text-green-600">{t('ham.row.swapNow')}</span>
          </div>
        ) : (
          <div className="flex flex-col text-xs">
            <span className="text-red-500 font-bold">
              {t('ham.row.notEligible')}
            </span>
            <span className="text-red-500">{t('ham.row.notEligible')}</span>
          </div>
        )}
      </td>

      {/* Replacement Cycle */}
      <td className="px-5 py-4">
        <div className="flex flex-col text-xs">
          <span className="text-gray-800 font-bold tabular-nums">
            {replacementCycle}
          </span>
          <span className="text-gray-400">{t('ham.row.months')}</span>
        </div>
      </td>
    </tr>
  );
};

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------
const HamPage = () => {
  const { t } = useTranslation();
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
        toast.error(t('common.error'), {
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
  }, [dispatch, t]);

  // ✅ Tabs with i18n labels
  const TABS = [
    { id: 'all', label: t('ham.tabs.all') },
    { id: 'assigned', label: t('ham.tabs.assigned') },
    { id: 'out', label: t('ham.tabs.out') },
  ];

  // ✅ Filter devices by tab
  const filteredDevices = devices.filter((d) => {
    const stock = d.Total_Stocks ?? 0;
    if (activeTab === 'assigned') return d.Merchant_Assignment;
    if (activeTab === 'out') return stock === 0;
    return true;
  });

  const isEmpty = filteredDevices.length === 0;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* ==================== Header ==================== */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t('ham.title')}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {t('ham.subtitle', { count: totalDevices })}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#8E24AA] to-[#D32F2F] text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-sm"
        >
          <Plus className="w-4 h-4" />
          {t('ham.addDevice')}
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
                isActive
                  ? 'text-gray-900'
                  : 'text-gray-500 hover:text-gray-700'
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
            <span className="text-sm">{t('ham.loading')}</span>
          </div>
        ) : isEmpty ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-400 gap-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-50 to-red-50 flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">
              {t('ham.noData')}
            </p>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              {activeTab === 'all'
                ? t('ham.noDataAddFirst')
                : t('ham.noDataFilter')}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gradient-to-r from-purple-50 to-red-50 border-b border-gray-100">
                <tr>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.deviceType')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.totalStock')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.available')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.assigned')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.manufacturerWarranty')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.extendedWarranty')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.slaCoverage')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.swapEligibility')}
                  </th>
                  <th className="px-5 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    {t('ham.table.replacementCycle')}
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