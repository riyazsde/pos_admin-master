import React, { useState, useEffect, useMemo } from 'react';
import AddPaymentModal from './AddPaymentModal';
import DeletePaymentConfirmModal from './DeletePaymentConfirmModal';
import { paymentOptionService } from '../../Services/apiService';
import {
  FaCreditCard, FaUniversity, FaPaypal, FaGooglePay, FaApplePay,
  FaEdit, FaTrash, FaCheckCircle, FaExclamationCircle, FaTimes,
} from 'react-icons/fa';
import { RiBankLine } from 'react-icons/ri';
import { BiRupee } from 'react-icons/bi';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? FaCheckCircle : FaExclamationCircle;
  return (
    <div className={`fixed top-5 right-5 z-[100] flex items-center gap-3 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg`}>
      <Icon size={20} />
      <span className="font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">
        <FaTimes size={14} />
      </button>
    </div>
  );
};

const Payments = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentModes, setPaymentModes] = useState([]); // enabled + disabled (deleted excluded)
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [saving, setSaving] = useState(false);

  const [filter, setFilter] = useState('all'); // 'all' | 'enabled' | 'disabled'

  const showNotification = (msg, type = 'success') =>
    setNotification({ message: msg, type });

  const getIconForOption = (optionName) => {
    const name = (optionName || '').toLowerCase();
    if (name.includes('card') || name.includes('debit') || name.includes('credit')) return <FaCreditCard size={20} />;
    if (name.includes('cash')) return <RiBankLine size={20} />;
    if (name.includes('apple')) return <FaApplePay size={20} />;
    if (name.includes('google')) return <FaGooglePay size={20} />;
    if (name.includes('paypal') || name.includes('stripe')) return <FaPaypal size={20} />;
    if (name.includes('bank') || name.includes('upi')) return <FaUniversity size={20} />;
    return <BiRupee size={20} />;
  };

  // ✅ Fetch — backend now returns enabled + disabled; deleted excluded
  const fetchPaymentOptions = async () => {
    setLoading(true);
    try {
      const response = await paymentOptionService.getAll();
      const mapped = (response.data || [])
        // Defensive: if a deleted row ever slips through, drop it here
        .filter((item) => !item.isDeleted)
        .map((item) => {
          const option = item.PaymentOption?.[0] || {};
          return {
            id: item.Payment_Options_id,
            mongoId: item._id,
            name: option.option || 'Unknown',
            details: option.Details || '',
            status: item.Status === true, // true = enabled, false = disabled
            isDeleted: item.isDeleted === true,
            icon: getIconForOption(option.option),
          };
        });
      setPaymentModes(mapped);
    } catch (error) {
      console.error('Error fetching payment options:', error);
      showNotification('Failed to load payment options', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  // ✅ Client-side view filter — the ONLY place status affects rendering
  const visibleModes = useMemo(() => {
    if (filter === 'enabled') return paymentModes.filter((m) => m.status);
    if (filter === 'disabled') return paymentModes.filter((m) => !m.status);
    return paymentModes;
  }, [paymentModes, filter]);

  const counts = useMemo(() => ({
    all: paymentModes.length,
    enabled: paymentModes.filter((m) => m.status).length,
    disabled: paymentModes.filter((m) => !m.status).length,
  }), [paymentModes]);

  const handleSavePayment = async () => {
    if (saving) return;
    if (!paymentMode.trim()) {
      showNotification('Please enter a payment mode', 'error');
      return;
    }
    setSaving(true);
    try {
      if (isEditMode && currentId) {
        const existing = paymentModes.find((p) => p.id === currentId);
        await paymentOptionService.update(currentId, {
          option: paymentMode,
          details: existing?.details || `${paymentMode} payment`,
          Status: existing?.status ?? true,
        });
        showNotification('Payment mode updated successfully!', 'success');
      } else {
        await paymentOptionService.create({
          option: paymentMode,
          details: `${paymentMode} payment`,
          Status: true,
        });
        showNotification('Payment mode added successfully!', 'success');
      }
      setPaymentMode('');
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setCurrentId(null);
      await fetchPaymentOptions();
    } catch (error) {
      console.error('Error saving payment option:', error);
      showNotification(error.message || 'Failed to save payment mode', 'error');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Toggle — flips Status only; row stays in the list (enabled ↔ disabled)
  const handleToggleStatus = async (payment) => {
    const newStatus = !payment.status;
    setPaymentModes((prev) =>
      prev.map((m) => (m.id === payment.id ? { ...m, status: newStatus } : m))
    );
    try {
      await paymentOptionService.update(payment.id, {
        option: payment.name,
        details: payment.details,
        Status: newStatus,
      });
      showNotification(`Payment mode turned ${newStatus ? 'ON' : 'OFF'}`, 'success');
      await fetchPaymentOptions();
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('Failed to update status', 'error');
      setPaymentModes((prev) =>
        prev.map((m) => (m.id === payment.id ? { ...m, status: payment.status } : m))
      );
    }
  };

  const handleEditClick = (payment) => {
    setPaymentMode(payment.name);
    setCurrentId(payment.id);
    setIsEditMode(true);
    setIsAddModalOpen(true);
  };

  const handleAddClick = () => {
    setPaymentMode('');
    setCurrentId(null);
    setIsEditMode(false);
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  // ✅ Delete — soft-delete on backend (isDeleted:true), removed from list here
  const handleConfirmDelete = async () => {
    if (!selectedPayment?.id) {
      showNotification('No payment mode selected', 'error');
      return;
    }
    const deletedId = selectedPayment.id;
    setPaymentModes((prev) => prev.filter((m) => m.id !== deletedId));
    setIsDeleteModalOpen(false);
    setSelectedPayment(null);
    try {
      await paymentOptionService.remove(deletedId); // → sets isDeleted:true
      showNotification('Payment mode deleted successfully!', 'success');
      // No refetch — isDeleted rows no longer come back from GET_ALL
    } catch (error) {
      console.error('❌ Delete error:', error);
      showNotification(error.message || 'Failed to delete payment mode', 'error');
      await fetchPaymentOptions();
    }
  };

  return (
    <div className="px-4 md:px-10 py-6 w-full max-w-7xl mx-auto">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center sm:text-left">
          Payments
        </h2>
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-purple-800 to-red-600 text-white px-4 py-2 rounded-md font-medium shadow flex items-center gap-2 hover:opacity-90 transition"
        >
          Add New Payment Mode <span className="text-xl">＋</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All', count: counts.all },
          { key: 'enabled', label: 'Enabled', count: counts.enabled },
          { key: 'disabled', label: 'Disabled', count: counts.disabled },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              filter === tab.key
                ? 'bg-purple-800 text-white border-purple-800'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs ${filter === tab.key ? 'text-white/80' : 'text-gray-500'}`}>
              ({tab.count})
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-10 text-gray-500">Loading payment options...</div>
      ) : visibleModes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          {filter === 'disabled'
            ? 'No disabled payment modes.'
            : filter === 'enabled'
            ? 'No enabled payment modes.'
            : 'No payment options found.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleModes.map((mode) => {
            const isOn = !!mode.status;
            return (
              <div
                key={mode.id}
                className={`rounded-2xl p-4 shadow-sm flex flex-col justify-between h-32 relative transition-all duration-200 ${
                  isOn
                    ? 'border border-purple-200 bg-white opacity-100'
                    : 'border border-gray-200 bg-gray-50 opacity-80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOn ? 'bg-gray-100 text-gray-800' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {mode.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span
                      className={`block text-lg font-bold truncate ${isOn ? 'text-gray-800' : 'text-gray-500'}`}
                      title={mode.name}
                    >
                      {mode.name}
                    </span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isOn ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isOn ? 'ENABLED' : 'DISABLED'}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-3 text-gray-600">
                    <button onClick={() => handleEditClick(mode)} className="hover:text-purple-600 transition-colors" title="Edit">
                      <FaEdit size={16} />
                    </button>
                    <button onClick={() => handleDeleteClick(mode)} className="hover:text-red-500 transition-colors" title="Delete">
                      <FaTrash size={16} />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${isOn ? 'text-purple-800' : 'text-gray-400'}`}>
                      {isOn ? 'ON' : 'OFF'}
                    </span>
                    <div
                      onClick={() => handleToggleStatus(mode)}
                      className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                        isOn ? 'bg-gradient-to-r from-purple-800 to-red-600' : 'bg-gray-300'
                      }`}
                      title={isOn ? 'Click to disable' : 'Click to enable'}
                    >
                      <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                        isOn ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => {
          if (saving) return;
          setIsAddModalOpen(false);
          setIsEditMode(false);
          setCurrentId(null);
          setPaymentMode('');
        }}
        onSave={handleSavePayment}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        isEditMode={isEditMode}
        saving={saving}
      />

      <DeletePaymentConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPayment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Method"
        description={`You can delete "${selectedPayment?.name || 'this payment method'}" permanently.`}
      />
    </div>
  );
};

export default Payments;