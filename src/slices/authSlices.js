import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // Safe parsing of localStorage to prevent crashes on corrupt data
  userInfo: (() => {
    try {
      const saved = localStorage.getItem('userInfo');
      // Ensure we don't return "undefined" strings
      return saved && saved !== "undefined" ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),
  isLoading: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      // 1. Reset Redux State immediately
      state.userInfo = null;
      
      // 2. Wipe LocalStorage 
      localStorage.removeItem('userInfo');
      
      // Optional: Clear everything if you want to wipe all user settings/theme
      // localStorage.clear(); 
      
      // IMPORTANT: We do NOT use window.location here. 
      // This allows React Router to animate the transition smoothly.
    },
    updateUserInfo: (state, action) => {
      if (state.userInfo) {
        state.userInfo = { ...state.userInfo, ...action.payload };
        localStorage.setItem('userInfo', JSON.stringify(state.userInfo));
      }
    }
  },
});

export const { setCredentials, logout, updateUserInfo } = authSlice.actions;
export default authSlice.reducer;
