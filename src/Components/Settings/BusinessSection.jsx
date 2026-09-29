import React, { useState } from 'react';
import { ChevronRight, Pencil } from 'lucide-react';
import BusinessSubscriptionSettings from './BusinessSubscriptionSettings';
import { useNavigate } from 'react-router-dom';

// SectionCard Component
const SectionCard = ({ title, children }) => (
  <div className="bg-white rounded-lg border border-black max-w-lg overflow-hidden shadow">
    <div className="bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] opacity-90 px-4 py-4 rounded-t-lg">
      <h2 className="text-white text-[16px] font-semibold">{title}</h2>
    </div>
    <div>{children}</div>
  </div>
);

// RowItem Component
const RowItem = ({ label, editable = false, isBold = false, onClick }) => (
  <div
    className="flex justify-between items-center px-4 h-14 border-t border-gray-300 cursor-pointer"
    onClick={onClick}
  >
    <p className={`text-[16px] ${isBold ? 'font-semibold' : 'font-medium'} text-black`}>{label}</p>
    {editable ? (
      <div className="w-6 h-6 bg-black rounded-full flex items-center justify-center">
        <Pencil className="w-3.5 h-3.5 text-white" />
      </div>
    ) : (
      <ChevronRight className="w-4 h-4 text-black" />
    )}
  </div>
);

// ToggleRow Component
const ToggleRow = ({ label, description, enabled, onToggle }) => (
  <div className="flex flex-col px-4 py-3 border-t border-gray-300">
    <div className="flex justify-between items-center">
      <p className="text-[16px] font-medium text-black">{label}</p>
      <div
        onClick={onToggle}
        className={`w-11 h-[22px] flex items-center rounded-full cursor-pointer transition-all duration-300 ${
          enabled ? 'bg-gradient-to-b from-[#6A1B9A99] to-[#D32F2F99]' : 'bg-gray-300'
        }`}
      >
        <div
          className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
            enabled ? 'translate-x-6 bg-gradient-to-b from-[#6A1B9A99] to-[#D32F2F99]' : 'translate-x-1 bg-white'
          }`}
        />
      </div>
    </div>
    <p className="text-sm mt-1 text-gray-500">{description}</p>
  </div>
);

// SubscriptionDetails Component
const SubscriptionDetails = ({ onBack }) => (
  <div className="p-6">
    <button
      onClick={onBack}
      className="mb-6 text-sm text-blue-600 hover:underline"
    >
      ← Back to Settings
    </button>
    <h2 className="text-2xl font-bold mb-4">Subscription Details</h2>
    <p className="text-gray-700">Here you can manage your subscription plan, features, and renewal details.</p>
    {/* Add more content here as needed */}
  </div>
);

// Main Component
export default function BusinessSettings() {
  const [disablePriceChange, setDisablePriceChange] = useState(true);
  const [activeSection, setActiveSection] = useState(null); // null or 'subscriptionDetails'
const navigate=useNavigate()
  const handleBack = () => setActiveSection(null);

  if (activeSection === 'subscriptionDetails') {
    return <BusinessSubscriptionSettings/>;
  }

  const handleNavigate=()=>{
    navigate('/clients')
  }

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-4xl font-bold text-black mb-10">Business Settings</h2>

      {/* Subscriptions Section */}
      <SectionCard title="Subscriptions">
        <RowItem
          label="Subscription Details"
          editable
          onClick={() => setActiveSection('subscriptionDetails')}


        />
        <RowItem label="Active Subscriptions"  onClick={()=>handleNavigate()}/>
        <RowItem label="Inactive Subscriptions" onClick={()=>handleNavigate()} />
        <ToggleRow
          label="Turn off Subscription Price Change"
          description="You cannot change the Price of the Subscriptions"
          enabled={disablePriceChange}
          onToggle={() => setDisablePriceChange(!disablePriceChange)}
        />
        <RowItem label="Billing History"  onClick={()=>navigate('/billing-history')}/>
      </SectionCard>

      {/* Clients Section */}
      <SectionCard title="Clients" onClick={()=>handleNavigate()}>
        <RowItem label="All Clients"  onClick={()=>handleNavigate()}/>
        <RowItem label="New Clients"  onClick={()=>handleNavigate()}/>
        <RowItem label="Active Clients" onClick={()=>handleNavigate()}/>
        <RowItem label="Inactive Clients (Unrenewed)" onClick={()=>handleNavigate()}/>
      </SectionCard>
    </div>
  );
}
