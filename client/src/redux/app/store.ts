import { configureStore } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import { persistedAuthReducer } from '../features/auth/authSlice';
import { persistedUserReducer } from '../features/user/userSlice';
import { persistAppointmentReducer } from '../features/appointment/appointmentSlice';
import tempReducer from '../features/auth/tempSlice'


export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    user: persistedUserReducer,
    tempUser: tempReducer,
    appointment: persistAppointmentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;