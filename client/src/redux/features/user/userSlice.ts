import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { IAdmin } from "../../../types/admin/admin.types";
import { IPatient } from "../../../types/patient/patient.types";
import { IDoctor } from "../../../types/doctor/doctor.types";

const initialUserState = {
    patient: null as IPatient | null,
    doctor: null as IDoctor | null,
    admin: null as IAdmin | null,
  };
  
  const userSlice = createSlice({
    name: 'user',
    initialState: initialUserState,
    reducers: {
      setPatient: (state, action: PayloadAction<IPatient>) => {
        state.patient = action.payload;
      },
      setDoctor: (state, action: PayloadAction<IDoctor>) => {
        state.doctor = action.payload;
      },
      setAdmin: (state, action: PayloadAction<IAdmin>) => {
        state.admin = action.payload;
      },
      clearUser: () => initialUserState,
    },
  });
  
  const userPersistConfig = {
    key: 'user',
    storage,
    whitelist: ['patient', 'doctor', 'admin'],
  };
  
  export const persistedUserReducer = persistReducer(userPersistConfig, userSlice.reducer);
  export const { setPatient, setDoctor, setAdmin, clearUser } = userSlice.actions;
  