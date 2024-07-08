import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    show: false,
  },
  reducers: {
    updateLoading: (state, action: PayloadAction<boolean>) => {
      state.show = action.payload;
    },
  },
});

export const { updateLoading } = loadingSlice.actions;

export default loadingSlice.reducer;