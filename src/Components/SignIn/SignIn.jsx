import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import logo from '../../assets/Images/Home/logo.png';
import Gradient from '../../assets/Images/Home/Gradient.png';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

import { authService } from '../../Services/apiService';
import { useAppSelector } from '../../Store/hooks';

export default function SignInPage() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userType, setUserType] = useState('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [language, setLanguage] = useState('French');
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef(null);

  const languages = [
    { label: 'French', code: 'fr' },
    { label: 'English', code: 'us' },
  ];
  const currentLang = languages.find((l) => l.label === language);

 useEffect(() => {
  if (isAuthenticated) {
    navigate('/Dashboard', { replace: true });
  }
}, [isAuthenticated, navigate]);

  // Signup success toast
  useEffect(() => {
    if (location.state?.signupSuccess) {
      toast.success('Account created successfully!', {
        description: 'Please sign in to continue.',
        duration: 3000,
      });
      window.history.replaceState({}, '');
    }
  }, [location.state]);

  // Close language dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabs = ['Restaurant', 'Employee', 'Admin'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const toastId = toast.loading('Signing you in...');

    try {
      const { user } = await authService.login(userType, {
        adminId: email,
        password,
        rememberMe,
      });

      toast.success('Login successful!', {
        id: toastId,
        description: `Welcome back, ${user?.Name || userType}.`,
        duration: 2000,
      });

      const redirectTo = location.state?.from?.pathname || '/Dashboard';

      setTimeout(() => {
        navigate(redirectTo, { replace: true, state: { justLoggedIn: true } });
      }, 1000);
    } catch (err) {
      console.error('Login error:', err);
      toast.error('Login failed', {
        id: toastId,
        description:
          err?.code === 'ERR_NETWORK' || err?.message === 'Failed to fetch'
            ? 'Server is unavailable. Please try again later.'
            : err?.response?.data?.message ||
              err?.message ||
              'Please check your credentials.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative w-full h-auto min-h-screen bg-white overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-[600px] -top-[600px] w-[800px] h-[800px] bg-gradient-to-b from-purple-700 to-red-600 rounded-full blur-3xl opacity-30 rotate-45"></div>
        <div className="absolute -right-[400px] -top-[300px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute -right-[250px] -top-[350px] w-[300px] h-[300px] bg-pink-300 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute -left-[600px] -top-[600px] w-[800px] h-[800px] bg-gradient-to-b from-purple-700 to-red-600 rounded-full blur-3xl opacity-30 -rotate-45"></div>
        <div className="absolute -left-[400px] -top-[300px] w-[500px] h-[500px] bg-blue-600 rounded-full blur-3xl opacity-25"></div>
        <div className="absolute -left-[250px] -top-[350px] w-[300px] h-[300px] bg-pink-300 rounded-full blur-3xl opacity-20"></div>

        <div className="absolute top-1/2 left-1/4 w-[500px] h-[200px] bg-white/60 rounded-full blur-3xl -rotate-45"></div>
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[150px] bg-white/60 rounded-full blur-3xl rotate-12"></div>
        <div className="absolute bottom-1/4 left-1/3 w-[450px] h-[180px] bg-gradient-to-r from-white/50 to-transparent rounded-full blur-2xl -rotate-12"></div>
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row w-full min-h-screen">
        {/* Left Section */}
        <div
          className="hidden lg:flex flex-1 flex-col justify-center px-8 lg:px-20 py-12"
          style={{
            backgroundImage: `url(${Gradient})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-[620px]">
            <h1 className="text-3xl lg:text-[38px] font-extrabold text-blue-900 mb-6 leading-tight">
              POS that works as hard as you. <br />
              and Faster than you.
            </h1>
            <p className="text-gray-600 text-base lg:text-xl mb-12 leading-relaxed max-w-[520px]">
              Grow without limit with Triaxx and Make timely and accurate decision with real-time reports
            </p>

            <div className="relative w-[200px] z-40" ref={langRef}>
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center bg-white rounded-xl px-6 py-3 shadow-lg w-full justify-between cursor-pointer"
              >
                <span className="font-[Manrope] font-medium text-[21px] leading-[120%] tracking-[0%] text-center text-gray-800">
                  {language}
                </span>
                <div className="flex items-center gap-3">
                  <img
                    src={`https://flagcdn.com/${currentLang.code}.svg`}
                    alt={`${language} Flag`}
                    className="w-8 h-5 rounded-sm shadow-sm object-cover shrink-0"
                  />
                  <div className="w-px h-5 bg-gray-300 shrink-0"></div>
                  <ChevronDown
                    size={20}
                    className={`text-black shrink-0 transition-transform duration-200 ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                    strokeWidth={2.5}
                  />
                </div>
              </button>

              {langOpen && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-xl shadow-xl py-2 z-50">
                  {languages.map((lang) => {
                    const isSelected = lang.label === language;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.label);
                          setLangOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-6 py-3 text-left ${
                          isSelected ? 'bg-gray-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <span className="font-[Manrope] font-medium text-[18px] text-gray-800">
                          {lang.label}
                        </span>
                        <img
                          src={`https://flagcdn.com/${lang.code}.svg`}
                          alt={`${lang.label} Flag`}
                          className="w-7 h-4 rounded-sm shadow-sm object-cover"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-[45%] bg-white shadow-xl overflow-y-auto px-4 sm:px-8 py-10 sm:py-16">
          <div className="max-w-md mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-xl sm:text-3xl font-bold text-black">Sign In</h1>
              <img src={logo} alt="Company Logo" className="h-9 w-[150px] sm:w-[210px]" />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-[#000000] text-[32px] font-bold leading-[120%] tracking-[0%] text-center poppins-text">
                Welcome Back!
              </h1>
              <p className="text-gray-600 text-[16px] font-normal leading-[120%] tracking-normal text-center poppins-text">
                Login to access your Triaxx Account
              </p>
            </div>

            <div className="flex justify-center mb-8">
              <div className="flex items-center gap-4 sm:gap-6">
                {tabs.map((tab) => {
                  const isActive = userType === tab;
                  return (
                    <div key={tab} className="flex flex-col items-center">
                      <button
                        type="button"
                        onClick={() => setUserType(tab)}
                        className={
                          isActive
                            ? 'text-lg sm:text-2xl font-bold bg-gradient-to-b from-purple-700 to-red-600 bg-clip-text text-transparent'
                            : 'text-lg sm:text-2xl font-bold text-gray-600 hover:text-gray-800 transition-colors'
                        }
                      >
                        {tab}
                      </button>
                      {isActive && (
                        <div className="w-10 sm:w-16 h-1 bg-gradient-to-r from-purple-700 to-red-600 mt-1 sm:mt-2 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-base sm:text-xl font-medium text-black mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email or username"
                  className="w-full px-5 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 text-base sm:text-lg"
                  required
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-base sm:text-xl font-medium text-black">Password</label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-gray-600 hover:text-gray-800 hover:underline"
                  >
                    Forget Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-5 py-4 bg-gradient-to-b from-purple-50 to-red-50 rounded-xl text-gray-600 placeholder-gray-500 border-0 focus:outline-none focus:ring-2 focus:ring-purple-500 pr-14 text-base sm:text-lg"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 border-2 border-black rounded"
                />
                <label htmlFor="remember" className="text-base font-medium text-black">
                  Remember me
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium text-lg sm:text-xl py-4 rounded-xl hover:shadow-lg transition-shadow disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Signing in...' : 'Submit'}
                </button>
                <p className="text-center text-sm sm:text-base text-gray-700 mt-6">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-[#FF8682] font-medium cursor-pointer hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              </div>

              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gray-400"></div>
                <span className="text-sm sm:text-base text-gray-600 px-2">Or login with</span>
                <div className="flex-1 h-px bg-gray-400"></div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                {[
                  {
                    icon: (
                      <svg className="w-6 h-6 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12a10 10 0 1 0-11.5 9.87v-6.99H8v-2.88h2.5V9.5c0-2.48 1.49-3.88 3.77-3.88 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87H17l-.4 2.88h-2.1v6.99A10 10 0 0 0 22 12Z" />
                      </svg>
                    ),
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" viewBox="0 0 24 24">
                        <path fill="#FFC107" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#FF3D00" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#4CAF50" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#1976D2" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                    ),
                  },
                  {
                    icon: (
                      <svg className="w-6 h-6" fill="#000000" viewBox="0 0 24 24">
                        <path d="M16.61 1.64c0 1.14-.42 2.09-1.26 2.93-.84.85-1.77 1.33-2.78 1.26a3.1 3.1 0 0 1-.03-.39c0-1.09.45-2.08 1.31-2.95.88-.87 1.93-1.31 3.04-1.31.02.16.02.31.02.46zm5.28 16.69c-.36.83-.79 1.6-1.27 2.3-.65.94-1.18 1.59-1.6 1.94-.65.6-1.34.91-2.06.94-.52 0-1.14-.15-1.85-.45s-1.36-.45-1.79-.45c-.47 0-1.05.15-1.75.45s-1.27.45-1.73.45c-.74-.03-1.46-.36-2.15-1-1.02-.93-1.87-2.19-2.53-3.77S3 15.54 3 13.96c0-1.63.37-3.03 1.1-4.17a6.25 6.25 0 0 1 2.37-2.35 6.5 6.5 0 0 1 3.09-.77c.6 0 1.39.17 2.36.5.97.34 1.58.5 1.84.5.2 0 .88-.2 2.02-.61a5.56 5.56 0 0 1 2-.38c1.47.12 2.56.65 3.26 1.59-1.3.79-1.94 1.91-1.91 3.36.03 1.26.46 2.3 1.29 3.11.41.39.87.69 1.36.89z" />
                      </svg>
                    ),
                  },
                ].map((item, i) => (
                  <button
                    key={i}
                    type="button"
                    className="w-28 h-12 border border-indigo-500 rounded flex items-center justify-center hover:bg-gray-50"
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}