import React from 'react';

const AddPaymentModal = ({ isOpen, onClose, onSave, paymentMode, setPaymentMode }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Add Payment</h2>
          <button onClick={onClose} className="text-xl font-bold">×</button>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Enter Payment mode</label>
            <input
              type="text"
              className="w-full border rounded px-4 py-2"
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              placeholder="e.g., PhonePe"
            />
          </div>

          <button
            onClick={onSave}
            className="w-full py-3 text-white font-medium  bg-gradient-to-r from-purple-700 to-red-500 hover:opacity-90 rounded-2xl"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPaymentModal;
