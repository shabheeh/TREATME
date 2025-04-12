import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import { IAdmin } from "../../../types/admin/admin.types";
import { IPatient, IDependent } from "../../../types/patient/patient.types";
import { IDoctor } from "../../../types/doctor/doctor.types";

const initialUserState = {
  patient: null as IPatient | null,
  doctor: null as IDoctor | null,
  admin: null as IAdmin | null,
  currentUser: null as IPatient | IDependent | null,
  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

const userSlice = createSlice({
  name: "user",
  initialState: initialUserState,
  reducers: {
    setPatient: (state, action: PayloadAction<IPatient>) => {
      state.patient = action.payload;
      state.currentUser = action.payload;
    },

    setDoctor: (state, action: PayloadAction<IDoctor>) => {
      state.doctor = action.payload;
    },

    setAdmin: (state, action: PayloadAction<IAdmin>) => {
      state.admin = action.payload;
    },

    setCurrentPatient: (
      state,
      action: PayloadAction<IPatient | IDependent>
    ) => {
      state.currentUser = action.payload;
    },

    clearUser: () => initialUserState,
  },
});

const userPersistConfig = {
  key: "user",
  storage,
  whitelist: ["patient", "doctor", "admin", "currentUser"],
};

export const persistedUserReducer = persistReducer(
  userPersistConfig,
  userSlice.reducer
);
export const { setPatient, setDoctor, setAdmin, clearUser, setCurrentPatient } =
  userSlice.actions;
