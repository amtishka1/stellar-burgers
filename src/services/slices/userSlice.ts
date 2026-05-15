import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getUserApi, updateUserApi, TRegisterData } from '@api';
import { TUser } from '@utils-types';

interface UserState {
  data: TUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: null,
  loading: false,
  error: null
};

export const fetchUser = createAsyncThunk('user/fetchUser', async () => {
  const userResponse = await getUserApi();
  return userResponse.user;
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (data: Partial<TRegisterData>) => {
    const userResponse = await updateUserApi(data);
    return userResponse.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка загрузки пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка обновления пользователя';
      });
  },
  selectors: {
    getUserData: (state) => state.data,
    getUserLoading: (state) => state.loading,
    getUserError: (state) => state.error
  }
});

export const { setUser, clearUser } = userSlice.actions;

export const { getUserData, getUserLoading, getUserError } =
  userSlice.selectors;

export default userSlice;
