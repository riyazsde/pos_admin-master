// src/Components/Clients/SubscriptionManagementModal.jsx
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import RenewalSuccessPopupModal from './RenewalSuccessPopupModal';
import { clientService } from '../../Services/apiService';

const SubscriptionManagementModal = ({ clientsId, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!clientsId) {
      toast.error('Missing client id');
      return;
    }
    setSending(true);
    try {
      await clientService.sendRenewalMessage(clientsId);
      setShowSuccess(true);
    } catch (err) {
      toast.error(err.message || 'Failed to send renewal message');
    } finally {
      setSending(false);
    }
  };

  if (showSuccess) {
    return (
      <RenewalSuccessPopupModal onClose={() => setShowSuccess(false)} />
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[512px] shadow-lg relative">
        <h2 className="text-[28px] font-bold text-black mb-6">
          Renewal Message
        </h2>

        <div className="w-full rounded-xl bg-gradient-to-r from-[rgba(106,27,154,0.08)] to-[rgba(211,47,47,0.08)] px-5 py-4 mb-8">
          <p className="text-[15px] text-black leading-[24px]">
            Hey ABC Restaurant, we have an amazing renewal plan for you. The
            validity of the offer is going to end in 3 days. Grab it soon before
            the subscription prices increase.
          </p>
        </div>

        <div className="flex gap-4 items-center justify-center">
          <button
            onClick={handleSend}
            disabled={sending}
            className="w-1/2 px-6 py-[14px] rounded-xl text-white text-[15px] font-medium bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending…
              </>
            ) : (
              'Send Renewal Message'
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black"
          aria-label="Close"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default SubscriptionManagementModal;