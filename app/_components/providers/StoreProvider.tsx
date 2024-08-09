"use client";

import { Provider } from "react-redux";
import store from "@/app/_store/store";

export function StoreProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <Provider store={store}>{children}</Provider>;
}
