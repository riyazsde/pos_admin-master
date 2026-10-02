import React from 'react';
import { 
  FileText, 
  FileDown, 
  Calendar, 
  LogIn, 
  ShoppingCart, 
  Settings, 
  Filter, 
  Search, 
  ChevronDown,
  ArrowRight
} from 'lucide-react';

// Reusable component for top metric cards
const StatCard = ({ title, value, icon: Icon, iconColor }) => (
  <div className="flex flex-col gap-2 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
    <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
      <span>{title}</span>
      <Icon className={`w-4 h-4 ${iconColor}`} />
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
);

// Reusable component for filter dropdowns
const FilterSelect = ({ label, placeholder }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-xs text-gray-500 font-medium">{label}</label>
    <div className="relative">
      <select className="w-full appearance-none bg-white border border-gray-200 text-gray-700 text-sm rounded-md px-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 cursor-pointer">
        <option value="">{placeholder}</option>
      </select>
      <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// Badge component for the "Action" column
const ActionBadge = ({ type, text }) => {
  const styles = {
    login: 'bg-gray-100 text-gray-700 border-gray-200',
    modify: 'bg-green-50 text-green-700 border-green-200',
    refund: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const Icon = {
    login: LogIn,
    modify: ShoppingCart, // Using cart for visual similarity to the image
    refund: ({ className }) => <span className={`font-bold ${className}`}>$</span>,
  }[type];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border ${styles[type]}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{text}</span>
    </div>
  );
};

export default function AuditDashboard() {
  // Mock data to match the image
  const auditLogs = [
    {
      id: 1,
      timestamp: '2026-04-27 14:32:19',
      user: { name: 'Sarah Johnson', role: 'Restaurant Owner' },
      action: { type: 'login', text: 'Login' },
      location: { name: 'Downtown Bistro', sub: 'Chrome on macOS' },
      ip: '192.168.1.101',
      details: { main: 'Successful login', sub: null, highlight: false },
      pos: 'Processed Ref'
    },
    {
      id: 2,
      timestamp: '2026-04-27 14:29:42',
      user: { name: 'Michael Chen', role: 'Manager' },
      action: { type: 'modify', text: 'Order Modified' },
      location: { name: 'Downtown Bistro', sub: 'POS Terminal' },
      ip: '192.168.1.102',
      details: { main: 'Order #12345 - Item quantity changed', sub: 'Has below error values', highlight: true },
      pos: 'Change Price'
    },
    {
      id: 3,
      timestamp: '2026-04-27 14:15:30',
      user: { name: 'Emily Martinez', role: 'Cashier' },
      action: { type: 'refund', text: 'Refund Issued' },
      location: { name: 'Ocean View Cafe', sub: 'POS Terminal' },
      ip: '192.168.2.101',
      details: { main: 'Refund for Order #12340', sub: 'Has below error values', highlight: true },
      pos: 'Went Offline'
    },
    // Dummy row to show table structure repeating
    {
        id: 4,
        timestamp: '2026-04-27 14:15:30',
        user: { name: 'Michael Chen', role: 'Manager' },
        action: { type: 'modify', text: 'Order Modified' },
        location: { name: 'Ocean View Cafe', sub: 'POS Terminal' },
        ip: '192.168.2.101',
        details: { main: 'Order #12338 - Manager', sub: null, highlight: false },
        pos: '--'
      },
  ];

  return (
    <div className="min-h-screen bg-white p-6 md:p-8 font-sans">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Audits</h1>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors bg-white">
              <FileDown className="w-4 h-4" />
              Export CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-700 rounded-md text-sm font-medium text-white hover:bg-purple-800 transition-colors">
              <FileText className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard title="Total Logs" value="10" icon={FileText} iconColor="text-gray-400" />
          <StatCard title="Today's Activity" value="10" icon={Calendar} iconColor="text-blue-500" />
          <StatCard title="Login Events" value="2" icon={LogIn} iconColor="text-green-500" />
          <StatCard title="Order Changes" value="3" icon={ShoppingCart} iconColor="text-orange-500" />
          <StatCard title="Stock Adjustments" value="2" icon={Settings} iconColor="text-purple-500" />
        </div>

        {/* Filters Section */}
        <div className="bg-white border border-gray-100 rounded-lg p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-gray-600 font-semibold">
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <FilterSelect label="Date Range" placeholder="Select one..." />
            <FilterSelect label="Action Type" placeholder="Select one..." />
            <FilterSelect label="User" placeholder="Select one..." />
            <FilterSelect label="Location" placeholder="Select one..." />
            
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs text-gray-500 font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="w-full bg-white border border-gray-200 text-gray-700 text-sm rounded-md pl-9 pr-3 py-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50/50 border-b border-gray-200 text-gray-600 font-medium">
              <tr>
                <th className="px-4 py-3">Timestamp</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">IP Address</th>
                <th className="px-4 py-3">Details</th>
                <th className="px-4 py-3">Which POS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-gray-900 font-medium">{log.timestamp.split(' ')[0]}</span>
                        <span className="text-gray-500 text-xs">{log.timestamp.split(' ')[1]}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900 font-medium">{log.user.name}</span>
                      <span className="text-gray-500 text-xs">{log.user.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ActionBadge type={log.action.type} text={log.action.text} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-start gap-2">
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-0.5" />
                      <div className="flex flex-col">
                        <span className="text-gray-900">{log.location.name}</span>
                        <span className="text-gray-500 text-xs">{log.location.sub}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{log.ip}</span>
                      <span className="text-gray-500 text-xs">{log.location.sub === 'Chrome on macOS' ? 'Chrome on macOS' : 'POS Terminal'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-gray-900">{log.details.main}</span>
                      {log.details.sub && (
                        <span className={`text-xs ${log.details.highlight ? 'text-purple-600 font-medium' : 'text-gray-500'}`}>
                          {log.details.sub}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-gray-600">
                    {log.pos}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}