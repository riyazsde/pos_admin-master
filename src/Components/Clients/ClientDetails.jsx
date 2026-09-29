import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import Restaurant from '../../assets/Images/admin/client/Restaurant.png'
import Lock from '../../assets/Images/admin/client/Lock.png'
import uil_message from '../../assets/Images/admin/client/uil_message.png'
import Icon from '../../assets/Images/admin/client/Icon.png'
import arrow from '../../assets/Images/Home/arrow.png'
import Performance from './Performance';
import RenewalPopupModal from './RenewalPopupModal';

const ClientDetails = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="w-full px-4 sm:px-6 lg:px-10 py-4 sm:py-6 lg:py-8 text-black">
            {/* Header */}
            <h1 className="text-xl sm:text-2xl lg:text-[32px] font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <span className="text-gray-400 flex items-center gap-2 sm:gap-5 text-xl sm:text-2xl lg:text-[32px]">
                    Subscriptions Purchased
                    <span className="font-poppins font-bold leading-[120%] tracking-[0%]">
                        <img src={arrow} alt="Arrow" className="w-3 h-3 sm:w-4 sm:h-4 inline-block" />
                    </span>
                </span>
                Client Details
            </h1>

            {/* Tabs */}
            <div className="relative w-full max-w-[300px] sm:w-[254px]">
                <div className="flex gap-8 sm:gap-8 pb-2 justify-start sm:justify-between">
                    {['about', 'performance'].map((tab) => (
                        <div
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer text-lg sm:text-[20px] capitalize ${
                                activeTab === tab ? 'font-bold text-black' : 'text-gray-600 font-medium'
                            }`}
                        >
                            {tab}
                        </div>
                    ))}
                </div>

                {/* Bottom Line */}
                <div className="h-[4px] w-full sm:w-[254px] bg-gray-400 relative rounded-full overflow-hidden">
                    <div
                        className="h-full absolute top-0 left-0 bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] transition-all duration-300"
                        style={{
                            width: window.innerWidth < 640 ? '50%' : '30%',
                            transform: activeTab === 'about' ? 'translateX(0%)' : 
                                      window.innerWidth < 640 ? 'translateX(100%)' : 'translateX(232%)',
                        }}
                    ></div>
                </div>
            </div>

            {/* TAB CONTENT */}
            {activeTab === 'about' && (
                <>
                    {/* Top Section */}
                    <div className="mt-6 sm:mt-8 flex flex-col lg:flex-row gap-6 lg:gap-10">
                        {/* Restaurant Image */}
                        <div className="w-full lg:w-[377px] h-[200px] sm:h-[212px] rounded-xl shadow-md overflow-hidden">
                            <img
                                src={Restaurant}
                                alt="Restaurant"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Info Box */}
                        <div className="flex flex-col justify-center w-full lg:w-[645px] bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] p-4 sm:p-6 rounded-lg">
                            <h2 className="text-xl sm:text-2xl font-bold">Restaurant Beef Cairo</h2>
                            <div className="flex items-center gap-2 mt-1 text-base sm:text-[18px] font-medium">
                                <span className="text-[#34C759]">Active user</span>
                                <span className="w-[5px] h-[5px] rounded-full bg-[#34C759]"></span>
                                <span className="text-black">1 Year</span>
                            </div>
                            <p className="text-sm mt-1 font-medium">Since 1992</p>
                            <p className="mt-2 text-base sm:text-[18px] font-medium leading-[22px]">
                                The Restaurant is the Popular for it's Food Taste and the Authentic Dishes Provided. Ambience is another main reason why it's popular. Must visit Place if you love the chicken.
                            </p>
                        </div>
                    </div>

                    {/* Subscription Section */}
                    <div className="mt-8 sm:mt-12">
                        <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8">Account & Subscription Details</h2>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 mb-6 sm:mb-8">
                            {[
                                ['Current Plan', '6 Months Plan'],
                                ['Purchased Date', 'Jan 20,2025'],
                                ['Renewal Date', 'Jan 20,2025'],
                                ['First Purchase on', 'Jan 20,2024'],
                                ['No of Renewals', '09'],
                            ].map(([label, value]) => (
                                <div key={label}>
                                    <p className="text-base sm:text-[18px] font-semibold">{label}</p>
                                    <div className="bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] rounded-lg px-4 py-3 mt-2 text-base sm:text-[18px] font-medium">
                                        {value}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-4">
                            <button 
                                className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto"   
                                onClick={() => setShowModal(true)}
                            >
                                <span className="hidden sm:inline">Send Renewal Message</span>
                                <span className="sm:hidden">Send Renewal</span>
                                <img src={uil_message} alt="Message" className="w-4 h-4 sm:w-auto sm:h-auto" />
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 sm:px-8 py-3 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white rounded-xl text-base sm:text-[18px] w-full sm:w-auto">
                                <span className="hidden sm:inline">Reset Account Password</span>
                                <span className="sm:hidden">Reset Password</span>
                                <img src={Lock} alt="Lock" className="w-4 h-4 sm:w-auto sm:h-auto" />
                            </button>
                        </div>
                    </div>

                    {/* Employee Details */}
                    <div className="mt-12 sm:mt-16 relative">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-0">Employee Details</h2>
                            <div className="flex items-center gap-2 text-base sm:text-[18px] font-medium cursor-pointer poppins-text">
                                <span>View more</span> 
                                <img src={Icon} alt="Icon" className="w-4 h-4 sm:w-auto sm:h-auto" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 mt-6 sm:mt-8">
                            {[
                                ['Managers', 10, 210],
                                ['Waiters', 100, 381],
                                ['Cashiers', 5, 149],
                                ['Kitchen Staff', 20, 227],
                            ].map(([role, count, barWidth], i) => (
                                <div key={i} className="w-full">
                                    <div className="flex justify-between items-center text-lg sm:text-[20px] font-semibold">
                                        <p>{role}</p>
                                        <p className="text-base sm:text-[18px] font-medium">{count}</p>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-300 mt-2 rounded-full relative">
                                        <div
                                            className="h-1.5 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded-full"
                                            style={{ width: `${(barWidth / 435) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}

            {activeTab === 'performance' && (
                <Performance/>
            )}

            {showModal && <RenewalPopupModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default withAdminLayout(ClientDetails);