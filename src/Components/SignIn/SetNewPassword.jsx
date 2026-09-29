import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate } from 'react-router-dom';

export default function SetNewPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return alert('Please fill both fields.');
    if (password !== confirmPassword) return alert('Passwords do not match.');
    alert('Password reset successfully!');
    navigate('/password-success');
  };

  return (
    <div className="relative w-screen min-h-screen bg-white overflow-hidden">
      <div className="absolute inset-0">{/* Optional background blob */}</div>

      <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
        {/* Left Side - Hidden on small screens */}
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

        {/* Right Side */}
        <div className="w-full lg:max-w-2xl bg-white shadow-xl overflow-y-auto px-4 sm:px-8 py-10 sm:py-16 min-h-screen lg:min-h-full flex items-center">
          <div className="max-w-lg mx-auto w-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3">Sign in</h1>
              <img src={logo} alt="Triaxx Logo" className="h-9 w-[150px] sm:w-[210px]" />
            </div>

            {/* Title */}
            <div className="text-center mb-10 max-w-md mx-auto">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">Set a New Password</h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Your previous password has been reset. Please set a new password for your account.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleCreate} className="space-y-6">
              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-medium text-black mb-2">Create New Password</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-red-50 text-black placeholder-gray-500 focus:outline-none text-sm sm:text-base"
                />
                <div
                  className="absolute right-4 top-[47px] cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <label className="block text-sm sm:text-base font-medium text-black mb-2">Re-type Password</label>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full px-4 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-red-50 text-black placeholder-gray-500 focus:outline-none text-sm sm:text-base"
                />
                <div
                  className="absolute right-4 top-[47px] cursor-pointer"
                  onClick={() => setShowConfirm(!showConfirm)}
                >
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-700 via-pink-600 to-red-600 text-white font-semibold text-base sm:text-lg hover:shadow-lg transition-shadow"
              >
                Create
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
