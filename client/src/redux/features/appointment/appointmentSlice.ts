import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage';

import IAppointment from "../../../types/appointment/appointment.types";

const initialState = {
    appointmentData: null as Partial<IAppointment> | null,
    step: 0 as number,
}


const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        
        updateAppointment: (state, action: PayloadAction<Partial<IAppointment>>) => {
            state.appointmentData = { ...state.appointmentData, ...action.payload };
        },

        updateStep: (state, action) => {
            state.step = action.payload
        },

        resetAppointment: () => initialState,

    },
});

const appointmentPersistConfig = {
    key: 'appointment',
    storage,
    whitelist: ['appointmentData', 'step']
};

export const persistAppointmentReducer = persistReducer(appointmentPersistConfig, appointmentSlice.reducer)
export const {
    updateAppointment,
    updateStep,
    resetAppointment,
} = appointmentSlice.actions