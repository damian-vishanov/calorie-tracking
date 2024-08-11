"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import dayjs from "dayjs";
import { useFoodEntriesForm } from "./useFoodEntriesForm";
import { useFoodService, useUserService } from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";
import { DateRange } from "@/app/_components/food/DateRange";
import ReachedDays from "@/app/_components/food/ReachedDays";

export function FoodEntries() {
  const foodService = useFoodService();
  const userService = useUserService();
  const foodEntriesForm = useFoodEntriesForm({ userService, foodService });
  const { isLoading, foodItems, setPage, setRowsPerPage, page, rowsPerPage } = foodEntriesForm;

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
                    <TableCell>Date taken</TableCell>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Calorie value</TableCell>
                    <TableCell>Cheating</TableCell>
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
                            <ErrorOutlineIcon /> Yes
                          </Box>
                        ) : (
                          <Box display="flex" alignItems="center">
                            <CheckCircleOutlineIcon /> No
                          </Box>
                        )}
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

      <Grid item xs={12} md={6} lg={4}>
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
                {foodItems?.totalItems > 0 &&
                  foodItems?.items
                    .map((el) => !el.cheating && parseInt(el.calorieValue))
                    .reduce((acc, el) => acc + el, 0)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 210,
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
              <Typography color="text.secondary" sx={{ flex: 1 }}>
                Updated on 15 March, 2019
              </Typography>
              <div>
                <Link href="/path/to/change/limit" color="primary">
                  Change limit
                </Link>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
