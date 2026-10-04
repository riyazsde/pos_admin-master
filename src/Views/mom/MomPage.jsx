import React, { useState, useEffect } from 'react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Bell, 
  Search, 
  Filter, 
  MoreVertical,
  Smartphone,
  Tablet,
  Printer,
  Monitor,
  Lock,
  Unlock,
  RotateCcw,
  Download,
  Trash2,
  Plus,
  X
} from 'lucide-react';

// --- Mock Data & API Simulation ---
// In a real app, these would be replaced with actual fetch calls to your endpoints.

const INITIAL_DEVICES = [
  {
    "_id": "6ac1f89fbcf753575e7381e1",
    "Name": "riyaz",
    "type": "Tablet",
    "isActive": true,
    "Devices_ModelNo": "2",
    "Total_Stocks": 0,
    "Serial_Number": "12",
    "IMEI": "asfdg423423",
    "Android_ID": null,
    "Merchant_Assignment": null,
    "Enrollment_Token": null,
    "Provisioning_Type": null,
    "Device_Ownership": null,
    "Kiosk_Profile": null,
    "MDM_Policy_Assignment": null,
    "Enrollment_Mode": null,
    "MAC_Address": null,
    "Firmware": null,
    "Purchase_Vendor": null,
    "Warehouse": null,
    "Procurement_Batch": null,
    "Import_Batch": null,
    "Acquisition_Cost": 0,
    "App_Version": null,
    "Last_Seen": null,
    "Battery_Percentage": null,
    "Storage_Used_Percentage": null,
    "Uptime_Days": 0,
    "isLocked": false,
    "Needs_Update": false,
    "Scheduled_Restart": null,
    "Auto_Recovery_Mode": true,
    "Last_Restart_Status": null,
    "WipedAt": null,
    "Devices_company": "a",
    "Devices_Operating_system": null,
    "timeZone": null,
    "Device_browser": null,
    "location": null,
    "IPAddress": null,
    "price": 0,
    "Status": true,
    "CreateBy": {
      "user_id": 1,
      "Name": "Admin",
      "email": "admin_pos@yopmail.com"
    },
    "CreateAt": "2026-10-04T06:56:31.389Z",
    "UpdatedAt": "2026-10-04T06:56:31.389Z",
    "MyDevices_id": 4,
    "UpdatedBy": null
  },
  {
    "_id": "6ab631f3883b53ca622154f8",
    "Name": "Z500C Payment Terminal",
    "type": "POS Terminal",
    "isActive": true,
    "Devices_ModelNo": "Z500C",
    "Total_Stocks": 0,
    "Serial_Number": "Z500C-00001234",
    "IMEI": null,
    "Android_ID": null,
    "Merchant_Assignment": null,
    "Enrollment_Token": null,
    "Provisioning_Type": null,
    "Device_Ownership": null,
    "Kiosk_Profile": null,
    "MDM_Policy_Assignment": null,
    "Enrollment_Mode": null,
    "MAC_Address": null,
    "Firmware": null,
    "Purchase_Vendor": null,
    "Warehouse": null,
    "Procurement_Batch": null,
    "Import_Batch": null,
    "Acquisition_Cost": 0,
    "App_Version": null,
    "Last_Seen": "2026-09-25T08:39:52.461Z",
    "Battery_Percentage": null,
    "Storage_Used_Percentage": null,
    "Uptime_Days": 0,
    "isLocked": false,
    "Needs_Update": false,
    "Scheduled_Restart": null,
    "Auto_Recovery_Mode": true,
    "Last_Restart_Status": null,
    "WipedAt": null,
    "Devices_company": null,
    "Devices_Operating_system": null,
    "timeZone": null,
    "Device_browser": null,
    "location": null,
    "IPAddress": null,
    "price": 0,
    "Status": true,
    "CreateBy": {
      "user_id": 18,
      "Name": "alt.xa-5o6j10us",
      "email": "alt.xa-5o6j10us@yopmail.com"
    },
    "CreateAt": "2026-09-25T08:33:55.816Z",
    "UpdatedAt": "2026-09-25T08:39:52.462Z",
    "MyDevices_id": 3,
    "UpdatedBy": null
  },
  {
    "_id": "6a8ef4dc75719d1c9a5ee36d",
    "Name": "Receipt Printer",
    "type": "Printer",
    "isActive": true,
    "Devices_ModelNo": "Epson TM-T88VII",
    "Total_Stocks": 25,
    "Serial_Number": "PRN-SN-0001",
    "IMEI": "356789012345678",
    "Android_ID": null,
    "Merchant_Assignment": null,
    "Enrollment_Token": null,
    "Provisioning_Type": null,
    "Device_Ownership": null,
    "Kiosk_Profile": null,
    "MDM_Policy_Assignment": null,
    "Enrollment_Mode": null,
    "MAC_Address": "00:1A:2B:3C:4D:5E",
    "Firmware": "v2.4.1",
    "Purchase_Vendor": "POS Hardware Supply Ltd",
    "Warehouse": "Central Warehouse",
    "Procurement_Batch": "PROC-2026-08-001",
    "Import_Batch": "IMP-2026-08-001",
    "Acquisition_Cost": 550,
    "App_Version": null,
    "Last_Seen": null,
    "Battery_Percentage": null,
    "Storage_Used_Percentage": null,
    "Uptime_Days": 0,
    "isLocked": false,
    "Needs_Update": false,
    "Scheduled_Restart": null,
    "Auto_Recovery_Mode": true,
    "Last_Restart_Status": null,
    "WipedAt": null,
    "Devices_company": "Epson",
    "Devices_Operating_system": null,
    "timeZone": null,
    "Device_browser": null,
    "location": null,
    "IPAddress": null,
    "price": 0,
    "Status": true,
    "CreateBy": {
      "user_id": 1,
      "Name": "Admin",
      "email": "admin_pos@yopmail.com"
    },
    "CreateAt": "2026-08-26T14:14:52.461Z",
    "UpdatedAt": "2026-08-26T14:14:52.461Z",
    "MyDevices_id": 2,
    "UpdatedBy": null
  },
  {
    "MAC_Address": null,
    "Firmware": null,
    "Purchase_Vendor": null,
    "Warehouse": null,
    "Procurement_Batch": null,
    "Import_Batch": null,
    "Acquisition_Cost": 0,
    "Last_Seen": null,
    "Battery_Percentage": null,
    "Storage_Used_Percentage": null,
    "WipedAt": null,
    "_id": "6a8ee742ce2c9c60c0348e1e",
    "Name": "Front Counter POS",
    "type": "POS Terminal",
    "isActive": true,
    "Devices_ModelNo": "Samsung Galaxy Tab Active4 Pro",
    "Total_Stocks": 10,
    "Serial_Number": "POS-SN-0001",
    "IMEI": "356789012345678",
    "Android_ID": "a1b2c3d4e5f67890",
    "Merchant_Assignment": "Restaurant Beef Cairo",
    "Enrollment_Token": "ENROLL-2026-0001",
    "Provisioning_Type": "Fully Managed",
    "Device_Ownership": "Company Owned",
    "Kiosk_Profile": "Restaurant POS Kiosk",
    "MDM_Policy_Assignment": "Standard POS Policy",
    "Enrollment_Mode": "Token",
    "Devices_company": null,
    "Devices_Operating_system": null,
    "timeZone": null,
    "Device_browser": null,
    "location": "Downtown Bistro",
    "IPAddress": null,
    "price": 0,
    "Status": true,
    "CreateBy": {
      "user_id": 1,
      "Name": "Admin",
      "email": "admin_pos@yopmail.com"
    },
    "CreateAt": "2026-08-26T13:16:50.537Z",
    "UpdatedAt": "2026-08-26T13:55:18.018Z",
    "MyDevices_id": 1,
    "Auto_Recovery_Mode": true,
    "Needs_Update": false,
    "UpdatedBy": {
      "user_id": 1,
      "Name": "Admin",
      "email": "admin_pos@yopmail.com"
    },
    "Uptime_Days": 0,
    "isLocked": true,
    "Last_Restart_Status": "Queued",
    "Scheduled_Restart": "2026-08-27T02:00:00.000Z",
    "App_Version": "v3.2.2"
  }
];

// --- Components ---

const StatusBadge = ({ status }) => {
  const isOnline = status === 'Online';
  return (
    <div className={`flex items-center gap-1.5 text-sm font-medium ${isOnline ? 'text-green-600' : 'text-red-500'}`}>
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
      {status}
    </div>
  );
};

const DeviceIcon = ({ type }) => {
  const commonClasses = "text-purple-600";
  switch (type) {
    case 'Tablet': return <Tablet className={commonClasses} size={20} />;
    case 'POS Terminal': return <Monitor className={commonClasses} size={20} />;
    case 'Printer': return <Printer className={commonClasses} size={20} />;
    default: return <Smartphone className={commonClasses} size={20} />;
  }
};

const ActionButton = ({ icon: Icon, label, onClick, color = "text-gray-500", hoverColor = "hover:text-gray-700" }) => (
  <button 
    onClick={onClick} 
    title={label}
    className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${color} ${hoverColor}`}
  >
    <Icon size={18} />
  </button>
);

const EnrollModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Enroll New Device</h2>
            <p className="text-xs text-gray-500">Lorem ipsum is simply dummy text of the printing and typesetting industry</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {/* Row 1 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Device Name</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Total Stocks</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 2 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Serial Number</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">IMEI</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 3 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Android ID</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Hardware Model</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Merchant Assignment</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Enrollment Token</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 5 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Provisioning Type</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Device Ownership</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 6 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Kiosk Profile</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">MDM Policy Assignment</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>

            {/* Row 7 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Location</label>
              <input type="text" placeholder="Enter" className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Enrollment Mode</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white">
                <option>Select one...</option>
                <option>Token</option>
                <option>Zero Touch</option>
                <option>Manual</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
             <h3 className="text-sm font-semibold text-gray-700">Status</h3>
             <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">Active</span>
                <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Cancel
          </button>
          <button className="px-6 py-2 bg-purple-600 rounded-lg text-sm font-medium text-white hover:bg-purple-700">
            Enroll
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Main Page Component ---

function MomPage() {
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All Devices');

  // Calculate stats
  const totalDevices = devices.length;
  const onlineDevices = devices.filter(d => d.isActive && d.Last_Seen).length; // Simplified logic for demo
  const offlineDevices = devices.filter(d => !d.isActive || !d.Last_Seen).length; // Simplified
  const needsUpdate = devices.filter(d => d.Needs_Update).length;

  // Filter Logic
  const filteredDevices = devices.filter(device => {
    if (activeFilter === 'All Devices') return true;
    if (activeFilter === 'Online') return device.isActive && device.Last_Seen;
    if (activeFilter === 'Offline') return !device.isActive || !device.Last_Seen;
    if (activeFilter === 'Active') return device.isActive;
    if (activeFilter === 'Idle') return !device.isActive; // Simplified mapping
    if (activeFilter === 'Sync Delay') return device.Needs_Update; 
    return true;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">MDM Device Management</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          Enroll New Device <Plus size={16} />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Total Devices</span>
            <Smartphone className="text-gray-400" size={18} />
          </div>
          <div className="text-2xl font-bold text-gray-800">{totalDevices}</div>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Online Devices</span>
            <Wifi className="text-green-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-green-600">{onlineDevices}</div>
          <div className="text-xs text-gray-400 mt-1">67% uptime</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Offline Devices</span>
            <WifiOff className="text-red-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-red-500">{offlineDevices}</div>
          <div className="text-xs text-gray-400 mt-1">Requires attention</div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm text-gray-500 font-medium">Needs Update</span>
            <Download className="text-orange-500" size={18} />
          </div>
          <div className="text-2xl font-bold text-orange-500">{needsUpdate}</div>
          <div className="text-xs text-gray-400 mt-1">Updates available</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {['All Devices', 'Online', 'Offline', 'Active', 'Idle', 'Sync Delay'].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-colors ${
                activeFilter === filter 
                  ? 'bg-purple-600 text-white border-purple-600' 
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Search devices..." 
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 hover:bg-gray-50">
            <Filter size={16} /> Filter
          </button>
        </div>
      </div>

      {/* Device Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs text-gray-500 uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Device Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">App Version</th>
                <th className="px-6 py-4">Last Seen</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredDevices.map((device) => {
                const isOnline = device.isActive && device.Last_Seen; // Simulated logic
                return (
                  <tr key={device._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <StatusBadge status={isOnline ? 'Online' : 'Offline'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-50 rounded-lg">
                          <DeviceIcon type={device.type} />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800">{device.Name}</div>
                          <div className="text-xs text-gray-500">{device.Devices_ModelNo || 'Unknown Model'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{device.location || 'N/A'}</div>
                      <div className="text-xs text-gray-400">New York, NY</div> {/* Mocked secondary location */}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{device.App_Version || 'v3.2.1'}</div>
                      <div className="text-xs text-gray-400">Android 12</div>
                      {device.Needs_Update && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] rounded-full font-medium">
                          Update Available
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-700">{formatDate(device.Last_Seen)}</div>
                      <div className="text-xs text-gray-400">{device.Last_Seen ? 'Recently' : 'Long ago'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <ActionButton icon={Lock} label="Lock" />
                        <ActionButton icon={RotateCcw} label="Restart" />
                        <ActionButton icon={Download} label="Update" />
                        <ActionButton icon={Trash2} label="Wipe" color="text-red-400" hoverColor="hover:text-red-600" />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredDevices.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No devices found matching the current filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Enrollment Modal */}
      <EnrollModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default withAdminLayout(MomPage);