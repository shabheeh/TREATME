import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authState, IUser } from "../../../types/user/authTypes";

const initialState: authState = {
    isAuthenticated: false,
    user: null,
    isSignUp: false
}

interface SignInActionPayload {
    isAuthenticated: boolean;
    user: IUser;
}


const authSlice = createSlice({
    name: 'Auth',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<SignInActionPayload>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user
        },

        signUp: (state, action: PayloadAction<{ isSignUp: boolean }>) => {
            state.isSignUp = action.payload.isSignUp
        }
    }
})


export const { signIn } = authSlice.actions
export default authSlice.reducer