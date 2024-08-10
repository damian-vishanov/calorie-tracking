"use client";

import Link from "next/link";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import AddIcon from "@mui/icons-material/Add";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import BarChartIcon from "@mui/icons-material/BarChart";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";

import { useUserService } from "../_services";

const drawerWidth: number = 240;

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

interface SidebarProps {
  isSidebarOpen: boolean;
  toggleSidebar: Function;
}

export default function Sidebar({
  isSidebarOpen,
  toggleSidebar,
}: SidebarProps) {
  const userService = useUserService();
  const [foodMenuOpen, setFoodMenuOpen] = useState(true);
  const [adminMenuOpen, setAdminMenuOpen] = useState(true);

  const handleFoodMenuClick = () => {
    setFoodMenuOpen(!foodMenuOpen);
  };

  const handleAdminMenuClick = () => {
    setAdminMenuOpen(!adminMenuOpen);
  };

  return (
    <Drawer variant="permanent" open={isSidebarOpen}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          px: [1],
        }}
      >
        <IconButton onClick={() => toggleSidebar()}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List component="nav">
        <ListItemButton onClick={handleFoodMenuClick}>
          <ListItemIcon>
            <FastfoodIcon />
          </ListItemIcon>
          <ListItemText primary="Food" />
          {foodMenuOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={foodMenuOpen} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <Link href="/" passHref>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <FormatListBulletedIcon />
                </ListItemIcon>
                <ListItemText primary="Food items" />
              </ListItemButton>
            </Link>
          </List>
          <List component="div" disablePadding>
            <Link href="/food/add" passHref>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <AddIcon />
                </ListItemIcon>
                <ListItemText primary="Add food" />
              </ListItemButton>
            </Link>
          </List>
        </Collapse>
      </List>
      {!!userService.currentUser?.id &&
        userService.currentUser.role === "Admin" && (
          <List component="nav">
            <ListItemButton onClick={handleAdminMenuClick}>
              <ListItemIcon>
                <AdminPanelSettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Admin" />
              {adminMenuOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={adminMenuOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <Link href="/admin/food" passHref>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ManageSearchIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users food items" />
                  </ListItemButton>
                </Link>
              </List>
              <List component="div" disablePadding>
                <Link href="/admin/food/add" passHref>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <AddIcon />
                    </ListItemIcon>
                    <ListItemText primary="Add user food" />
                  </ListItemButton>
                </Link>
              </List>
              <List component="div" disablePadding>
                <Link href="/admin/reports" passHref>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <BarChartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Reports" />
                  </ListItemButton>
                </Link>
              </List>
              <List component="div" disablePadding>
                <Link href="/admin/users-management" passHref>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users management" />
                  </ListItemButton>
                </Link>
              </List>
            </Collapse>
          </List>
        )}
    </Drawer>
  );
}
