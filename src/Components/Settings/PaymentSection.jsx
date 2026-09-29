import React, { useState } from 'react';
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

const Payments = () => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [paymentMode, setPaymentMode] = useState('');
  const [paymentModes, setPaymentModes] = useState([
    { name: 'Debit / Credit Card', icon: <FaCreditCard size={24} /> },
    { name: 'Cash', icon: <RiBankLine size={24} /> },
    { name: 'Apple Pay', icon: <FaApplePay size={24} /> },
    { name: 'Google Pay', icon: <BiRupee size={24} /> },
    { name: 'Mobile Pay', icon: <FaPaypal size={24} /> },
    { name: 'Orange Pay', icon: <BiRupee size={24} /> },
    { name: 'Stripe', icon: <FaPaypal size={24} /> },
  ]);

  const handleAddPayment = () => {
    if (paymentMode.trim()) {
      setPaymentModes([
        ...paymentModes,
        { name: paymentMode, icon: <FaCreditCard size={24} /> },
      ]);
      setPaymentMode('');
      setIsAddModalOpen(false);
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentModes.map((mode, index) => (
          <div
            key={index}
            className="w-full border border-black rounded-lg flex items-center justify-between px-4 py-3 bg-white shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 flex items-center justify-center">{mode.icon}</div>
              <span className="text-base md:text-lg font-medium">{mode.name}</span>
            </div>
            <button onClick={() => setIsDeleteModalOpen(true)}>
              <img src={deleteIcon} alt="Delete" className="w-6 h-6" />
            </button>
          </div>
        ))}
      </div>

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
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={() => setIsDeleteModalOpen(false)}
        title="Delete Card Payment"
        description="You can delete this payment method permanently."
      />
    </div>
  );
};

export default Payments;
