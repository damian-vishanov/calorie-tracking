"use client";

import { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import { IconButton, Typography, Toolbar, Box, Tooltip } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";

import { useUserService } from "../_services/useUserService";

const drawerWidth: number = 260;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: Function;
}

export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  const userService = useUserService();
  const [loggingOut, setLoggingOut] = useState<boolean>(false);

  async function logout() {
    setLoggingOut(true);
    await userService.logout();
  }

  useEffect(() => {
    userService.getCurrent();
  }, []);

  return (
    <AppBar position="absolute" open={isSidebarOpen}>
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pr: "24px",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={() => toggleSidebar()}
            sx={{
              marginRight: "36px",
              ...(isSidebarOpen && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <LocalFireDepartmentIcon fontSize="large" sx={{ mr: 1 }} />
          <Typography
            component="h1"
            variant="h6"
            color="inherit"
            noWrap
            sx={{ flexGrow: 1 }}
          >
            Calorie Tracking
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {userService.currentUser?.email}
          <Tooltip title="Log out">
            <IconButton
              disabled={loggingOut}
              color="inherit"
              onClick={logout}
              sx={{ ml: 3 }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
