// src/redux/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pseudo: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.pseudo = action.payload.pseudo;
    },
    logout: (state) => {
      state.pseudo = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
