"use client";

import { Roboto } from "next/font/google";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const theme = createTheme({
  palette: {
    mode: "dark",
    success: {
      main: "#4caf50",
      contrastText: "#ffffff",
      light: "#81c784",
      dark: "#388e3c",
    },
    error: {
      main: "#f44336",
      contrastText: "#ffffff",
      light: "#e57373",
      dark: "#d32f2f",
    },
  },
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
});

export function MuiProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
