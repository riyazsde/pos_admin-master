import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-5">
            <div className="text-center max-w-md w-full">
                <h1 className="text-[120px] font-extrabold text-blue-500 leading-none m-0">
                    404
                </h1>
                <h2 className="text-3xl font-semibold text-gray-800 mt-4 mb-2">
                    Page Not Found
                </h2>
                <p className="text-gray-500 text-base mb-8">
                    Sorry, the page you are looking for doesn't exist or has been moved.
                </p>
                <div className="flex gap-3 justify-center flex-wrap">
                    <button
                        onClick={() => navigate('/Dashboard')}
                        className="px-6 py-3 rounded-lg text-sm font-semibold bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 cursor-pointer border-none"
                    >
                        Go to Dashboard
                    </button>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-6 py-3 rounded-lg text-sm font-semibold bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFound;