import { createSlice } from "@reduxjs/toolkit";

export interface IUser {
  id: string | undefined;
  email: string | undefined;
  role: string | undefined;
  caloriesLimit: number | undefined;
}

const initialState: IUser = {
  id: undefined,
  email: undefined,
  role: undefined,
  caloriesLimit: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCurrentUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.caloriesLimit = action.payload.caloriesLimit;
    },
  },
});

export const { setCurrentUser } = userSlice.actions;

export default userSlice.reducer;
