import React from 'react';
import { useNavigate } from 'react-router-dom';
import successIcon from '../../assets/Images/admin/client/successIcon.png';

const SuccessPopupModal = ({ onClose, message }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    onClose?.();
    navigate('/supports');
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
      <div className="relative w-full max-w-[642px] bg-white rounded-[20px] shadow-lg">
        <div className="flex flex-col items-center gap-8 px-6 py-10 sm:p-10">
          <div className="flex flex-col items-center gap-2 max-w-[454px] text-center">
            <h1 className="text-2xl sm:text-[32px] font-bold text-black leading-tight">
              Successfully Reply Submitted
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-6">
              {message ||
                "Client's ticket looks urgent, so it falls under High Priority"}
            </p>
          </div>

          <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
            <img src={successIcon} alt="success" className="w-full h-full object-contain" />
          </div>

          <button
            type="button"
            onClick={handleContinue}
            className="flex justify-center items-center px-8 sm:px-10 py-3 sm:py-4 bg-[#34C759] hover:bg-[#2DB14C] rounded-[12px] min-w-[164px] transition-colors"
          >
            <span className="text-white text-base sm:text-lg font-medium">
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopupModal;