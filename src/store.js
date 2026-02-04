import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlices';
import cartReducer from './slices/cartSlice'; // Import it here

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer, // Add it to the brain
  },
  devTools: true,
});

export default store;
