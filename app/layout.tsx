import type { Metadata } from "next";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import CssBaseline from "@mui/material/CssBaseline";

import "./globals.css";
import { StoreProvider, MuiProvider } from "./_components/providers";

export const metadata: Metadata = {
  title: "Calories Tracking",
  description: "Simple Calories App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>
            <MuiProvider>
              <CssBaseline />
              {children}
            </MuiProvider>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
