// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice'; // 👈 assure-toi que ce fichier existe

const store = configureStore({
  reducer: {
    user: userReducer,
  },
});

export default store;
