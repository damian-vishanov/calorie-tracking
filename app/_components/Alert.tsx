"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { useAlertService } from "../_services";

import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

export function Alert() {
  const pathname = usePathname();
  const alertService = useAlertService();
  const alert = alertService.alert;
  const [open, setOpen] = useState<boolean>(false);

  const severity: AlertProps["severity"] =
    alert?.type === "success" ? "success" : "error";

  useEffect(() => {
    alertService.clear();
  }, [pathname]);

  useEffect(() => {
    setOpen(!!alert?.message);
  }, [alert]);

  const handleClose = () => {
    alertService.clear();
  };

  return (
    !!alert?.message && (
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MuiAlert severity={severity}>{alert?.message}</MuiAlert>
      </Snackbar>
    )
  );
}
