import axiosInstance from './axiosInstance';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const USER_ID_KEY = 'userId';
const COMPANY_ID_KEY = 'companyId';

const TokenService = {
  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Getting token from localStorage:', {
      exists: !!token,
      token: token?.substring(0, 20) + '...' // Only log first 20 chars for security
    });
    return token;
  },

  getRefreshToken: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    console.log('Getting refresh token from localStorage:', {
      exists: !!refreshToken,
      token: refreshToken?.substring(0, 20) + '...'
    });
    return refreshToken;
  },

  getUserRole: () => {
    const role = localStorage.getItem(USER_ROLE_KEY);
    console.log('Getting user role from localStorage:', { role });
    return role;
  },

  getUserId: () => {
    const userId = localStorage.getItem(USER_ID_KEY);
    console.log('Getting user ID from localStorage:', { userId });
    return userId;
  },

  getCompanyId: () => {
    const companyId = localStorage.getItem(COMPANY_ID_KEY);
    console.log('Getting company ID from localStorage:', { companyId });
    return companyId;
  },

  setToken: (token) => {
    console.log('Setting token in localStorage:', {
      exists: !!token,
      token: token?.substring(0, 20) + '...'
    });
    localStorage.setItem(TOKEN_KEY, token);
  },

  setRefreshToken: (refreshToken) => {
    console.log('Setting refresh token in localStorage:', {
      exists: !!refreshToken,
      token: refreshToken?.substring(0, 20) + '...'
    });
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUserRole: (role) => {
    console.log('Setting user role in localStorage:', { role });
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  setUserId: (userId) => {
    console.log('Setting user ID in localStorage:', { userId });
    localStorage.setItem(USER_ID_KEY, userId);
  },

  setCompanyId: (companyId) => {
    console.log('Setting company ID in localStorage:', { companyId });
    localStorage.setItem(COMPANY_ID_KEY, companyId);
  },

  clearTokens: () => {
    console.log('Clearing all tokens from localStorage');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
    
    // Log localStorage state after clearing
    console.log('localStorage state after clearing:', {
      token: localStorage.getItem(TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      userRole: localStorage.getItem(USER_ROLE_KEY),
      userId: localStorage.getItem(USER_ID_KEY),
      companyId: localStorage.getItem(COMPANY_ID_KEY)
    });
  },

  refreshToken: async () => {
    console.log('Starting token refresh');
    const refreshToken = TokenService.getRefreshToken();
    console.log('Current refresh token exists:', !!refreshToken);

    try {
      console.log('Making refresh token request');
      const response = await axiosInstance.post('/token-refresh/', {
        refresh: refreshToken,
      });

      console.log('Refresh response:', {
        success: !!response.data,
        hasAccessToken: !!response.data?.access,
      });

      if (response.data.access) {
        TokenService.setToken(response.data.access);
        return response.data;
      } else {
        console.error('No access token in refresh response');
        throw new Error('No access token received');
      }
    } catch (error) {
      console.error('Token refresh error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      TokenService.clearTokens();
      throw error;
    }
  },
};

export default TokenService;
