import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import deleteIcon from '../../assets/Images/Home/delete.png';

// Modal Component
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, description }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Content Container */}
        <div className="flex flex-col items-center space-y-6">
          {/* Header Section */}
          <div className="flex flex-col items-center space-y-4 w-full">
            {/* Warning Icon */}
           <img src={deleteIcon}/>
             
            {/* Title and Description */}
            <div className="flex flex-col items-center space-y-2 w-full">
              <h1 className="text-xl font-bold text-black text-center leading-tight font-sans">
                {title || "Are you Sure ?"}
              </h1>
              <h2 className="text-xl font-bold text-black text-center leading-tight font-sans">
                This is an irreversible Process
              </h2>
              <p className="text-sm text-gray-600 text-center leading-tight font-sans mt-2">
                {description || "You can see you employees roles and responsibilities, you can delete you employees as well"}
              </p>
            </div>
          </div>
          
          {/* Buttons Section */}
          <div className="flex flex-col items-center space-y-3 w-full">
            {/* Delete Button */}
            <button
              onClick={onConfirm}
              className="w-full h-12 bg-gradient-to-r from-purple-600 to-red-600 text-white text-base font-medium rounded-xl hover:from-purple-700 hover:to-red-700 transition-all duration-200 font-sans"
            >
              Yes Delete
            </button>
           
            {/* Cancel Button */}
            <button
              onClick={onClose}
              className="w-full h-12 bg-transparent border-2  text-base font-medium rounded-xl border-gradient"
            >
              No Don't
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default ConfirmationModal