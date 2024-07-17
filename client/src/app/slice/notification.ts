import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    tokenHistory: false,
    visaStatus: ''
  },
  reducers: {
    updateTokenHistory: (state) => {
      state.tokenHistory = !state.tokenHistory;
    },
    updateVisaStatus: (state, action: PayloadAction<string>) => {
      state.visaStatus = action.payload;
    }
  },
});

export const { updateTokenHistory, updateVisaStatus } = notificationSlice.actions;

export default notificationSlice.reducer;