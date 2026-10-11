import React, { useState, useEffect } from 'react';
import deleteIcon from '../../assets/Images/Settings/1.png';
import AddPaymentModal from './AddPaymentModal';
import {
  FaCreditCard,
  FaUniversity,
  FaPaypal,
  FaGooglePay,
  FaApplePay,
} from 'react-icons/fa';
import { RiBankLine } from 'react-icons/ri';
import { BiRupee } from 'react-icons/bi';
import DeletePaymentConfirmModal from './DeletePaymentConfirmModal';
import { paymentOptionService } from '../../Services/apiService';

const Payments = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentModes, setPaymentModes] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(false);

  // Map an option name to an icon
  const getIconForOption = (optionName) => {
    const name = (optionName || '').toLowerCase();
    if (name.includes('card') || name.includes('debit') || name.includes('credit'))
      return <FaCreditCard size={24} />;
    if (name.includes('cash')) return <RiBankLine size={24} />;
    if (name.includes('apple')) return <FaApplePay size={24} />;
    if (name.includes('google')) return <FaGooglePay size={24} />;
    if (name.includes('paypal')) return <FaPaypal size={24} />;
    if (name.includes('stripe')) return <FaPaypal size={24} />;
    if (name.includes('bank') || name.includes('upi'))
      return <FaUniversity size={24} />;
    return <BiRupee size={24} />;
  };

  // Fetch all payment options
  const fetchPaymentOptions = async () => {
    setLoading(true);
    try {
      const { data } = await paymentOptionService.getAll();

      const mapped = data.map((item) => {
        const option = item.PaymentOption?.[0] || {};
        return {
          id: item._id,
          name: option.option || 'Unknown',
          details: option.Details || '',
          status: item.Status,
          icon: getIconForOption(option.option),
        };
      });

      setPaymentModes(mapped);
    } catch (error) {
      console.error('Error fetching payment options:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentOptions();
  }, []);

  // Add a new payment mode
  const handleAddPayment = async () => {
    if (!paymentMode.trim()) return;

    try {
      await paymentOptionService.create({
        option: paymentMode,
        details: `${paymentMode} payment`,
        status: true,
      });

      setPaymentMode('');
      setIsAddModalOpen(false);
      fetchPaymentOptions();
    } catch (error) {
      console.error('Error creating payment option:', error);
    }
  };

  // Open the delete confirmation
  const handleDeleteClick = (payment) => {
    setSelectedPayment(payment);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!selectedPayment?.id) return;

    try {
      await paymentOptionService.remove(selectedPayment.id);
      setIsDeleteModalOpen(false);
      setSelectedPayment(null);
      fetchPaymentOptions();
    } catch (error) {
      console.error('Error deleting payment option:', error);
    }
  };

  return (
    <div className="px-4 md:px-10 py-6 w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center sm:text-left">
          Payments
        </h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
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
              className="w-full border border-black rounded-lg flex items-center justify-between px-4 py-3 bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {mode.icon}
                </div>
                <div className="flex flex-col">
                  <span className="text-base md:text-lg font-medium">
                    {mode.name}
                  </span>
                  {mode.details && (
                    <span className="text-xs text-gray-500">
                      {mode.details}
                    </span>
                  )}
                </div>
              </div>
              <button onClick={() => handleDeleteClick(mode)}>
                <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add Payment Modal */}
      <AddPaymentModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddPayment}
        paymentMode={paymentMode}
        setPaymentMode={setPaymentMode}
      />

      {/* Delete Confirmation Modal */}
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