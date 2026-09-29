import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionRenewalAlert = () => {
    const subscriptions = [
        { id: "01", businessName: "AOH Bars", renewalDate: "April 29, 2025" },
        { id: "02", businessName: "AOH Bars", renewalDate: "April 29, 2025" },
        { id: "03", businessName: "AOH Bars", renewalDate: "April 29, 2025" }, 
        { id: "04", businessName: "AOH Bars", renewalDate: "April 29, 2025" },
    ];
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">Subscription Renewal Alert</h2>
                <button
                    className="text-xs sm:text-sm font-semibold text-black font-['Poppins'] hover:underline"
                    onClick={() => navigate('/subscription-list')}
                >
                    See all
                </button>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[30px] border border-gray-200 shadow-sm overflow-hidden h-[400px] flex-1 flex flex-col">
                {/* Table Header */}
                <div className="bg-gradient-to-r from-[#F3E5F5] to-[#FFEBEE] px-6 sm:px-8 py-5 border-b border-gray-100">
                    <div className="grid grid-cols-12 gap-4 items-center">
                        <span className="col-span-2 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins']">#</span>
                        <span className="col-span-4 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins']">Business Name</span>
                        <span className="col-span-3 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins'] text-center">Renewal Date</span>
                        <span className="col-span-3 text-xs sm:text-sm font-semibold text-gray-500 font-['Poppins'] text-center">Notify Client</span>
                    </div>
                </div>

                {/* Table Rows */}
                <div className="flex-1 overflow-y-auto">
                    {subscriptions.map((subscription) => (
                        <div
                            key={subscription.id}
                            className="px-6 sm:px-8 py-5 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
                        >
                            <div className="grid grid-cols-12 gap-4 items-center">
                                <span className="col-span-2 text-sm font-bold text-black font-['Poppins']">
                                    {subscription.id}
                                </span>
                                <span className="col-span-4 text-sm font-bold text-black font-['Poppins']">
                                    {subscription.businessName}
                                </span>
                                <span className="col-span-3 text-sm font-medium text-[#FF4D4D] font-['Poppins'] text-center">
                                    {subscription.renewalDate}
                                </span>
                                <div className="col-span-3 flex justify-center">
                                    <button className="bg-gradient-to-b from-[#7B1FA2] to-[#D32F2F] text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-medium font-['Poppins'] hover:opacity-90 transition-opacity w-full sm:w-auto">
                                        Send Alert
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SubscriptionRenewalAlert;