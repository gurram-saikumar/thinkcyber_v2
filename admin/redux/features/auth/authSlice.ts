import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  user: string | null;
  refreshToken?: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userRegistration: (state, action: PayloadAction<{ token: string }>) => {
      state.token = action.payload.token;
    },
    userLoggedIn: (
      state: any,
      action: PayloadAction<{
        accessToken: string;
        user: string;
        refreshToken: string;
      }>
    ) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
    },
    userLoggedOut: (state) => {
      state.token = null;
      state.user = null;
    },
  },
});

export const { userRegistration, userLoggedIn, userLoggedOut } =
  authSlice.actions;

export default authSlice.reducer;
