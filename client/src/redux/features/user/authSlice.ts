import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authState, IUser } from "../../../types/user/authTypes";

const initialState: authState = {
    isAuthenticated: false,
    user: null
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
        }
    }
})


export const { signIn } = authSlice.actions
export default authSlice.reducer