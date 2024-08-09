import { redirect } from "next/navigation";

import { auth } from "../_helpers/server";
import { Alert } from "../_components/Alert";

import { Container, CssBaseline } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  if (auth.isAuthenticated()) {
    redirect("/");
  }

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <CssBaseline />
        {children}
        <Alert />
      </Container>
    </>
  );
}
