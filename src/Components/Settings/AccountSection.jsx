// src/Components/Settings/AccountSection.jsx

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAppSelector, useAppDispatch } from '../../Store/hooks';
import { accountSettingsService } from '../../Services/apiService';
import { setProfile } from '../../Store/Features/subadmin/subadminSlice';

function AccountSection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const profile = useAppSelector((state) => state.subadmin.profile);
  const fetchedRef = useRef(false);

  // ✅ Fetch current user profile once
  useEffect(() => {
    if (fetchedRef.current || profile) return;
    fetchedRef.current = true;

    accountSettingsService
      .getProfile()
      .then((data) => dispatch(setProfile(data)))
      .catch((err) => console.warn('Profile fetch failed:', err));
  }, [dispatch, profile]);

  const userEmail = profile?.email || 'hello@TRIAXX.Admin';
  const roleName = profile?.Role_id?.role_name || 'Admin';

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
    <div className="max-w-xl mx-auto p-4 md:p-8">
      <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
        {t('accountSettings.title')}
      </h2>

      <div>
        {/* Account Details Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div
            className="p-5"
            style={{
              background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
            }}
          >
            <h2 className="text-white text-lg font-semibold">
              {t('accountSettings.accountDetails')}
            </h2>
          </div>
          <div className="px-6">
            <SettingsRow label={userEmail} />
            <SettingsRow
              label={t('accountSettings.password')}
              onClick={() => navigate('/change-password')}
            />
            <SettingsRow
              label={t('accountSettings.manageAdmin', { role: roleName })}
              hasChevron
              onClick={() => navigate('/account-management')}
            />
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
              {t('accountSettings.regionalPreference')}
            </h2>
          </div>
          <div className="px-6">
            <SettingsRow
              label={t('accountSettings.languages')}
              onClick={() => navigate('/language')}
            />
            <SettingsRow
              label={t('accountSettings.dateTime')}
              onClick={() => navigate('/date-time')}
            />
            <SettingsRow
              label={t('accountSettings.currency')}
              onClick={() => navigate('/currency')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountSection;