import { configureStore } from '@reduxjs/toolkit'
import useReducer from './slice/user.ts';
import loadingReducer from './slice/loading.ts';
import notificationReducer from './slice/notification.ts';

const store = configureStore({
  reducer: {
    user: useReducer,
    loading: loadingReducer,
    notification: notificationReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;