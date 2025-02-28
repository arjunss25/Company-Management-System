import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import axiosInstance from '../../Config/axiosInstance';
import TokenService from '../../Config/tokenService';
import { LuEye } from 'react-icons/lu';
import usePermissions from '../../Hooks/userPermission';
import { PERMISSIONS } from '../../Hooks/userPermission';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { hasPermission } = usePermissions();
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    TokenService.clearTokens();

    try {
      const response = await axiosInstance.post('/user-login/', {
        email: formData.email,
        password: formData.password,
        company_name: formData.company,
      });

      if (!response.data?.data?.access_token) {
        throw new Error('No access token received from server');
      }

      const userData = response.data.data;

      // Use the login function from useAuth hook
      login(
        userData.access_token,
        userData.refresh_token,
        userData.role,
        userData.id,
        userData.company_id
      );

      // Redirect based on role and permissions
      const userRole = userData.role?.toLowerCase();

      if (userRole === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else if (['admin', 'staff', 'sales'].includes(userRole)) {
        // Check if user has dashboard access permission
        if (hasPermission(PERMISSIONS.VIEW_DASHBOARD)) {
          navigate('/admin/dashboard');
        } else {
          navigate('/unauthorized');
        }
      } else {
        navigate('/unauthorized');
      }
    } catch (error) {
      console.error('Login failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="main-card w-[80vw] h-[70vh] flex rounded-[1.5rem] overflow-hidden shadow-md">
        {/* img-sec */}
        <div className="image-section w-[48vw] bg-[#000991] h-full">
          <img className="w-full" src="/login-img.svg" alt="" />
        </div>

        {/* form-sec */}
        <div className="bg-white p-8 shadow-lg w-[32vw] flex flex-col items-center justify-center ">
          <h1 className="text-[2rem] font-bold mb-6 text-center">Login</h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="company"
              >
                Company
              </label>
              <input
                className="appearance-none border border-[#DFDFDF] rounded w-full py-2 px-3 text-gray-700 rounded-[0.5rem] leading-tight focus:outline-none focus:shadow-outline"
                id="company"
                type="text"
                placeholder="Company Name"
                value={formData.company}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="appearance-none border border-[#DFDFDF] rounded w-full py-2 px-3 text-gray-700 rounded-[0.5rem] leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="User Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="password-main flex relative">
                <input
                  className="appearance-none border border-[#DFDFDF] rounded w-full py-2 px-3 text-gray-700 rounded-[0.5rem] leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder=""
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="icon absolute right-[10px] top-[30%]">
                  <LuEye />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <button
                className="w-full flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-[0.5rem] active:scale-95 transition-all duration-300"
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
