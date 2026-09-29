import React, { useState } from 'react';
import RenewalSuccessPopupModal from './RenewalSuccessPopupModal';
import { useNavigate } from 'react-router-dom';

const SubscriptionManagementModal = ({ onClose }) => {

    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate()
    return (
        <div className="fixed inset-0  bg-opacity-40 z-50 flex justify-center items-center">
            <div className="bg-white rounded-2xl p-6 w-[512px] shadow-lg relative">
                {/* Title */}
                <h2 className="text-[28px] font-bold text-black mb-6">Renewal Message</h2>

                {/* Message Box */}
                <div className="w-full rounded-xl bg-gradient-to-r from-[rgba(106,27,154,0.08)] to-[rgba(211,47,47,0.08)] px-5 py-4 mb-8">
                    <p className="text-[15px] text-black leading-[24px]">
                        Hey ABC Restaurant, we have an amazing renewal plan for you. The validity of the offer is going to end in 3 days. Grab it soon before the subscription prices increase.
                    </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 items-center justify-center">
                    {/* View Details Button with border gradient */}

                    {/* Send Renewal Message Button */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-1/2 px-6 py-[14px] rounded-xl text-white text-[15px] font-medium bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] hover:opacity-90 transition"
                    >
                        Send Renewal Message
                    </button>
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-4 text-2xl text-gray-400 hover:text-black"
                >
                    &times;
                </button>
            </div>




            {showModal && <RenewalSuccessPopupModal onClose={() => setShowModal(false)} />}

        </div>
    );
};

export default SubscriptionManagementModal;
