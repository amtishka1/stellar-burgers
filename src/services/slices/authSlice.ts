import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { setCookie, getCookie } from '../../utils/cookie';
import { setUser, clearUser } from './userSlice';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const getInitialAuthState = (): AuthState => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    return {
      isAuthenticated: true,
      loading: false,
      error: null
    };
  }
  return {
    isAuthenticated: false,
    loading: false,
    error: null
  };
};

const initialState: AuthState = getInitialAuthState();

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData, { dispatch }) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    dispatch(setUser(result.user));
    return result.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData, { dispatch }) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    dispatch(setUser(result.user));
    return result.user;
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { dispatch }) => {
    await logoutApi();
    setCookie('accessToken', '', { expires: -1 });
    localStorage.removeItem('refreshToken');
    dispatch(clearUser());
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка авторизации';
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
  selectors: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getAuthLoading: (state) => state.loading,
    getAuthError: (state) => state.error
  }
});

export const { getIsAuthenticated, getAuthLoading, getAuthError } =
  authSlice.selectors;

export default authSlice;
