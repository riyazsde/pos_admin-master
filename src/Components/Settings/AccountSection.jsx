import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ChevronRight } from 'lucide-react';

function AccountSection() {
  const navigate = useNavigate();

  const SettingsRow = ({ label, hasChevron = false, onClick }) => (
    <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
      <p className="text-gray-800 font-medium">{label}</p>
      <button onClick={onClick} className="focus:outline-none">
        {hasChevron ? (
          <ChevronRight className="w-5 h-5 text-gray-600" />
        ) : (
          <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
            <Pencil className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </button>
    </div>
  );

  return (
    <div className="max-w-xl m">
      <h2 className="text-4xl font-bold text-black mb-10">Account Settings</h2>

      <div className="">
        {/* Account Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div
            className="p-5"
            style={{
              background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >
            <h2 className="text-white text-lg font-semibold">Account Details</h2>
          </div>
          <div className="px-6">
            <SettingsRow label="hello@TRIAXX.Admin" />
            <SettingsRow
              label="Password: **********"
              onClick={() => navigate('/change-password')}
            />
            <SettingsRow label="Manage TRIAXX.Admin" hasChevron   onClick={()=>navigate('/account-management')}/>
          </div>
        </div>

        {/* Regional Preference Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div
            className="p-5"
            style={{
              background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >
            <h2 className="text-white text-lg font-semibold">
              Regional Preference
            </h2>
          </div>
          <div className="px-6">
            <SettingsRow label="Languages" onClick={()=>navigate('/language')}/>
            <SettingsRow label="Date & Time"  onClick={()=>navigate('/date-time')}/>
            <SettingsRow label="Currency" onClick={()=>navigate('/currency')} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSection;
