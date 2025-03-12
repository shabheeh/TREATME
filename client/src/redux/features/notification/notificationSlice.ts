import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationCountState {
  unreadCount: number;
}

const initialState: NotificationCountState = {
  unreadCount: 0,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = action.payload;
    },
    incrementUnreadCount: (state) => {
      state.unreadCount += 1;
    },
  },
});

export const { setUnreadCount, incrementUnreadCount } =
  notificationSlice.actions;

export default notificationSlice.reducer;
