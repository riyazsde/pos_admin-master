import React from 'react';
import { useNavigate } from 'react-router-dom';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import logo from '../../assets/LOGOPlande.svg';

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
            <img src={logo} alt="Company Logo" className="w-36 sm:w-44 h-auto" />
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
