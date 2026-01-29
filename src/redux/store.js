import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    // You can add more reducers here as your app grows
    // files: fileReducer,
  },
  // Middleware is automatically configured by Toolkit
});

export default store;

