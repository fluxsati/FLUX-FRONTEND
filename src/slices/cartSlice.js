import { createSlice } from '@reduxjs/toolkit';

// Helper to handle rounding to 2 decimal places
const addDecimals = (num) => (Math.round(num * 100) / 100).toFixed(2);

const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'UPI', itemsPrice: 0, taxPrice: 0, totalPrice: 0 };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }

      // Calculate Prices (18% GST Logic)
      state.itemsPrice = addDecimals(
        state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
      );
      state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2))); 
      state.totalPrice = (
        Number(state.itemsPrice) + Number(state.taxPrice)
      ).toFixed(2);

      localStorage.setItem('cart', JSON.stringify(state));
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      
      // Recalculate after removal
      state.itemsPrice = addDecimals(state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0));
      state.taxPrice = addDecimals(Number((0.18 * state.itemsPrice).toFixed(2)));
      state.totalPrice = (Number(state.itemsPrice) + Number(state.taxPrice)).toFixed(2);
      
      localStorage.setItem('cart', JSON.stringify(state));
    },
    // Renamed to clearCart to match Dashboard.jsx and reset prices
    clearCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;
      localStorage.setItem('cart', JSON.stringify(state));
    }
  },
});

// Export clearCart so Dashboard.jsx can find it
export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
