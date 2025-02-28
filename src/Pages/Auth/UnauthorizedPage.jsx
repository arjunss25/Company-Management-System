import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import TokenService from '../../Config/tokenService';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { userRole } = useAuth();

  const handleGoBack = () => {
    const token = TokenService.getToken();
    if (!token) {
      navigate('/login');
      return;
    }

    const role = TokenService.getUserRole()?.toLowerCase();
    if (role === 'superadmin') {
      navigate('/superadmin/dashboard');
    } else if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">401</h1>
        <h2 className="text-2xl font-semibold mb-4">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <button
          onClick={handleGoBack}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
