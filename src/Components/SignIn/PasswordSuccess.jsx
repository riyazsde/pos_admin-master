import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/Images/Home/logo.png'; // adjust if needed
import Gradient from '../../assets/Images/Home/Gradient.png';
import tickImg from '../../assets/Images/Home/tick.png'
export default function PasswordSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000); // redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-screen h-screen bg-white overflow-hidden">
      <div className="relative z-10 flex h-screen w-full">
        {/* Left Side — keep same as SetNewPassword */}
        <div
          className="flex-1 flex flex-col justify-center px-16 lg:px-32"
          style={{
            backgroundImage: `url(${Gradient})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundBlendMode: 'overlay',
          }}
        >
          <div className="max-w-2xl">
            <h1 className="text-[42px] font-extrabold text-blue-900 mb-6 leading-tight">
              POS that works as hard as you. and Faster than you.
            </h1>
            <p className="text-gray-600 text-xl mb-12 leading-relaxed max-w-xl">
              Grow without limit with Triaxx and Make timely and accurate decisions with real-time reports.
            </p>
            <div className="flex items-center gap-4 bg-white rounded-xl px-8 py-5 shadow-lg w-[208px] h-[58.8px]">
              <div className="flex items-center gap-10">
                <div className="flex items-center gap-3 justify-between">
                  <span className="font-medium text-xl">English</span>
                  <img src="https://flagcdn.com/us.svg" alt="USA Flag" className="w-8 h-5 rounded-sm shadow-sm object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Right Side — success message */}
        <div className="w-full max-w-2xl flex items-center justify-center bg-white">
          <div className="text-center px-4">
            <img src={logo} alt="Triaxx Logo" className="h-[40px] mx-auto mb-4" />

            <div className="flex justify-center items-center gap-2 mb-3">
              <img src={tickImg}/>
              <h2 className="text-3xl font-bold text-black">All done !</h2>
            </div>

            <p className="text-gray-500 text-[16px] max-w-sm mx-auto leading-relaxed">
              Your Password has been reset. you can sign in with to your account
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
