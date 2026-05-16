import userSlice, {
  fetchUser,
  updateUser,
  setUser,
  clearUser
} from './userSlice';

describe('userSlice reducer', () => {
  const initialState = {
    data: null,
    loading: false,
    error: null
  };

  const mockUser = {
    email: 'test@test.com',
    name: 'Test User'
  };

  describe('setUser', () => {
    test('should set user data', () => {
      const action = setUser(mockUser);
      const newState = userSlice.reducer(initialState, action);

      expect(newState.data).toEqual(mockUser);
    });
  });

  describe('clearUser', () => {
    test('should clear user data', () => {
      const stateWithUser = { ...initialState, data: mockUser };
      const action = clearUser();
      const newState = userSlice.reducer(stateWithUser, action);

      expect(newState.data).toBeNull();
    });
  });

  describe('fetchUser', () => {
    test('should set loading true on pending', () => {
      const action = { type: fetchUser.pending.type };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set user data on fulfilled', () => {
      const action = {
        type: fetchUser.fulfilled.type,
        payload: mockUser
      };
      const newState = userSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.data).toEqual(mockUser);
    });

    test('should set error on rejected', () => {
      const action = {
        type: fetchUser.rejected.type,
        error: { message: 'Network Error' }
      };
      const newState = userSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Network Error');
    });
  });

  describe('updateUser', () => {
    test('should set loading true on pending', () => {
      const action = { type: updateUser.pending.type };
      const newState = userSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should update user data on fulfilled', () => {
      const updatedUser = { email: 'new@test.com', name: 'New Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };
      const newState = userSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.data).toEqual(updatedUser);
    });

    test('should set error on rejected', () => {
      const action = {
        type: updateUser.rejected.type,
        error: { message: 'Update failed' }
      };
      const newState = userSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Update failed');
    });
  });
});
