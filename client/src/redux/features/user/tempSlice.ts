import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {IUser } from "../../../types/user/userAuth.types";

type InitialStateType = { tempUser: Partial<IUser> | null; }

const initialState: InitialStateType = {
    tempUser: null,
}

interface SignInActionPayload {
    tempUser: Partial<IUser>
}


const authSlice = createSlice({
    name: 'tempUser',
    initialState,
    reducers: {
        setTempUser: (state, action: PayloadAction<SignInActionPayload>) => {
            state.tempUser = action.payload.tempUser
        }
    }
})


export const { setTempUser } = authSlice.actions
export default authSlice.reducer