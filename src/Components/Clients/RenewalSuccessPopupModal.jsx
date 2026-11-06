// src/Components/Clients/RenewalSuccessPopupModal.jsx
import React from 'react';
import successIcon from '../../assets/Images/admin/client/successIcon.png';

const RenewalSuccessPopupModal = ({ onClose, title, subtitle }) => {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="relative w-full max-w-[642px] bg-white rounded-[20px] shadow-lg">
        <div className="w-full px-6 py-10 flex flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-2 max-w-[454px] text-center">
            <h1 className="text-[28px] sm:text-[32px] font-bold text-black leading-[120%]">
              {title || 'Renewal Message Sent'}
            </h1>
            <p className="text-[14px] sm:text-[16px] leading-[24px] tracking-[0.43px] font-[Poppins]">
              {subtitle ||
                'Successfully sent the renewal reminder to the client.'}
            </p>
          </div>

          <div className="w-[132px] h-[132px] flex items-center justify-center">
            <img src={successIcon} alt="success" className="max-w-full" />
          </div>

          <button
            onClick={onClose}
            className="flex justify-center items-center px-[40px] py-[16px] bg-[#34C759] rounded-[12px] min-w-[164px] hover:opacity-90 transition"
          >
            <span className="text-white text-[18px] font-medium leading-[120%] font-[Poppins]">
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenewalSuccessPopupModal;