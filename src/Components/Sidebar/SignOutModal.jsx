import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
const SignOutModal = ({ isOpen, onClose, onConfirm }) => {
const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      toast.success('Signed out successfully');
    } finally {
      setIsLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-white/60 backdrop-blur-[10px] backdrop-saturate-150">
      <div className="relative overflow-hidden bg-white/95 backdrop-blur-2xl rounded-2xl p-6 max-w-md w-full border border-white/80 shadow-[0_24px_70px_rgba(106,27,154,0.18)] text-center">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-white/90 to-transparent" />
        <h2 className="relative text-xl font-semibold mb-4">Would you like to Sign out?</h2>
        <label className="flex items-center justify-center gap-2 text-sm mb-6 cursor-pointer">
          <input type="checkbox" className="form-checkbox h-4 w-4 text-purple-600" />
          Do you want to save Password
        </label>
        <div className="flex justify-center gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            No, Stay
          </button>
          <button
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 flex items-center gap-2"
          >
            {isLoading ? 'Signing out...' : 'Yes, Sign out'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default SignOutModal;