import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  TRegisterData,
  TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { setCookie, getCookie } from '../../utils/cookie';

interface AuthState {
  isAuthenticated: boolean;
  user: TUser | null;
  loading: boolean;
  error: string | null;
}

const getInitialAuthState = (): AuthState => {
  const accessToken = getCookie('accessToken');
  if (accessToken) {
    return {
      isAuthenticated: true,
      user: null,
      loading: false,
      error: null
    };
  }
  return {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
  };
};

const initialState: AuthState = getInitialAuthState();

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (data: TRegisterData) => {
    const result = await registerUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data: TLoginData) => {
    const result = await loginUserApi(data);
    setCookie('accessToken', result.accessToken);
    localStorage.setItem('refreshToken', result.refreshToken);
    return result.user;
  }
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await logoutApi();
  setCookie('accessToken', '', { expires: -1 });
  localStorage.removeItem('refreshToken');
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: { payload: TUser }) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка регистрации';
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
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
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
  selectors: {
    getIsAuthenticated: (state) => state.isAuthenticated,
    getUser: (state) => state.user,
    getAuthLoading: (state) => state.loading,
    getAuthError: (state) => state.error
  }
});

export const { setUser } = authSlice.actions;

export const { getIsAuthenticated, getUser, getAuthLoading, getAuthError } =
  authSlice.selectors;

export default authSlice;
