// src/Components/Clients/SubscriptionManagement.jsx
import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';
import uil_message from '../../assets/Images/admin/client/uil_message.png';
import arrow from '../../assets/Images/Home/arrow.png';
import SubscriptionManagementModal from './SubscriptionManagementModal';
import { clientService } from '../../Services/apiService';

const Toggle = ({ isOn, onToggle, disabled }) => (
  <div
    className={`relative w-16 h-8 rounded-full cursor-pointer transition-all duration-300 shadow-inner ${
      disabled ? 'opacity-60 cursor-not-allowed' : ''
    }`}
    style={{
      background: isOn
        ? 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
        : '#E5E7EB',
    }}
    onClick={() => !disabled && onToggle()}
  >
    {isOn && (
      <div
        className="absolute inset-0 rounded-full blur-sm opacity-40 scale-110"
        style={{
          background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
        }}
      />
    )}
    <div
      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
        isOn ? 'transform translate-x-8 shadow-lg' : 'transform translate-x-1'
      }`}
    />
    <div className="absolute inset-0 flex items-center justify-between px-2 text-xs font-semibold pointer-events-none">
      <span
        className={`transition-opacity duration-300 ${
          isOn ? 'opacity-100 text-white' : 'opacity-0'
        }`}
      >
        ON
      </span>
      <span
        className={`transition-opacity duration-300 ${
          !isOn ? 'opacity-100 text-gray-600' : 'opacity-0'
        }`}
      >
        OFF
      </span>
    </div>
  </div>
);

const InfoBlock = ({ label, value, valueClassName = '' }) => (
  <div className="flex flex-col gap-2 w-80">
    <div className="flex items-center px-2 gap-2">
      <h3 className="text-lg font-semibold text-black font-manrope">{label}</h3>
    </div>
    <div
      className="w-full h-14 rounded-lg flex items-center justify-center"
      style={{
        background:
          'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
      }}
    >
      <span
        className={`text-lg font-medium text-black font-poppins ${valueClassName}`}
      >
        {value ?? '—'}
      </span>
    </div>
  </div>
);

const formatDate = (iso) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
};

function SubscriptionManagement() {
  const [searchParams] = useSearchParams();
  const clientsId = searchParams.get('id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renewal, setRenewal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [savingToggles, setSavingToggles] = useState(false);

  const [toggleStates, setToggleStates] = useState({
    twoWeeks: true,
    oneWeek: true,
    oneDay: true,
  });

  useEffect(() => {
    let cancelled = false;
    if (!clientsId) {
      setError('Missing client id — open with ?id=CLIENTS_ID');
      setLoading(false);
      return;
    }

    setLoading(true);
    clientService
      .getClientRenewal(clientsId)
      .then((data) => {
        if (cancelled) return;
        setRenewal(data);
        setToggleStates({
          twoWeeks: data.notifyTwoWeeksAgo,
          oneWeek: data.notifyOneWeekAgo,
          oneDay: data.notifyOneDayAgo,
        });
      })
      .catch((err) => {
        console.error('Renewal fetch error:', err);
        if (!cancelled) setError(err.message || 'Failed to load renewal');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [clientsId]);

  const handleToggle = (key) => {
    // Local optimistic toggle. Persist via API if/when backend exposes it.
    setToggleStates((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2 text-[32px] mb-15">
        <span className="text-gray-400 flex items-center gap-5 text-[32px]">
          Subscriptions Purchased
          <span className="font-poppins font-bold text-[32px] leading-[120%] tracking-[0%]">
            <img src={arrow} alt="Arrow" className="w-4 h-4 inline-block" />
          </span>
        </span>
        Client Renewal
      </h1>

      {loading ? (
        <div className="flex items-center gap-3 text-gray-500 py-10">
          <Loader2 className="w-5 h-5 animate-spin text-purple-500" />
          Loading subscription data…
        </div>
      ) : error ? (
        <div className="text-red-500 font-medium py-6">{error}</div>
      ) : (
        <div className="flex flex-col gap-14">
          {/* Subscription Details */}
          <div className="w-full max-w-5xl">
            <div className="flex flex-col gap-10">
              <div className="flex gap-10 flex-wrap">
                <InfoBlock label="Current Plan" value={renewal?.currentPlan} />
                <InfoBlock
                  label="Purchased Date"
                  value={formatDate(renewal?.purchasedDate)}
                />
                <InfoBlock
                  label="Renewal Date"
                  value={formatDate(renewal?.renewalDate)}
                />
              </div>
              <div className="flex gap-10 flex-wrap">
                <InfoBlock
                  label="First Purchase on"
                  value={formatDate(renewal?.firstPurchaseOn)}
                />
                <InfoBlock
                  label="No of Renewals"
                  value={String(renewal?.noOfRenewals ?? 0).padStart(2, '0')}
                />
              </div>
            </div>
          </div>

          {/* Renewal Messages */}
          <div className="w-full max-w-5xl">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <h2 className="text-xl font-medium text-black text-opacity-60 font-manrope">
                  Subscription Renewal Messages
                </h2>

                <div className="flex justify-between items-start gap-8 flex-wrap">
                  {[
                    { key: 'twoWeeks', label: '2 weeks ago' },
                    { key: 'oneWeek', label: '1 weeks ago' },
                    { key: 'oneDay', label: '1 Day ago' },
                  ].map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center gap-8 w-72 h-14"
                    >
                      <div
                        className="w-72 h-14 rounded-lg relative"
                        style={{
                          background:
                            'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-between px-6">
                          <span className="text-lg font-semibold text-black font-manrope">
                            {label}
                          </span>
                          <Toggle
                            isOn={toggleStates[key]}
                            onToggle={() => handleToggle(key)}
                            disabled={savingToggles}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Renewal Message Preview */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xl font-medium text-black text-opacity-60 font-manrope">
                  Renewal Message
                </h3>
                <div className="relative">
                  <div
                    className="w-full min-h-32 rounded-lg p-6"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(106, 27, 154, 0.1) 0%, rgba(211, 47, 47, 0.1) 100%)',
                    }}
                  >
                    <p className="text-base font-normal text-black font-poppins leading-6 tracking-wide">
                      {renewal?.renewalMessage ||
                        'No renewal message configured for this client.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={!clientsId}
                  className="flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-medium text-lg font-poppins h-14 w-80 hover:opacity-90 transition-opacity disabled:opacity-60"
                  style={{
                    background:
                      'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)',
                  }}
                >
                  <span>Send Renewal Message</span>
                  <img src={uil_message} alt="" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <SubscriptionManagementModal
          clientsId={clientsId}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

export default withAdminLayout(SubscriptionManagement);