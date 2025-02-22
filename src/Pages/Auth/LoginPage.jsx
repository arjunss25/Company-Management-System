import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth.jsx';
import axiosInstance from '../../Config/axiosInstance';
import TokenService from '../../Config/tokenService';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    company: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', {
      email: formData.email,
      hasPassword: !!formData.password
    });

    try {
      console.log('Making login request');
      const response = await axiosInstance.post('/user-login/', {
        email: formData.email,
        password: formData.password,
      });

      console.log('Full API Response:', {
        status: response.status,
        data: response.data
      });

      // Check if we have the required data
      if (!response.data?.data?.access_token) {
        throw new Error('No access token received from server');
      }

      const userData = response.data.data;

      // Store tokens using the correct response structure
      TokenService.setToken(userData.access_token);
      TokenService.setRefreshToken(userData.refresh_token);
      TokenService.setUserRole(userData.role);
      TokenService.setUserId(userData.id);
      TokenService.setCompanyId(userData.company_id);

      console.log('Tokens stored, checking localStorage:', {
        hasAccessToken: !!TokenService.getToken(),
        hasRefreshToken: !!TokenService.getRefreshToken(),
        userRole: TokenService.getUserRole(),
        userId: TokenService.getUserId(),
        companyId: TokenService.getCompanyId()
      });

      // Redirect based on role
      const userRole = TokenService.getUserRole();
      if (userRole?.toLowerCase() === 'superadmin') {
        navigate('/superadmin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      // Add user feedback for error
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="company"
            >
              Company
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="company"
              type="text"
              placeholder="Company"
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
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
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
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
