"use client";

import { useState } from "react";
import Link from "next/link";

import dayjs from "dayjs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Grid,
  Paper,
  Box,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { useFoodEntriesForm } from "./useFoodEntriesForm";
import { useFoodService, useUserService } from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";
import { DateRange, ReachedDays } from "./";

export function FoodEntries() {
  const foodService = useFoodService();
  const userService = useUserService();
  const foodEntriesForm = useFoodEntriesForm({ userService, foodService });
  const {
    isLoading,
    loadData,
    foodItems,
    setPage,
    setRowsPerPage,
    page,
    rowsPerPage,
  } = foodEntriesForm;
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      loadData();
    }
    setOpenDialog(false);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            minHeight: 760,
          }}
        >
          <Typography
            component="h2"
            variant="h6"
            color="primary"
            gutterBottom
            mb={3}
          >
            Food items
          </Typography>

          {foodItems?.totalItems > 0 && (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
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
                      <TableCell>
                        {dayjs(row.takenAt).format("DD MMM, YYYY - HH:mm")}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.calorieValue}</TableCell>
                      <TableCell>
                        {row.cheating ? (
                          <Box display="flex" alignItems="center">
                            <ErrorOutlineIcon sx={{ mr: 1 }} /> Yes
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <CheckCircleOutlineIcon sx={{ mr: 1 }} /> No
                          </Box>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex" }}>
                          <Link href={`/food/edit/${row.id}`}>
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
                rowsPerPageOptions={[10]}
              />
            </>
          )}
          {isLoading && <Spinner />}
          {!isLoading && foodItems?.totalItems === 0 && (
            <Typography>No food to display</Typography>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} lg={4}>
        <Grid container spacing={3}>
          <DateRange foodEntriesForm={foodEntriesForm} />
          <ReachedDays
            foodService={foodService}
            userService={userService}
            foodEntriesForm={foodEntriesForm}
          />
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 130,
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Taken calories
              </Typography>
              <Typography component="p" variant="h4">
                {foodItems?.takenCalories}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 130,
              }}
            >
              <Typography
                component="h2"
                variant="h6"
                color="primary"
                gutterBottom
              >
                Calorie daily limit
              </Typography>
              <Typography component="p" variant="h4">
                {userService.currentUser?.caloriesLimit}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
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
