import authSlice, { registerUser, loginUser, logoutUser } from './authSlice';

describe('authSlice reducer', () => {
  const initialState = {
    isAuthenticated: false,
    loading: false,
    error: null
  };

  describe('registerUser', () => {
    test('should set loading true on pending', () => {
      const action = { type: registerUser.pending.type };
      const newState = authSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set authenticated on fulfilled', () => {
      const action = { type: registerUser.fulfilled.type };
      const newState = authSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(true);
    });

    test('should set error on rejected', () => {
      const action = {
        type: registerUser.rejected.type,
        error: { message: 'Registration failed' }
      };
      const newState = authSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Registration failed');
    });

    test('should set default error on rejected without message', () => {
      const action = { type: registerUser.rejected.type, error: {} };
      const newState = authSlice.reducer(initialState, action);

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Ошибка регистрации');
    });
  });

  describe('loginUser', () => {
    test('should set loading true on pending', () => {
      const action = { type: loginUser.pending.type };
      const newState = authSlice.reducer(initialState, action);

      expect(newState.loading).toBe(true);
      expect(newState.error).toBeNull();
    });

    test('should set authenticated on fulfilled', () => {
      const action = { type: loginUser.fulfilled.type };
      const newState = authSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(true);
    });

    test('should set error on rejected', () => {
      const action = {
        type: loginUser.rejected.type,
        error: { message: 'Login failed' }
      };
      const newState = authSlice.reducer(
        { ...initialState, loading: true },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.error).toBe('Login failed');
    });
  });

  describe('logoutUser', () => {
    test('should set loading true on pending', () => {
      const action = { type: logoutUser.pending.type };
      const newState = authSlice.reducer(
        { ...initialState, isAuthenticated: true },
        action
      );

      expect(newState.loading).toBe(true);
    });

    test('should clear authenticated on fulfilled', () => {
      const action = { type: logoutUser.fulfilled.type };
      const newState = authSlice.reducer(
        { isAuthenticated: true, loading: true, error: null },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(false);
    });

    test('should clear authenticated on rejected', () => {
      const action = { type: logoutUser.rejected.type, error: {} };
      const newState = authSlice.reducer(
        { isAuthenticated: true, loading: true, error: null },
        action
      );

      expect(newState.loading).toBe(false);
      expect(newState.isAuthenticated).toBe(false);
    });
  });
});
