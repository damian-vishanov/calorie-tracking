"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  TablePagination,
} from "@mui/material";

import { useUserService } from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";
import dayjs from "dayjs";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useUsersForm } from "./useUsersForm";

export default function Users() {
  const userService = useUserService();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const usersForm = useUsersForm({
    userService,
  });

  const {
    isLoading,
    loadData,
    users,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
  } = usersForm;

  const handleDeleteClick = (foodId: string) => {
    setSelectedUserId(foodId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUserId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId) {
      await userService.delete(selectedUserId);
      loadData(); // Refresh the table after deletion
    }
    setOpenDialog(false);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 720,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Users
          </Typography>

          {users?.totalItems > 0 && (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Calories limit</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.role}</TableCell>
                      <TableCell>{row.caloriesLimit}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Link href={`/admin/users-management/edit/${row.id}`}>
                            <Tooltip title="Edit">
                              <IconButton color="secondary" aria-label="edit">
                                <EditIcon />
                              </IconButton>
                            </Tooltip>
                          </Link>
                          <Tooltip title="Delete">
                            <IconButton
                              color="error"
                              aria-label="delete"
                              onClick={() => handleDeleteClick(row.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={users.totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5]}
              />
            </>
          )}
          {isLoading && <Spinner />}
          {!isLoading && users?.totalItems === 0 && (
            <div>No food to display</div>
          )}
        </Paper>
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete this item?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this item cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
