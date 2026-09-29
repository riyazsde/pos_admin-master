import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import arrow from '../../assets/Images/Home/arrow.png';
import { Eye, EyeOff } from 'lucide-react';
import PasswordResetModal from './PasswordResetModal';
import ChangePasswordSuccessPopupModal from './ChangePasswordSuccessPopupModal';

const ChangePasswordForm = () => {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="px-4 py-6 md:px-10 md:py-10 w-full max-w-5xl mx-auto">
      <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-4 flex items-center gap-2 flex-wrap">
        <span className="text-gray-400 flex items-center gap-2">
          Account Settings
          <img src={arrow} alt="Arrow" className="w-4 h-4" />
        </span>
        Forget Password
      </h1>

      <div className="flex flex-col gap-8">
        <h2 className="text-lg md:text-xl text-black/60 font-medium">
          Change Password
        </h2>

        <div className="flex flex-col gap-8">
          {/* Current Password + Forget Password */}
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            {/* Current Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter Current Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm md:text-base text-black">
                  ***************
                </span>
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowCurrent(!showCurrent)}
                >
                  {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Forget Password Button */}
            <div className="flex justify-start md:justify-end">
              <button
                onClick={openModal}
                className="bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-xs md:text-sm py-2 px-4 rounded-lg w-full md:w-auto"
              >
                Forget Password
              </button>
            </div>
          </div>

          {/* New + Confirm Password */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* New Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Enter new password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowNew(!showNew)}
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-2 flex-1">
              <label className="text-base md:text-lg font-semibold text-black">
                Re-enter New Password
              </label>
              <div className="relative w-full h-12 md:h-14 bg-gradient-to-b from-[rgba(106,27,154,0.1)] to-[rgba(211,47,47,0.1)] rounded-lg">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full h-full bg-transparent px-4 outline-none text-black text-sm md:text-base"
                  placeholder="Confirm new password"
                />
                <div
                  className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>
          </div>

          {/* Save Password Button */}
          <div className="flex justify-center">
            <button
              onClick={() => setShowModal(true)}
              className="bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white font-medium text-base md:text-lg py-3 px-6 md:px-10 rounded-xl w-full md:w-auto"
            >
              Save Password
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {isModalOpen && <PasswordResetModal onClose={closeModal} />}
      {showModal && (
        <ChangePasswordSuccessPopupModal
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default withAdminLayout(ChangePasswordForm);
