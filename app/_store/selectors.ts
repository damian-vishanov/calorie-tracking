import { RootState } from "./store";

export const selectCurrentUser = (store: RootState) => store.user;
export const selectAlert = (store: RootState) => store.alert;
