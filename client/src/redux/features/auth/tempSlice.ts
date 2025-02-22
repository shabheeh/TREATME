import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPatient } from "../../../types/patient/patient.types";

type InitialStateType = { tempUser: Partial<IPatient> | null };

const initialState: InitialStateType = {
  tempUser: null,
};

interface SignInActionPayload {
  tempUser: Partial<IPatient>;
}

const authSlice = createSlice({
  name: "tempUser",
  initialState,
  reducers: {
    setTempUser: (state, action: PayloadAction<SignInActionPayload>) => {
      state.tempUser = action.payload.tempUser;
    },
  },
});

export const { setTempUser } = authSlice.actions;
export default authSlice.reducer;
