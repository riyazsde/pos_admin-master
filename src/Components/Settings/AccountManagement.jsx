import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';

// --- Triaxx Logo ---
const TriaxxLogo = () => (
  <>
    <svg width="0" height="0" style={{ position: 'absolute' }}>
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#6A1B9A' }} />
          <stop offset="100%" style={{ stopColor: '#D32F2F' }} />
        </linearGradient>
      </defs>
    </svg>
    <div className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1.6333 21.9333V6.06667C1.6333 5.42933 1.90157 4.81922 2.37878 4.342C2.85599 3.86478 3.4661 3.5965 4.1033 3.5965H15.1666L26.23 14L15.1666 24.4035H4.1033C3.4661 24.4035 2.85599 24.1352 2.37878 23.658C1.90157 23.1808 1.6333 22.5707 1.6333 21.9333Z" fill="url(#logoGradient)" />
        <path d="M12.8333 14H2.33325" stroke="white" strokeWidth="1.5" />
        <path d="M12.8333 9.33334H5.83325" stroke="white" strokeWidth="1.5" />
        <path d="M12.8333 18.6667H5.83325" stroke="white" strokeWidth="1.5" />
      </svg>
      <span className="text-2xl font-bold bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-transparent bg-clip-text">
        TRIAXX
      </span>
    </div>
  </>
);

// --- Reusable Button Component ---
const SettingsButton = ({ children, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="
      flex justify-center items-center text-center
      px-4 py-2.5 rounded-lg
      text-base md:text-lg font-medium text-black/60
      bg-[linear-gradient(180deg,rgba(106,27,154,0.1)_0%,rgba(211,47,47,0.1)_100%)]
      hover:shadow-md transition-shadow duration-200
      min-w-[150px]
    "
  >
    {children}
  </button>
);

// --- Main Component ---
function AccountManagement() {
  const navigate = useNavigate();

  const buttons = [
    { label: "My Password", path: "/change-password" },
    { label: "My Activity", path: "/device" },
    { label: "Devices", path: "/device" },
    { label: "Language", path: "/language" },
    { label: "Date", path: "/date-time" },
    { label: "Time", path: "/date-time" },
    { label: "Currency", path: "/currency" },
  ];

  return (
    <div className="font-poppins min-h-screen w-full flex justify-center px-4 md:px-10 py-10">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">

        {/* Header */}
        <header className="flex flex-row flex-wrap items-center justify-center sm:justify-start gap-2 mb-10 text-center sm:text-left">
          <h1 className="text-black/40 text-lg sm:text-2xl font-bold">Account Settings</h1>
          <span className="text-black text-lg sm:text-2xl font-bold">{'>'}</span>
          <h2 className="text-black text-lg sm:text-2xl font-bold">Manage Account</h2>
        </header>

        {/* Main Content */}
        <main className="w-full flex flex-col items-center gap-10 sm:gap-12">
          <div className="flex items-center justify-center w-[150px] sm:w-[200px] h-[150px] sm:h-[200px] bg-[#FAFAFA] rounded-2xl shadow-[0px_0px_1px_rgba(0,0,0,0.25),_0px_4px_4px_rgba(0,0,0,0.25)]">
            <TriaxxLogo />
          </div>

          <p className="text-sm sm:text-base font-medium text-black text-center max-w-xl px-2">
            Manage your info, privacy and security to make Google work better for you.
          </p>

          <div className="w-full border-t border-black/80 my-4" />

          <nav className="w-full flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8">
            {buttons.map(({ label, path }) => (
              <SettingsButton key={label} onClick={() => navigate(path)}>
                {label}
              </SettingsButton>
            ))}
          </nav>
        </main>
      </div>
    </div>
  );
}

export default withAdminLayout(AccountManagement);
