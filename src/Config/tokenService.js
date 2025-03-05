import axiosInstance from './axiosInstance';

const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_ROLE_KEY = 'userRole';
const USER_ID_KEY = 'userId';
const COMPANY_ID_KEY = 'companyId';
const USER_PERMISSIONS_KEY = 'userPermissions';
const USER_NAME_KEY = 'userName';

const TokenService = {
  getToken: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('TokenService - Getting token:', {
      exists: !!token,
      token: token ? token.substring(0, 20) + '...' : null,
      localStorageKeys: Object.keys(localStorage),
    });
    return token;
  },

  getRefreshToken: () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    console.log('Getting refresh token from localStorage:', {
      exists: !!refreshToken,
      token: refreshToken?.substring(0, 20) + '...',
    });
    return refreshToken;
  },

  getUserRole: () => {
    const role = localStorage.getItem(USER_ROLE_KEY);
    console.log('Getting user role from localStorage:', { role });
    return role;
  },

  getUserName: () => {
    const name = localStorage.getItem(USER_NAME_KEY);
    console.log('Getting user name from localStorage:', { name });
    return name;
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

  getUserPermissions: () => {
    const permissions = localStorage.getItem(USER_PERMISSIONS_KEY);
    console.log('Getting user permissions from localStorage:', {
      permissions: permissions ? JSON.parse(permissions) : [],
    });
    return permissions ? JSON.parse(permissions) : [];
  },

  setToken: (token) => {
    console.log('TokenService - Setting token:', {
      exists: !!token,
      token: token ? token.substring(0, 20) + '...' : null,
    });
    localStorage.setItem(TOKEN_KEY, token);

    // Verify token was set
    const storedToken = localStorage.getItem(TOKEN_KEY);
    console.log('TokenService - Token verification:', {
      wasSet: !!storedToken,
      matches: storedToken === token,
    });
  },

  setRefreshToken: (refreshToken) => {
    console.log('Setting refresh token in localStorage:', {
      exists: !!refreshToken,
      token: refreshToken?.substring(0, 20) + '...',
    });
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  },

  setUserRole: (role) => {
    console.log('Setting user role in localStorage:', { role });
    localStorage.setItem(USER_ROLE_KEY, role);
  },

  setUserName: (name) => {
    console.log('Setting user name in localStorage:', { name });
    localStorage.setItem(USER_NAME_KEY, name);
  },

  setUserId: (userId) => {
    console.log('Setting user ID in localStorage:', { userId });
    localStorage.setItem(USER_ID_KEY, userId);
  },

  setCompanyId: (companyId) => {
    console.log('Setting company ID in localStorage:', { companyId });
    localStorage.setItem(COMPANY_ID_KEY, companyId);
  },

  setUserPermissions: (permissions) => {
    console.log('Setting user permissions in localStorage:', { permissions });
    localStorage.setItem(USER_PERMISSIONS_KEY, JSON.stringify(permissions));
  },

  clearTokens: () => {
    console.log('Clearing all tokens from localStorage');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(COMPANY_ID_KEY);
    localStorage.removeItem(USER_PERMISSIONS_KEY);
    localStorage.removeItem(USER_NAME_KEY);

    // Log localStorage state after clearing
    console.log('localStorage state after clearing:', {
      token: localStorage.getItem(TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
      userRole: localStorage.getItem(USER_ROLE_KEY),
      userId: localStorage.getItem(USER_ID_KEY),
      companyId: localStorage.getItem(COMPANY_ID_KEY),
      permissions: localStorage.getItem(USER_PERMISSIONS_KEY),
      userName: localStorage.getItem(USER_NAME_KEY),
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
