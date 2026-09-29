import React, { useState } from 'react';

// This is the main component that handles all four modal states.
// It takes one prop, `onClose`, which is a function to close the modal.
const PasswordResetModal = ({ onClose }) => {
  // 'step' state determines which view to show: 'forgot', 'emailConfirmation', 'otp', or 'reset'
  const [step, setStep] = useState('forgot');
  // State to store the user's email
  const [email, setEmail] = useState('ADMIN123@gmail.com'); // Pre-filled for demonstration

  // --- Handlers to change the step ---

  // Moves from 'forgot' to the new 'emailConfirmation' step
  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call your API to send an OTP here.
    console.log('Requesting OTP for:', email);
    setStep('emailConfirmation'); // Go to confirmation screen
  };

  // Moves from 'otp' to 'reset' step
  const handleOtpSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would verify the OTP via an API call here.
    console.log('Verifying OTP...');
    setStep('reset');
  };
  
  // Final step, would submit the new password to an API
  const handleResetPasswordSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would call an API to update the password.
    console.log('Resetting password...');
    alert('Password has been reset successfully!');
    onClose(); // Close the modal after success
  };


  // --- Render Functions for Each Step ---

  const renderForgotPassword = () => (
    <form onSubmit={handleForgotPasswordSubmit} className="w-full flex flex-col items-center">
        <h3 className="text-3xl font-bold font-poppins text-gray-900">Forgot Password</h3>
        <p className="text-base text-gray-500 mt-2 font-poppins text-center">
          We will send you instructions to reset in your registered email
        </p>

        <div className="mt-10 w-full">
          <label htmlFor="email" className="text-left font-medium font-poppins text-lg text-gray-800">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your Email here......"
            className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
            required
          />
        </div>

        <div className="w-full mt-8">
          <button type="submit" className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg">
            Reset Password
          </button>
        </div>
    </form>
  );

  // --- NEW RENDER FUNCTION FOR THE EMAIL CONFIRMATION STEP ---
  const renderEmailConfirmation = () => (
    <div className="w-full flex flex-col items-center text-center">
        <h3 className="text-3xl font-bold font-poppins text-gray-900">Forget Password</h3>
        <p className="text-base text-gray-500 mt-2 font-poppins">
          An Authentication code has sent to your email
        </p>
        <p className="text-lg font-bold text-gray-900 mt-2 font-poppins">
            {email}
        </p>

        <div className="w-full mt-12">
            <button 
                type="button" 
                onClick={() => setStep('otp')} 
                className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg"
            >
                Verify OTP
            </button>
        </div>
        <div className="w-full mt-4">
            <button 
                type="button" 
                onClick={() => setStep('forgot')} 
                className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg"
            >
                Back
            </button>
        </div>
    </div>
  );

  const renderVerifyOtp = () => (
     <form onSubmit={handleOtpSubmit} className="w-full flex flex-col items-center">
        <h3 className="text-3xl font-bold font-poppins text-gray-900">Verify OTP</h3>
        <p className="text-base text-gray-500 mt-2 font-poppins text-center">
          Please Enter the Authentication received to your registered email
        </p>
        
        <div className="mt-10 w-full">
           <label htmlFor="otp" className="text-left font-medium font-poppins text-lg text-gray-800">Enter OTP</label>
           <input
            id="otp"
            type="text"
            placeholder="Enter the 6-digit code"
            maxLength="6"
            className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins tracking-widest text-center"
            required
          />
        </div>

        <div className="w-full mt-8">
          <button type="submit" className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg">
            Verify
          </button>
        </div>

        <div className="w-full mt-4">
            {/* This back button now goes to the new confirmation screen */}
            <button type="button" onClick={() => setStep('emailConfirmation')} className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg">
            Back
            </button>
        </div>
    </form>
  );

  const renderCreateNewPassword = () => (
    <form onSubmit={handleResetPasswordSubmit} className="w-full flex flex-col ">
      <h3 className="text-3xl font-bold font-poppins text-gray-900">Create New Password</h3>
      <p className="text-base text-gray-500 mt-2 font-poppins text-center">
        Your new password must be different from previous ones.
      </p>

      <div className="mt-10 w-full">
        {/* <label htmlFor="new-password" className="text-start font-medium font-poppins text-lg text-gray-800">New Password</label> */}
        <input
          id="new-password"
          type="password"
          placeholder="Enter new password"
          className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
          required
        />
      </div>

       <div className="mt-6 w-full">
        {/* <label htmlFor="confirm-password" className=" font-medium font-poppins text-lg text-gray-800">Confirm Password</label> */}
        <input
          id="confirm-password"
          type="password"
          placeholder="Confirm new password"
          className="mt-2 w-full px-4 py-3 bg-gray-100 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-poppins"
          required
        />
      </div>

      <div className="w-full mt-8">
        <button type="submit" className="w-full bg-gradient-to-b from-purple-700 to-red-600 text-white font-medium py-3 rounded-lg hover:from-purple-800 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 font-poppins text-lg">
          Reset Password
        </button>
      </div>

      <div className="w-full mt-4">
        <button type="button" onClick={() => setStep('otp')} className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg">
          Back
        </button>
      </div>
    </form>
  );
  

  return (
    // Main modal container with a semi-transparent background
    <div className="fixed inset-0 bg-opacity-50 h-full w-full flex items-center justify-center font-poppins p-4">
      {/* The white modal box */}
      <div className="relative p-8  w-full max-w-md shadow-lg rounded-2xl bg-white">
        <div className="mt-3 text-center">
          <div className="mx-auto flex flex-col items-center justify-center">
             {/* Conditionally render the correct step */}
             {step === 'forgot' && renderForgotPassword()}
             {step === 'emailConfirmation' && renderEmailConfirmation()}
             {step === 'otp' && renderVerifyOtp()}
             {step === 'reset' && renderCreateNewPassword()}

            {/* The general "Back" button to close the modal, shown only on the first step */}
            {step === 'forgot' && (
                <div className="w-full mt-4">
                    <button onClick={onClose} className="w-full border border-gray-300 text-gray-800 font-medium py-3 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 font-poppins text-lg">
                        Back
                    </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetModal;