import React from 'react';
import { createPortal } from 'react-dom';

const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0  bg-opacity-30 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl text-center">
        <h2 className="text-xl font-semibold mb-4">Would you like to Sign out?</h2>
        <label className="flex items-center justify-center gap-2 text-sm mb-6 cursor-pointer">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" />
          Do you want to save Password
        </label>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium"
          >
            No, Stay
          </button>
          <button
            onClick={onConfirm}
            className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium"
          >
            Yes, Sign out
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignOutModal;
