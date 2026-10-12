import React, { useState, useEffect } from 'react';
import AddPaymentModal from './AddPaymentModal';
import DeletePaymentConfirmModal from './DeletePaymentConfirmModal';
import { paymentOptionService } from '../../Services/apiService';
import {
  FaCreditCard,
  FaUniversity,
  FaPaypal,
  FaGooglePay,
  FaApplePay,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
} from 'react-icons/fa';
import { RiBankLine } from 'react-icons/ri';
import { BiRupee } from 'react-icons/bi';

// --- Notification Component ---
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const Icon = type === 'success' ? FaCheckCircle : FaExclamationCircle;

  return (
    <div
      className={`fixed top-5 right-5 z-[100] flex items-center gap-3 ${bgColor} text-white px-5 py-3 rounded-lg shadow-lg transition-all duration-300 animate-slide-in`}
    >
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
  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Notification State
  const [notification, setNotification] = useState(null); // { message, type }

  // Edit Mode State
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Helper to trigger notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  // Map an option name to an icon
  const getIconForOption = (optionName) => {
    const name = (optionName || '').toLowerCase();
    if (name.includes('card') || name.includes('debit') || name.includes('credit'))
      return <FaCreditCard size={20} />;
    if (name.includes('cash')) return <RiBankLine size={20} />;
    if (name.includes('apple')) return <FaApplePay size={20} />;
    if (name.includes('google')) return <FaGooglePay size={20} />;
    if (name.includes('paypal')) return <FaPaypal size={20} />;
    if (name.includes('stripe')) return <FaPaypal size={20} />;
    if (name.includes('bank') || name.includes('upi'))
      return <FaUniversity size={20} />;
    return <BiRupee size={20} />;
  };

  // Fetch all payment options
const fetchPaymentOptions = async () => {
  setLoading(true);
  try {
    const response = await paymentOptionService.getAll();

    const mapped = response.data.map((item) => {
      const option = item.PaymentOption?.[0] || {};
      return {
        id: item.Payment_Options_id, // ✅ Numeric ID for update/delete APIs
        mongoId: item._id,
        name: option.option || 'Unknown',
        details: option.Details || '',
        status: item.Status,
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

  // Handle Create OR Update
  const handleSavePayment = async () => {
    if (!paymentMode.trim()) {
      showNotification('Please enter a payment mode', 'error');
      return;
    }

    try {
      if (isEditMode && currentId) {
        const existingPayment = paymentModes.find((p) => p.id === currentId);
        await paymentOptionService.update(currentId, {
          option: paymentMode,
          details: existingPayment?.details || `${paymentMode} payment`,
          status: existingPayment?.status ?? true,
        });
        showNotification('Payment mode updated successfully!', 'success');
      } else {
        await paymentOptionService.create({
          option: paymentMode,
          details: `${paymentMode} payment`,
          status: true,
        });
        showNotification('Payment mode added successfully!', 'success');
      }

      setPaymentMode('');
      setIsAddModalOpen(false);
      setIsEditMode(false);
      setCurrentId(null);
      fetchPaymentOptions();
    } catch (error) {
      console.error('Error saving payment option:', error);
      showNotification(error.message || 'Failed to save payment mode', 'error');
    }
  };

  // Toggle Status Handler
  const handleToggleStatus = async (payment) => {
    try {
      await paymentOptionService.update(payment.id, {
        option: payment.name,
        details: payment.details,
        status: !payment.status,
      });
      showNotification(
        `Payment mode turned ${!payment.status ? 'ON' : 'OFF'}`,
        'success'
      );
      fetchPaymentOptions();
    } catch (error) {
      console.error('Error toggling status:', error);
      showNotification('Failed to update status', 'error');
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

const handleConfirmDelete = async () => {
  if (!selectedPayment?.id) {
    showNotification('No payment mode selected', 'error');
    return;
  }

  try {
    console.log('🗑️ Deleting ID:', selectedPayment.id);
    
    await paymentOptionService.remove(selectedPayment.id);
    
    // 1. Optimistically remove from UI (instant feedback)
    setPaymentModes((prev) =>
      prev.filter((m) => m.id !== selectedPayment.id)
    );
    
    // 2. Close modals
    setIsDeleteModalOpen(false);
    setSelectedPayment(null);
    
    // 3. Show success
    showNotification('Payment mode deleted successfully!', 'success');
    
    // 4. Sync with backend (in case of multi-user or backend logic)
    await fetchPaymentOptions();
    
    console.log('✅ Refresh complete');
  } catch (error) {
    console.error('❌ Delete error:', error);
    showNotification(error.message || 'Failed to delete payment mode', 'error');
    
    // Restore the list on error
    await fetchPaymentOptions();
  }
};

  return (
    <div className="px-4 md:px-10 py-6 w-full max-w-7xl mx-auto">
      {/* Notification Toast */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center sm:text-left">
          Payments
        </h2>
        <button
          onClick={handleAddClick}
          className="bg-gradient-to-r from-purple-800 to-red-600 text-white px-4 py-2 rounded-md font-medium shadow flex items-center gap-2"
        >
          Add New Payment Mode <span className="text-xl">＋</span>
        </button>
      </div>

      {/* Payment Mode Cards */}
      {loading ? (
        <div className="text-center py-10 text-gray-500">
          Loading payment options...
        </div>
      ) : paymentModes.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No payment options found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paymentModes.map((mode) => (
            <div
              key={mode.id}
              className="border border-purple-200 rounded-2xl p-4 bg-white shadow-sm flex flex-col justify-between h-32 relative"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-800">
                  {mode.icon}
                </div>
                <span className="text-lg font-bold text-gray-800">
                  {mode.name}
                </span>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-3 text-gray-600">
                  <button
                    onClick={() => handleEditClick(mode)}
                    className="hover:text-purple-600 transition-colors"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(mode)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold ${
                      mode.status ? 'text-purple-800' : 'text-gray-400'
                    }`}
                  >
                    {mode.status ? 'ON' : 'OFF'}
                  </span>
                  <div
                    onClick={() => handleToggleStatus(mode)}
                    className={`w-10 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                      mode.status
                        ? 'bg-gradient-to-r from-purple-800 to-red-600'
                        : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${
                        mode.status ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSavePayment}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
        isEditMode={isEditMode}
      />

      <DeletePaymentConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedPayment(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Payment Method"
        description={`You can delete "${
          selectedPayment?.name || 'this payment method'
        }" permanently.`}
      />
    </div>
  );
};

export default Payments;