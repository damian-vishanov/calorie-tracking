import { redirect } from "next/navigation";
import { Container, CssBaseline } from "@mui/material";
import { auth } from "../_helpers/server";
import { Alert } from "../_components/Alert";

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
