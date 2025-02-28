import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../Config/axiosInstance';
import TokenService from '../../Config/tokenService';
import { LuEye } from 'react-icons/lu';
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from '../../store/slices/authSlice';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
    dispatch(loginStart());

    try {
      const response = await axiosInstance.post('/user-login/', {
        email: formData.email,
        password: formData.password,
        company_name: formData.company,
      });

      console.log('Login response:', response.data);

      if (response.data.status === 'Success') {
        const userData = response.data.data;

        // Store tokens
        TokenService.setToken(userData.access_token);
        TokenService.setRefreshToken(userData.refresh_token);

        // Add view_dashboard permission to the permissions array
        const permissions = [...(userData.permissions || []), 'view_dashboard'];

        // Get user display name
        let displayName = 'User';
        if (userData.name) {
          displayName = userData.name;
        } else if (userData.email) {
          const emailParts = userData.email.split('@');
          displayName = emailParts[0];
        }

        // Store user data including the added permission
        TokenService.setUserRole(userData.role);
        TokenService.setUserId(userData.id);
        TokenService.setCompanyId(userData.company_id);
        TokenService.setUserPermissions(permissions);
        TokenService.setUserName(displayName);

        // Dispatch success with user data
        dispatch(
          loginSuccess({
            role: userData.role,
            permissions,
            id: userData.id,
            company_id: userData.company_id,
            name: displayName,
          })
        );

        // Navigate based on role
        const userRole = userData.role?.toLowerCase();
        if (userRole === 'superadmin') {
          navigate('/superadmin/dashboard');
        } else if (userRole === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/unauthorized');
        }
      } else {
        dispatch(loginFailure(response.data.message || 'Invalid credentials'));
        setError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage =
        err.response?.data?.message || 'An error occurred during login';
      dispatch(loginFailure(errorMessage));
      setError(errorMessage);
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
