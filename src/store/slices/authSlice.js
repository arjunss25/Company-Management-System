import { createSlice } from '@reduxjs/toolkit';
import TokenService from '../../Config/tokenService';

const initialState = {
  isAuthenticated: !!TokenService.getToken(),
  userRole: TokenService.getUserRole(),
  userName: TokenService.getUserName(),
  permissions: TokenService.getUserPermissions() || [],
  userId: TokenService.getUserId(),
  companyId: TokenService.getCompanyId(),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { role, permissions, id, company_id, name } = action.payload;
      state.isAuthenticated = true;
      state.userRole = role;
      state.userName = name;
      state.permissions = permissions;
      state.userId = id;
      state.companyId = company_id;
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.isAuthenticated = false;
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.userName = null;
      state.permissions = [];
      state.userId = null;
      state.companyId = null;
      state.loading = false;
      state.error = null;
      TokenService.clearTokens();
    },
    updatePermissions: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  updatePermissions,
} = authSlice.actions;

export const selectAuth = (state) => state?.auth || initialState;
export const selectIsAuthenticated = (state) =>
  state?.auth?.isAuthenticated || false;
export const selectUserRole = (state) => state?.auth?.userRole || null;
export const selectUserName = (state) => state?.auth?.userName || 'User';
export const selectPermissions = (state) => state?.auth?.permissions || [];

export default authSlice.reducer;
