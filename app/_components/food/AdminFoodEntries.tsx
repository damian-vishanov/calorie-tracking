"use client";

import Link from "next/link";
import React, { useState } from "react";
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

import {
  useFoodService,
  useUserService,
  useAlertService,
} from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";
import dayjs from "dayjs";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { DateRange } from "@/app/_components/food/DateRange";
import { useFoodEntriesForm } from "./useFoodEntriesForm";

export default function AdminFoodEntries() {
  const foodService = useFoodService();
  const userService = useUserService();
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const foodEntriesForm = useFoodEntriesForm({ userService, foodService, isAdminForm: true });
  const { isLoading, loadData, foodItems, setPage, setRowsPerPage, page, rowsPerPage } = foodEntriesForm;

  const handleDeleteClick = (foodId: string) => {
    setSelectedFoodId(foodId);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFoodId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedFoodId) {
      await foodService.delete(selectedFoodId);
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
      <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 720,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Food items
          </Typography>

          {foodItems?.totalItems > 0 && (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Date taken</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Calorie value</TableCell>
                    <TableCell>Cheating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {foodItems.items.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.user?.email}</TableCell>
                      <TableCell>
                        {dayjs(row.takenAt).format("DD MMM, YYYY - HH:mm")}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.calorieValue}</TableCell>
                      <TableCell>
                        {row.cheating ? (
                          <>
                            <ErrorOutlineIcon /> yes
                          </>
                        ) : (
                          <>
                            <CheckCircleOutlineIcon /> no
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Link href={`/admin/food/edit/${row.id}`}>
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
                count={foodItems.totalItems}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5]}
              />
            </>
          )}
          {isLoading && <Spinner />}
          {!isLoading && foodItems?.totalItems === 0 && (
            <div>No food to display</div>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={3}>
          <DateRange foodEntriesForm={foodEntriesForm} />
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
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
