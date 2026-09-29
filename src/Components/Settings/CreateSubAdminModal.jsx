import React from 'react';

export default function CreateSubAdminModal({ onClose }) {
  return (
    <div className="fixed inset-0  bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-[505px] rounded-lg shadow-lg relative">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-black">
          <h1 className="text-[32px] font-bold font-poppins">Create Sub Admins</h1>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center">
            <span className="text-black text-2xl font-bold">&times;</span>
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Name */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Enter Name</label>
            <input
              type="text"
              className="w-full h-10 border border-black/20 rounded-md px-3"
              placeholder="Enter Name"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Email</label>
            <input
              type="email"
              className="w-full h-10 border border-black/20 rounded-md px-3"
              placeholder="Enter Email"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Password</label>
            <input
              type="password"
              className="w-full h-10 border border-black/20 rounded-md px-3"
              placeholder="Enter Password"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-medium">Password</label>
            <input
              type="password"
              className="w-full h-10 border border-black/20 rounded-md px-3"
              placeholder="Confirm Password"
            />
          </div>

          {/* Dropdown */}
          <div className="flex flex-col gap-2">
            <select className="w-full h-10 border border-black/20 rounded-md px-3">
              <option>Enter Permissions</option>
              <option>View Only</option>
              <option>Edit</option>
              <option>Admin</option>
            </select>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center px-6 pb-10">
          <button
            className="w-full max-w-[399px] py-3 text-white font-medium text-lg rounded-[12px] bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F]"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
