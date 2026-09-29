import React, { useRef, useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import dot from '../../assets/Images/admin/client/dot.png';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Images/Home/logo.png';

const Clients = () => {
  const [selectedClientIndex, setSelectedClientIndex] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('All Clients');
  const [showRightPanel, setShowRightPanel] = useState(false);
  const buttonRefs = useRef([]);
  const navigate = useNavigate();

  const clients = [
    { id: '01', company: 'AOH Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
    { id: '02', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '6 months Plan' },
    { id: '03', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
    { id: '04', company: 'AOH Bar', renewalDate: 'June 01, 2025', plan: '01 Year Plan' },
    { id: '05', company: 'AOH Bar', renewalDate: 'June 01, 2025', plan: '01 Year Plan' },
    { id: '06', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
    { id: '07', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '6 months Plan' },
    { id: '08', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
    { id: '09', company: 'AOH Bar', renewalDate: 'June 01, 2025', plan: '01 Year Plan' },
    { id: '10', company: 'AOH Bar', renewalDate: 'June 01, 2025', plan: '01 Year Plan' },
    { id: '11', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
    { id: '12', company: 'Jack n chill Bar', renewalDate: 'March 01, 2025', plan: '3 months Plan' },
  ];

  const getPlanButtonStyle = () => {
    return 'bg-gradient-to-b from-purple-700 to-red-600 text-white';
  };

  const getDotTop = () => {
    if (selectedClientIndex === null || !buttonRefs.current[selectedClientIndex]) return 0;
    const btn = buttonRefs.current[selectedClientIndex];
    const parent = btn.closest('.flex.h-full.relative');
    const btnRect = btn.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    return btnRect.top - parentRect.top + btn.offsetHeight / 2 - 47;
  };

  const handleClientSelect = (index) => {
    setSelectedClientIndex(index);
    setShowRightPanel(true);
  };

  const closeRightPanel = () => {
    setShowRightPanel(false);
    setSelectedClientIndex(null);
  };

  const dropdownOptions = [
    'All Clients',
    'Active Clients',
    'Inactive Clients',
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-8 gap-4 sm:gap-0 relative">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Clients</h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-48 items-start sm:items-center w-full sm:w-auto relative">
            <button
              className="bg-gradient-to-r from-[#6A1B9A] to-[#D32F2F] text-white px-4 sm:px-6 py-2 rounded-[8px] font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              onClick={() => navigate('/create-clients')}
            >
              Create Client
              <span className="text-lg">+</span>
            </button>

            {/* Dropdown Trigger */}
            <div className="relative w-full sm:w-auto">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="border border-black rounded-md px-4 py-2 text-gray-600 bg-white focus:outline-none focus:ring-2 w-full sm:w-auto"
              >
                {selectedPeriod}
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-full sm:w-[246px] bg-white shadow-[0px_4px_4px_rgba(0,0,0,0.25),inset_0px_0px_1px_rgba(0,0,0,0.25)] rounded-lg px-3 py-4 z-50">
                  {dropdownOptions.map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setSelectedPeriod(period);
                        setDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded text-[16px] font-[500] font-[Manrope] leading-[24px] ${
                        selectedPeriod === period
                          ? 'bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white'
                          : 'text-black hover:bg-gray-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row h-full relative gap-4 lg:gap-0">
          {/* Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 w-full lg:w-[70%]">
            {/* Desktop Table Header */}
            <div className="hidden sm:block bg-gradient-to-r from-purple-100 to-red-100 border-b border-gray-200 px-6 py-4">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-gray-600 font-semibold text-sm">#</div>
                <div className="text-gray-600 font-semibold text-sm">Company Name</div>
                <div className="text-gray-600 font-semibold text-sm">Renewal Date</div>
                <div className="text-gray-600 font-semibold text-sm text-center">Plan</div>
              </div>
            </div>

            <div className="overflow-y-auto lg:max-h-none">
              {clients.map((client, index) => (
                <div
                  key={index}
                  className="border-b border-gray-200 px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors duration-150"
                >
                  {/* Desktop Row */}
                  <div className="hidden sm:grid grid-cols-4 gap-4 items-center">
                    <div className="text-gray-800 font-semibold text-sm">{client.id}</div>
                    <div className="text-gray-800 font-semibold text-sm">{client.company}</div>
                    <div className="text-red-500 font-normal text-sm">{client.renewalDate}</div>
                    <div className="flex justify-center items-center gap-2">
                      <button
                        ref={(el) => (buttonRefs.current[index] = el)}
                        onClick={() => setSelectedClientIndex(index)}
                        className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200 hover:shadow-md cursor-pointer ${getPlanButtonStyle(client.plan)}`}
                      >
                        {client.plan}
                      </button>
                    </div>
                  </div>

                  {/* Mobile Card */}
                  <div className="sm:hidden space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-gray-500 text-xs font-medium">#{client.id}</div>
                        <div className="text-gray-800 font-semibold text-base">{client.company}</div>
                      </div>
                      <button
                        onClick={() => handleClientSelect(index)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 hover:shadow-md cursor-pointer ${getPlanButtonStyle(client.plan)}`}
                      >
                        {client.plan}
                      </button>
                    </div>
                    <div className="text-red-500 font-normal text-sm">
                      Renewal: {client.renewalDate}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel - Desktop */}
          <div
            className="w-[27%] min-h-[600px] right-0 ml-auto rounded-tl-[10px] relative text-white hidden lg:flex flex-col items-center py-12 px-6"
            style={{ background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)' }}
          >
            {selectedClientIndex !== null && (
              <>
                <img
                  src={dot}
                  alt="dot"
                  className="absolute left-[-40px]"
                  style={{ top: `${getDotTop()}px` }}
                />

                <h2 className="text-2xl font-bold mb-6 tracking-wide">Company Name</h2>

                <div className="bg-white rounded-xl flex items-center justify-center w-[180px] h-[180px] mb-4">
                  <img src={logo} alt="logo" className="w-[120px] h-[20px]" />
                </div>

                <p className="text-lg font-medium mb-8">{clients[selectedClientIndex].plan}</p>

                <div className="text-base text-white/80 font-medium mb-2">
                  Last Year Sales:
                  <span className="text-white text-xl font-bold ml-2">30 412 XOF</span>
                </div>

                <div className="text-base text-white/80 font-medium mb-8">
                  Total orders Last Year:
                  <span className="text-white text-xl font-bold ml-2">3 412</span>
                </div>

                <button
                  onClick={() => navigate('/client-details')}
                  className="bg-white text-[#D32F2F] w-[140px] h-[38px] rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  View More &gt;
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Bottom Sheet / Modal */}
        {showRightPanel && selectedClientIndex !== null && (
          <div className="lg:hidden fixed inset-0  bg-opacity-50 z-50 flex items-end">
            <div
              className="w-full max-h-[80vh] overflow-y-auto rounded-t-[20px] text-white flex flex-col items-center py-8 px-6 animate-slide-up"
              style={{ background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)' }}
            >
              <button
                onClick={closeRightPanel}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                ×
              </button>

              <h2 className="text-xl font-bold mb-6 tracking-wide">Company Details</h2>

              <div className="bg-white rounded-xl flex items-center justify-center w-[140px] h-[140px] mb-4">
                <img src={logo} alt="logo" className="w-[100px] h-[16px]" />
              </div>

              <h3 className="text-lg font-semibold mb-2">{clients[selectedClientIndex].company}</h3>
              <p className="text-base font-medium mb-6">{clients[selectedClientIndex].plan}</p>

              <div className="w-full max-w-sm space-y-4 mb-8">
                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">Last Year Sales</div>
                  <div className="text-white text-xl font-bold">30 412 XOF</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">Total Orders Last Year</div>
                  <div className="text-white text-xl font-bold">3 412</div>
                </div>

                <div className="text-center">
                  <div className="text-sm text-white/80 font-medium">Renewal Date</div>
                  <div className="text-white text-base font-semibold">{clients[selectedClientIndex].renewalDate}</div>
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-sm">
                <button
                  onClick={() => navigate('/client-details')}
                  className="bg-white text-[#D32F2F] flex-1 py-3 rounded-md text-base font-semibold hover:shadow-md transition-all duration-200"
                >
                  View Details
                </button>
                <button
                  onClick={closeRightPanel}
                  className="border-2 border-white text-white flex-1 py-3 rounded-md text-base font-semibold hover:bg-white/10 transition-all duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default withAdminLayout(Clients);