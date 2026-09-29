import React from 'react';
import withAdminLayout from '../../Views/AdminPanel/withAdminLayout';

const CreateClientForm = () => {
  return (
    <div className="min-h-screen w-full   bg-white poppins-text">

                  <h2 className="text-3xl font-bold text-[#2E2A40] m-6">Create Clients</h2>


      <div className="w-full max-w-7xl p-8 rounded-2xl bg-gradient-to-b from-[#6A1B9A1A] to-[#D32F2F1A] shadow-md">
        {/* Heading */}
        <div className="mb-10">
          <h2 className="text-3xl font-bold text-[#2E2A40]">Onboarding Client</h2>
          <p className="text-sm text-black/60 mt-2">Create new client by filling all the mandatory details</p>
        </div>

        {/* Form */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Business Name */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Business Name</label>
            <input
              type="text"
              placeholder="Type Business name"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>

          {/* Business Logo */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Business Logo</label>
            <button
              type="button"
              className="w-full px-5 py-3 flex items-center justify-center gap-2 text-white bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] rounded"
            >
              Choose File
              <span className="material-icons">upload_file</span>
            </button>
          </div>

          {/* Email */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email for Login"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Create Password</label>
            <input
              type="password"
              placeholder="Create Password"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm Password"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Preferred Language</label>
            <input
              type="text"
              placeholder="Type Language"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>

          {/* Preferred Currency */}
          <div>
            <label className="block text-lg font-medium text-[#2E2A40] mb-2">Preferred Currency</label>
            <input
              type="text"
              placeholder="Type Currency"
              className="w-full px-5 py-3 border border-black/50 rounded text-base text-black/60"
            />
          </div>
        </form>

        {/* Save Button */}
        <div className="flex justify-center mt-12">
          <button
            type="submit"
            className="w-full md:w-[400px] py-4 bg-gradient-to-b from-[#6A1B9A] to-[#D32F2F] text-white text-lg font-medium rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};



export default withAdminLayout(CreateClientForm);
