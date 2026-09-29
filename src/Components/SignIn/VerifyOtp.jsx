import React, { useState } from 'react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate } from 'react-router-dom';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e) => {
    e.preventDefault();
    if (!otp) return alert("Please enter OTP");
    alert("OTP Verified Successfully!");
    navigate('/set-new-password');
  };

  return (
    <div className="relative w-screen min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0">{/* Optional background blobs */}</div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        {/* Left Gradient Section (hidden on mobile) */}
        <div
          className="hidden lg:flex flex-1 flex-col justify-center px-8 lg:px-32"
          style={{
            backgroundImage: `url(${Gradient})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-[36px] lg:text-[42px] font-extrabold text-blue-900 mb-6 leading-tight">
              POS that works as hard as you. and Faster than you.
            </h1>
            <p className="text-gray-600 text-lg lg:text-xl mb-12 leading-relaxed max-w-xl">
              Grow without limit with Triaxx and make timely and accurate decisions with real-time reports.
            </p>
            <div className="flex items-center gap-4 bg-white rounded-xl px-8 py-5 shadow-lg w-[208px] h-[58.8px]">
              <div className="flex items-center gap-3 justify-between">
                <span className="font-medium text-xl">English</span>
                <img src="https://flagcdn.com/us.svg" alt="USA Flag" className="w-8 h-5 rounded-sm shadow-sm object-cover" />
              </div>
            </div>
          </div>
        </div>

        {/* Right OTP Form Section */}
        <div className="w-full lg:max-w-2xl bg-white shadow-xl overflow-y-auto px-4 sm:px-8 py-10 sm:py-16 min-h-screen lg:min-h-full flex items-center">
          <div className="max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">Sign in</h1>
              <img src={logo} alt="Company Logo" className="h-9 w-[150px] sm:w-[210px]" />
            </div>

            {/* OTP UI */}
            <div className="text-center mb-12">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">Verify OTP</h1>
              <p className="text-gray-600 text-base sm:text-lg max-w-md mx-auto">
                Please enter the authentication code received on your registered email.
              </p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-base sm:text-xl font-medium text-black mb-3">Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter the OTP"
                  className="w-full px-6 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium text-lg sm:text-xl py-4 rounded-xl hover:shadow-lg transition-shadow"
              >
                Verify OTP
              </button>

              <div
                className="w-full mt-4 rounded-xl p-[2px]"
                style={{
                  background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                }}
              >
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-full text-gray-700 font-medium text-lg sm:text-xl py-4 bg-white rounded-[10px]"
                >
                  Back
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
