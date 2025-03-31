import React from 'react';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    // First try to go back to previous page
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, redirect to dashboard
      navigate('/admin/dashboard');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold text-center mb-4">
          Unauthorized Access
        </h1>
        <p className="text-gray-600 text-center mb-2">
          You don't have permission to perform this action.
        </p>
        <p className="text-gray-600 text-center mb-6">
          Please contact your administrator if you believe this is a mistake.
        </p>
        <button
          onClick={handleGoBack}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
