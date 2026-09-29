import React, { useState } from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { BsEnvelopeOpen, BsCheckCircle } from 'react-icons/bs';
import SuccessPopupModal from './SuccessPopupModal';

const StatusDropdown = ({ status, setStatus }) => {
  const [isOpen, setIsOpen] = useState(false);

  const statusOptions = ['New', 'On-Going', 'Resolved'];

  const statusColors = {
    New: 'bg-blue-500 text-white',
    'On-Going': 'bg-yellow-500 text-white',
    Resolved: 'bg-green-500 text-white',
  };

  const statusIcons = {
    New: <BsEnvelopeOpen className="w-3 h-3 sm:w-4 sm:h-4" />,
    'On-Going': <BsEnvelopeOpen className="w-3 h-3 sm:w-4 sm:h-4" />,
    Resolved: <BsCheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />,
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1 sm:gap-2 px-3 py-2 sm:px-4 rounded-lg ${statusColors[status]} transition text-sm sm:text-base`}
      >
        {statusIcons[status]}
        <span className="font-medium">{status}</span>
        <ChevronDownIcon className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-36 sm:w-40 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {statusOptions.map((option) => (
            <div
              key={option}
              onClick={() => {
                setStatus(option);
                setIsOpen(false);
              }}
              className="px-3 py-2 sm:px-4 cursor-pointer hover:bg-gray-100 flex items-center gap-2 text-xs sm:text-sm"
            >
              {statusIcons[option]}
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const TicketDetails = () => {
  const [email, setEmail] = useState('AOHBars@gmail.com');
  const [businessName, setBusinessName] = useState('AOH BARS');
  const [subject, setSubject] = useState('Money Deposit not working');
  const [reply, setReply] = useState('');
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [status, setStatus] = useState('New');
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full flex justify-center px-2 sm:px-4">
      <div className="flex flex-col items-end p-4 sm:p-6 gap-4 w-full bg-gradient-to-b from-purple-700/10 to-red-600/10 rounded-xl sm:rounded-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full gap-3 sm:gap-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full"></div>
            <p className="font-poppins font-medium text-sm sm:text-base text-black">Ticket# 2023-CS123</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
            <p className="font-poppins font-medium text-xs sm:text-sm text-black">Posted at 12:45 AM</p>
            <StatusDropdown status={status} setStatus={setStatus} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col items-end w-full gap-6 sm:gap-10">
          <div className="flex flex-col items-start w-full gap-16 sm:gap-[120px]">
            <div className="flex flex-col items-start w-full gap-6 sm:gap-8">
              {/* Editable Fields */}
              <div className="flex flex-col lg:flex-row lg:flex-wrap items-start w-full gap-4 sm:gap-6 lg:gap-7">
                <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                  <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">Email</p>
                  <input
                    type="email"
                    className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                  <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">Business Name</p>
                  <input
                    type="text"
                    className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="flex flex-col items-start gap-2 w-full lg:flex-1 lg:min-w-[280px]">
                  <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">Ticket Subject</p>
                  <input
                    type="text"
                    className="box-border p-3 sm:p-4 w-full h-[45px] sm:h-[50px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>

              {/* Description */}
              <p className="font-poppins font-medium text-base sm:text-lg text-black w-full">How to deposit money to my portal?</p>
              <p className="font-poppins font-normal text-sm sm:text-base leading-[170%] text-black w-full">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur
                adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              </p>

              {/* Image Upload Section */}
              <div className="flex flex-col items-start gap-2 w-full max-w-full sm:max-w-[366px]">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40]">Images Uploaded</p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 border border-black/50 rounded p-3 sm:p-4 w-full">
                  {/* Image 01 */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="flex justify-center items-center px-3 py-2 sm:px-2 sm:py-1 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg">
                        <p className="font-poppins font-semibold text-xs sm:text-sm text-white">Image 01</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setImage1(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                    {image1 && <img src={image1} alt="Preview 1" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />}
                  </div>

                  {/* Image 02 */}
                  <div className="flex items-center justify-between sm:justify-start gap-3 sm:gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <div className="flex justify-center items-center px-3 py-2 sm:px-2 sm:py-1 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg">
                        <p className="font-poppins font-semibold text-xs sm:text-sm text-white">Image 02</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) setImage2(URL.createObjectURL(file));
                        }}
                      />
                    </label>
                    {image2 && <img src={image2} alt="Preview 2" className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded" />}
                  </div>
                </div>
              </div>
            </div>

            {/* Reply Section */}
            <div className="flex flex-col items-end w-full gap-6 sm:gap-10">
              <div className="flex flex-col items-start w-full gap-2">
                <p className="font-poppins font-medium text-base sm:text-lg text-[#2E2A40] w-full">Reply Ticket</p>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Explain here..."
                  className="box-border p-3 sm:p-4 w-full h-[140px] sm:h-[182px] border border-black/50 rounded font-poppins text-sm sm:text-base text-black resize-none"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="flex justify-center items-center px-6 py-3 sm:px-10 sm:py-4 bg-gradient-to-b from-purple-700 to-red-600 rounded-lg w-full sm:w-auto"
              >
                <p className="font-poppins font-medium text-base sm:text-lg text-white">Submit Reply</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showModal && <SuccessPopupModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default withAdminLayout(TicketDetails);