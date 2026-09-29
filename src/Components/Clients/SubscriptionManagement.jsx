import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import uil_message from '../../assets/Images/admin/client/uil_message.png'
import arrow from '../../assets/Images/Home/arrow.png'
import RenewalSuccessPopupModal from './RenewalSuccessPopupModal';
import RenewalPopupModal from './RenewalPopupModal';
import SubscriptionManagementModal from './SubscriptionManagementModal';

function SubscriptionManagement() {
    const [toggleStates, setToggleStates] = useState({
        twoWeeks: true,
        oneWeek: true,
        oneDay: true
    });
    const [showModal, setShowModal] = useState(false);

    const handleToggle = (key) => {
        setToggleStates(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const Toggle = ({ isOn, onToggle }) => (
        <div
            className="relative w-16 h-8 rounded-full cursor-pointer transition-all duration-300 shadow-inner"
            style={{
                background: isOn
                    ? 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
                    : '#E5E7EB'
            }}
            onClick={onToggle}
        >
            {/* Glow effect when ON */}
            {isOn && (
                <div
                    className="absolute inset-0 rounded-full blur-sm opacity-40 scale-110"
                    style={{
                        background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
                    }}
                />
            )}

            {/* Toggle circle */}
            <div
                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isOn
                    ? 'transform translate-x-8 shadow-lg'
                    : 'transform translate-x-1'
                    }`}
            />

            {/* ON/OFF Text */}
            <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold pointer-events-none">
                <span className={`transition-opacity duration-300 ${isOn ? 'opacity-100 text-white' : 'opacity-0'}`}>
                    ON
                </span>
                <span className={`transition-opacity duration-300 ${!isOn ? 'opacity-100 text-gray-600' : 'opacity-0'}`}>
                    OFF
                </span>
            </div>
        </div>
    );

    return (
        <div className=" p-6 bg-white">
            {/* Main Container */}


            <h1 className="text-2xl font-bold text-gray-800  flex items-center gap-2 text-[32px] mb-15">
                <span className="text-gray-400 flex items-center gap-5 text-[32px]">
                    Subscriptions Purchased
                    <span className="font-poppins font-bold text-[32px] leading-[120%] tracking-[0%]">
                        <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
                    </span>
                </span>
                Client Renewal</h1>
            <div className="flex flex-col  gap-14">

                {/* Subscription Details Section */}
                <div className="w-full max-w-5xl">
                    <div className="flex flex-col gap-10">

                        {/* First Row */}
                        <div className="flex gap-10">
                            {/* Current Plan */}
                            <div className="flex flex-col gap-2 w-80">
                                <div className="flex items-center px-2 gap-2 w-32 h-7">
                                    <h3 className="text-lg font-semibold text-black font-manrope">Current Plan</h3>
                                </div>
                                <div
                                    className="w-full h-14 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <span className="text-lg font-medium text-black font-poppins">6 Months Plan</span>
                                </div>
                            </div>

                            {/* Purchased Date */}
                            <div className="flex flex-col gap-2 w-80">
                                <div className="flex items-center px-2 gap-2 w-40 h-7">
                                    <h3 className="text-lg font-semibold text-black font-manrope">Purchased Date</h3>
                                </div>
                                <div
                                    className="w-full h-14 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <span className="text-lg font-medium text-black font-poppins">Jan 20,2025</span>
                                </div>
                            </div>

                            {/* Renewal Date */}
                            <div className="flex flex-col gap-2 w-80">
                                <div className="flex items-center px-2 gap-2 w-36 h-7">
                                    <h3 className="text-lg font-semibold text-black font-manrope">Renewal Date</h3>
                                </div>
                                <div
                                    className="w-full h-14 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <span className="text-lg font-medium text-black font-poppins">Jan 20,2025</span>
                                </div>
                            </div>
                        </div>

                        {/* Second Row */}
                        <div className="flex gap-10">
                            {/* First Purchase on */}
                            <div className="flex flex-col gap-2 w-80">
                                <div className="flex items-center px-2 gap-2 w-44 h-7">
                                    <h3 className="text-lg font-semibold text-black font-manrope">First Purchase on</h3>
                                </div>
                                <div
                                    className="w-full h-14 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <span className="text-lg font-medium text-black font-poppins">Jan 20,2024</span>
                                </div>
                            </div>

                            {/* No of Renewals */}
                            <div className="flex flex-col gap-2 w-80">
                                <div className="flex items-center px-2 gap-2 w-40 h-7">
                                    <h3 className="text-lg font-semibold text-black font-manrope">No of Renewals</h3>
                                </div>
                                <div
                                    className="w-full h-14 rounded-lg flex items-center justify-center"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <span className="text-lg font-medium text-black font-poppins">09</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subscription Renewal Messages Section */}
                <div className="w-full max-w-5xl">
                    <div className="flex flex-col gap-10">

                        {/* Section Title */}
                        <div className="flex flex-col gap-6">
                            <h2 className="text-xl font-medium text-black text-opacity-60 font-manrope">
                                Subscription Renewal Messages
                            </h2>

                            {/* Toggle Controls */}
                            <div className="flex justify-between items-start gap-8">

                                {/* 2 weeks ago */}
                                <div className="flex items-center gap-8 w-72 h-14">
                                    <div
                                        className="w-72 h-14 rounded-lg relative"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-between px-6">
                                            <span className="text-lg font-semibold text-black font-manrope">2 weeks ago</span>
                                            <Toggle
                                                isOn={toggleStates.twoWeeks}
                                                onToggle={() => handleToggle('twoWeeks')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 1 weeks ago */}
                                <div className="flex items-center gap-8 w-72 h-14">
                                    <div
                                        className="w-72 h-14 rounded-lg relative"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-between px-6">
                                            <span className="text-lg font-semibold text-black font-manrope">1 weeks ago</span>
                                            <Toggle
                                                isOn={toggleStates.oneWeek}
                                                onToggle={() => handleToggle('oneWeek')}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* 1 Day ago */}
                                <div className="flex items-center gap-8 w-72 h-14">
                                    <div
                                        className="w-72 h-14 rounded-lg relative"
                                        style={{
                                            background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                        }}
                                    >
                                        <div className="absolute inset-0 flex items-center justify-between px-6">
                                            <span className="text-lg font-semibold text-black font-manrope">1 Day ago</span>
                                            <Toggle
                                                isOn={toggleStates.oneDay}
                                                onToggle={() => handleToggle('oneDay')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Renewal Message Section */}
                        <div className="flex flex-col gap-4">
                            <h3 className="text-xl font-medium text-black text-opacity-60 font-manrope">
                                Renewal Message
                            </h3>

                            <div className="relative">
                                <div
                                    className="w-full h-32 rounded-lg p-6"
                                    style={{
                                        background: 'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)'
                                    }}
                                >
                                    <p className="text-base font-normal text-black font-poppins leading-6 tracking-wide">
                                        Hey ABC Restaurant, We have an Amazing Renewal Plan for you. The validity of the Offer is going to end in 3 days. Grab it soon before the prices of Subscriptions increases.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Send Button */}
                        <div className="flex justify-start">
                            <button
                                className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-medium text-lg font-poppins h-14 w-80 hover:opacity-90 transition-opacity"
                                style={{
                                    background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
                                }}

                                onClick={() => setShowModal(true)}

                            >
                                <span>Send Renewal Message</span>
                                <img src={uil_message} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showModal && <SubscriptionManagementModal onClose={() => setShowModal(false)} />}

        </div>
    );
}



export default withAdminLayout(SubscriptionManagement)