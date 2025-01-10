import { configureStore } from "@reduxjs/toolkit";
import authReducerUser from "../features/user/authSlice";
import tempReducer from "../features/user/tempSlice";


export const store = configureStore({
    reducer: {
        authUser: authReducerUser,
        tempUser: tempReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;