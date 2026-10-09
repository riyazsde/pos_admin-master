// src/Components/SubscriptionTable/SubscriptionDetails.jsx

import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  CreditCard,
  FileText,
  Download,
  RotateCcw,
  CheckCircle2,
  Calendar,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// ---------------------------------------------------------------------------
// Mock Data (Replace with real API data from `subscription` prop)
// ---------------------------------------------------------------------------
const MOCK_BILLING_HISTORY = [
  { date: 'Apr 25, 2028', desc: 'Monthly Subscription - 6 Months Plan', amount: '$299.00', status: 'Paid', invoice: 'INV-2026-04', action: 'Download' },
  { date: 'Mar 25, 2028', desc: 'Monthly Subscription - 6 Months Plan', amount: '$299.00', status: 'Paid', invoice: 'INV-2026-03', action: 'Download' },
  { date: 'Feb 25, 2028', desc: 'Monthly Subscription - 6 Months Plan', amount: '$299.00', status: 'Paid', invoice: 'INV-2026-02', action: 'Download' },
  { date: 'Jan 25, 2028', desc: 'Hardware Device - Terminal #2', amount: '$450.00', status: 'Paid', invoice: 'INV-2026-01', action: 'Download' },
  { date: 'Dec 25, 2027', desc: 'Monthly Subscription - 6 Months Plan', amount: '$299.00', status: 'Paid', invoice: 'INV-2025-12', action: 'Download' },
];

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------
const SubscriptionDetails = ({ subscription, onBack }) => {
  const { t } = useTranslation();

  // ETF Calculator State
  const [monthsRemaining, setMonthsRemaining] = useState(12);
  const etfRate = 0.5; // 50%
  const calculatedETF = (monthsRemaining * 299 * etfRate).toFixed(2);

  // Use mock data or fallback to subscription prop if available
  const currentPlan = {
    name: subscription?.Plan?.PlanName || '6 Months Plan',
    type: subscription?.Plan?.Subscription_Type || 'SaaS + Hardware Bundle',
    price: subscription?.Plan?.Price || 299,
  };

  const renewalDate = subscription?.Renewal_Date 
    ? new Date(subscription.Renewal_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'June 30, 2026';

  const nextBilling = subscription?.Purchase_Date
    ? new Date(new Date(subscription.Purchase_Date).setMonth(new Date(subscription.Purchase_Date).getMonth() + 1)).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'May 30, 2026';

  const contractEndDate = subscription?.Contract_End_Date
    ? new Date(subscription.Contract_End_Date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Dec 30, 2026';

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen font-poppins">
      {/* ================= BREADCRUMB & HEADER ================= */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-gray-600" />
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          Subscriptions <span className="text-gray-400 font-normal mx-1">&gt;</span> Subscription & Billing Details
        </h1>
      </div>

      {/* ================= GRADIENT PLAN HEADER ================= */}
      <div className="bg-gradient-to-r from-[#7B1FA2] via-[#9C27B0] to-[#D32F2F] rounded-2xl p-6 text-white shadow-lg mb-6 relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
          <div>
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Current Plan</span>
            <h2 className="text-2xl font-bold mt-1">{currentPlan.name}</h2>
            <p className="text-sm text-white/80 mt-1">{currentPlan.type}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-medium text-white/70 uppercase tracking-wider">Monthly Price</span>
            <div className="text-3xl font-bold mt-1">${currentPlan.price}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/20 relative z-10">
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Renewal Date</p>
            <p className="text-sm font-medium">{renewalDate}</p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Deposit Status</p>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> Paid
            </p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Contract Status</p>
            <p className="text-sm font-medium flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-300" /> Active
            </p>
          </div>
          <div>
            <p className="text-[11px] text-white/60 uppercase tracking-wider mb-0.5">Next Billing</p>
            <p className="text-sm font-medium">{nextBilling}</p>
          </div>
        </div>
      </div>

      {/* ================= INFO & ETF CALCULATOR GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Account & Subscription Details */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#8E24AA]" /> Account & Subscription Details
          </h3>
          <div className="grid grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Purchase Date</p>
              <p className="text-sm font-medium text-gray-800">Jan 25, 2024</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">No. of Renewals</p>
              <p className="text-sm font-medium text-gray-800">3</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Device Count</p>
              <p className="text-sm font-medium text-gray-800">2</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Contract End Date</p>
              <p className="text-sm font-medium text-gray-800">{contractEndDate}</p>
            </div>
            <div>
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-0.5">Deposit Amount</p>
              <p className="text-sm font-medium text-gray-800">$500</p>
            </div>
          </div>
        </div>

        {/* Early Termination Fee (ETF) Calculator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-5 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#D32F2F]" /> Early Termination Fee (ETF) Calculator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] text-gray-400 uppercase tracking-wider mb-1.5">Months Remaining on Contract</label>
              <input
                type="number"
                value={monthsRemaining}
                onChange={(e) => setMonthsRemaining(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                min="0"
              />
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <p className="text-[11px] text-gray-500 mb-1">ETF Rate</p>
              <p className="text-sm font-semibold text-gray-800 mb-4">50% of remaining months</p>
              
              <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-1">Calculated ETF Amount</p>
              <p className="text-2xl font-bold text-[#8E24AA]">${calculatedETF}</p>
            </div>

            <p className="text-[10px] text-gray-400 flex items-start gap-1.5 mt-2">
              <AlertCircle className="w-3 h-3 shrink-0 mt-0.5" />
              ETF applies only if contract is terminated before {contractEndDate}.
            </p>
          </div>
        </div>
      </div>

      {/* ================= UPGRADE / DOWNGRADE PLAN ================= */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <RotateCcw className="w-4 h-4 text-gray-500" /> Upgrade / Downgrade Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 3 Months Plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="text-base font-semibold text-gray-800 mb-1">3 Months Plan</h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-gray-900">$349</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">SaaS Only</p>
          </div>

          {/* 6 Months Plan (Active) */}
          <div className="bg-white rounded-xl border-2 border-purple-500 p-5 shadow-md relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8E24AA] text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
              Current Plan
            </span>
            <h4 className="text-base font-semibold text-gray-800 mb-1">6 Months Plan</h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-gray-900">$299</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">SaaS + Hardware Bundle</p>
            <div className="mb-4">
              <span className="text-xs font-semibold text-green-600">Save 15%</span>
            </div>
            <button className="w-full py-2.5 bg-gray-200 text-gray-500 font-semibold text-sm rounded-lg cursor-not-allowed">
              Active
            </button>
          </div>

          {/* 12 Months Plan */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
            <h4 className="text-base font-semibold text-gray-800 mb-1">12 Months Plan</h4>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-2xl font-bold text-gray-900">$249</span>
              <span className="text-xs text-gray-500">/mo</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">SaaS + Hardware Bundle</p>
            <div className="mb-4">
              <span className="text-xs font-semibold text-green-600">Save 30%</span>
            </div>
          </div>

        </div>
      </div>

      {/* ================= PAYMENT METHOD & QUICK ACTIONS ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Payment Method */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#D32F2F]" /> Payment Method
          </h3>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-gray-50/50">
            <div className="flex items-center gap-4">
              {/* Visa Logo Placeholder */}
              <div className="w-12 h-8 bg-blue-800 rounded flex items-center justify-center">
                <span className="text-white text-[10px] font-bold italic">VISA</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">**** **** **** 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2028</p>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-xs text-gray-400 mt-3">Restaurant Beef Cairo</p>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Calendar className="w-4 h-4 text-gray-500" /> View Renewal Schedule
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Download className="w-4 h-4 text-gray-500" /> Download Contract
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <RotateCcw className="w-4 h-4 text-gray-500" /> Request Cancellation
            </button>
          </div>
        </div>
      </div>

      {/* ================= BILLING HISTORY ================= */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" /> Billing History
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Description</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Invoice</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_BILLING_HISTORY.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4 text-sm text-gray-600">{item.date}</td>
                  <td className="px-5 py-4 text-sm text-gray-800 font-medium">{item.desc}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-gray-800">{item.amount}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-green-100 text-green-700">
                      <CheckCircle2 className="w-3 h-3" /> {item.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 font-mono text-xs">{item.invoice}</td>
                  <td className="px-5 py-4 text-right">
                    <button className="text-xs font-semibold text-purple-600 hover:text-purple-800 flex items-center justify-end gap-1 transition-colors">
                      <Download className="w-3 h-3" /> {item.action}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SubscriptionDetails;