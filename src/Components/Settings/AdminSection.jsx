import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {  Briefcase, Users, FileText, LifeBuoy, CreditCard, Pencil, ChevronRight } from 'lucide-react';
function AdminSection() {

const SettingsRow = ({ label, hasChevron = false }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 last:border-b-0">
    <p className="text-gray-800 font-medium">{label}</p>
    <button className="focus:outline-none">
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
  <div className="max-w-2xl">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-5" style={{
                background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
              }}>
                <h2 className="text-white text-lg font-semibold">Sub Administrators</h2>
              </div>
              <div className="px-6 py-4">
                <div className="mb-4">
                  <button 
                    onClick={() => navigate('/admin/add-admin')}
                    className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-opacity" 
                    style={{
                      background: 'linear-gradient(180deg, #6A1B9A 0%, #D32F2F 100%)'
                    }}
                  >
                    Add New Admin
                  </button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/admin/admin-details/1')}>
                    <p className="font-medium">John Doe</p>
                    <p className="text-gray-600">john@triaxx.com</p>
                    <p className="text-sm text-gray-500">Role: Manager</p>
                  </div>
                  <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                       onClick={() => navigate('/admin/admin-details/2')}>
                    <p className="font-medium">Jane Smith</p>
                    <p className="text-gray-600">jane@triaxx.com</p>
                    <p className="text-sm text-gray-500">Role: Editor</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
  )
}

export default AdminSection