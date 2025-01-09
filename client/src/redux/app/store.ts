import { configureStore } from "@reduxjs/toolkit";
import authReducerUser from "../features/user/authSlice"


export const store = configureStore({
    reducer: {
        authUser: authReducerUser
    }
})

export type RootState = ReturnType<typeof store.getState>;


export type AppDispatch = typeof store.dispatch;