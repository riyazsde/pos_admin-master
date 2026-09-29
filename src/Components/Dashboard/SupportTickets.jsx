import React from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '../../assets/Images/admin/Dashboard/mcd.png';
import kfc from '../../assets/Images/admin/Dashboard/kfc.png';
import taco from '../../assets/Images/admin/Dashboard/taco.png';
import dalchini from '../../assets/Images/admin/Dashboard/dalchini.png';

const SupportTickets = () => {
    const tickets = [
        { id: 1, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: image1 },
        { id: 2, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: kfc },
        { id: 3, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: taco },
        { id: 4, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: dalchini },
        { id: 5, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: image1 },
        { id: 6, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: kfc },
        { id: 7, restaurant: "Jason Restaurant", issue: "Addons are displa...", avatar: taco },
    ];
    const navigate = useNavigate();

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-black font-['Poppins']">Open Ticket</h2>
                <button
                    className="text-xs sm:text-sm font-semibold text-black font-['Poppins'] hover:underline"
                    onClick={() => navigate('/supports')}
                >
                    See all
                </button>
            </div>

            {/* Tickets Container - Fixed Height, Hidden Scrollbar */}
            <div className="bg-white border border-gray-200 rounded-[30px] shadow-sm h-[400px] flex flex-col overflow-hidden">
                {/* Scrollable Inner List - Scrollbar Hidden */}
                <div className="flex-1 overflow-y-auto px-5 py-5 no-scrollbar">
                    <div className="space-y-4">
                        {tickets.map((ticket, index) => (
                            <div key={ticket.id}>
                                <div className="flex items-center justify-between">
                                    {/* Left side - Avatar and info */}
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 shrink-0">
                                            <img
                                                src={ticket.avatar}
                                                alt="Avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-black font-['Poppins']">
                                                {ticket.restaurant}
                                            </span>
                                            <span className="text-xs sm:text-sm text-gray-400 font-['Poppins']">
                                                {ticket.issue}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Right side - Resolve button */}
                                    <button className="bg-gradient-to-b from-[#7B1FA2] to-[#D32F2F] text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-lg text-sm font-medium font-['Poppins'] hover:opacity-90 transition-opacity whitespace-nowrap">
                                        Resolve
                                    </button>
                                </div>

                                {/* Divider line */}
                                {index < tickets.length - 1 && (
                                    <div className="border-t border-gray-100 mt-4"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportTickets;