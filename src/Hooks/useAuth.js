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

      setIsAuthenticated(!!token);
      setUserRole(storedUserRole);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = (accessToken, refreshToken, role, userId, companyId) => {
    TokenService.setToken(accessToken);
    TokenService.setRefreshToken(refreshToken);
    TokenService.setUserRole(role);
    if (userId) TokenService.setUserId(userId);
    if (companyId) TokenService.setCompanyId(companyId);

    setIsAuthenticated(true);
    setUserRole(role);
  };

  const logout = () => {
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
