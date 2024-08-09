import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IAlert {
  type: string | undefined;
  message: string | undefined;
  showAfterRedirect: boolean;
}

const initialState: IAlert = {
  type: undefined,
  message: undefined,
  showAfterRedirect: false,
};

export const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    addAlert: (state, action: PayloadAction<IAlert>) => {
      state.type = action.payload.type;
      state.message = action.payload.message;
      state.showAfterRedirect = action.payload.showAfterRedirect;
    },
    clearAlert: (state) => {
      if (state?.showAfterRedirect) {
        state.showAfterRedirect = false;
      } else {
        state.type = undefined;
        state.message = undefined;
        state.showAfterRedirect = false;
      }
    },
  },
});

export const { addAlert, clearAlert } = alertSlice.actions;

export default alertSlice.reducer;
