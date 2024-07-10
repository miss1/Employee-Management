import { createSlice } from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    tokenHistory: false,
  },
  reducers: {
    updateTokenHistory: (state) => {
      state.tokenHistory = !state.tokenHistory;
    },
  },
});

export const { updateTokenHistory } = notificationSlice.actions;

export default notificationSlice.reducer;