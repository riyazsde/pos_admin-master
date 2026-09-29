import React from 'react';
import successIcon from '../../assets/Images/admin/client/successIcon.png'; // Replace with actual success image path
import { useNavigate } from 'react-router-dom';

const SuccessPopupModal = ({ onClose }) => {

    const navigate=useNavigate()
  return (
    <div className="fixed inset-0  bg-opacity-40 z-50 flex justify-center items-center">
      <div className="relative w-[642px] h-[409px] bg-white rounded-[20px] shadow-lg">
        <div className="absolute w-[454px] h-[328px] left-1/2 -translate-x-1/2 top-[40px] flex flex-col items-center gap-[40px]">
          {/* Title + Subtitle */}
          <div className="flex flex-col items-center gap-[8px] w-[454px] h-[70px]">
            <h1 className="text-[32px] font-bold text-center text-black  leading-[120%]">
Successfully Reply Submitted            </h1>
            <p className="text-[16px] text-center  leading-[24px] tracking-[0.43px] font-[Poppins]">
Clients ticket looks like urgent so it falls under High Priority            </p>
          </div>

          {/* Checkmark */}
          <div className="relative w-[132px] h-[132px]">
              <img src={successIcon} alt="success" className="" />
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="flex justify-center items-center px-[40px] py-[16px] gap-[8px] bg-[#34C759] rounded-[12px] w-[164px] h-[54px]"
          >
            <span className="text-white text-[18px] font-medium leading-[120%] font-[Poppins]" onClick={()=>navigate('/supports')}>
              Continue
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPopupModal;
