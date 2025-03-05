import { useState, useEffect } from 'react';
import TokenService from '../Config/tokenService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = TokenService.getToken();
      const storedUserRole = TokenService.getUserRole();

      console.log('useAuth - Checking authentication:', {
        hasToken: !!token,
        userRole: storedUserRole,
        isAuthenticated: !!token,
      });

      setIsAuthenticated(!!token);
      setUserRole(storedUserRole);
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
      setUserRole(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (accessToken, refreshToken, role, userId, companyId) => {
    console.log('useAuth - Login attempt:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      role,
      userId,
      companyId,
    });

    try {
      TokenService.setToken(accessToken);
      TokenService.setRefreshToken(refreshToken);
      TokenService.setUserRole(role);
      if (userId) TokenService.setUserId(userId);
      if (companyId) TokenService.setCompanyId(companyId);

      setIsAuthenticated(true);
      setUserRole(role);

      console.log('useAuth - Login successful:', {
        isAuthenticated: true,
        userRole: role,
      });
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    console.log('useAuth - Logging out');
    TokenService.clearTokens();
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return {
    isAuthenticated,
    userRole,
    loading,
    login,
    logout,
    checkAuth,
  };
};

export default useAuth;
