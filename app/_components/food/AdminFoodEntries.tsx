"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Paper,
  Link,
} from "@mui/material";

import { useFoodService, useUserService } from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";
import dayjs from "dayjs";

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { DateRange } from "@/app/_components/food/DateRange";
import { useEffect, useState } from "react";

export default function AdminFoodEntries() {
  const foodService = useFoodService();
  const userService = useUserService();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const foodItems = foodService.foods;

  useEffect(() => {
    if (userService.currentUser?.id) {
      foodService.getAll(
        dayjs(new Date()).format("ddd, D MMM YYYY"),
        dayjs(new Date()).add(1, "day").format("ddd, D MMM YYYY")
      );
    }
  }, [userService.currentUser]);

  useEffect(() => {
    setIsLoading(false);
  }, [foodService]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} lg={8}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 678,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Food items
          </Typography>

          {foodItems && foodItems.length > 0 && (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>User</TableCell>
                  <TableCell>Date taken</TableCell>
                  <TableCell>Product Name</TableCell>
                  <TableCell>Calorie value</TableCell>
                  <TableCell>Cheating</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {foodItems.map((row) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          {isLoading && <Spinner />}
          {!isLoading && foodItems?.length === 0 && (
            <div>No food to display</div>
          )}
        </Paper>
      </Grid>

      <Grid item xs={12} md={6} lg={4}>
        <Grid container spacing={3}>
          <DateRange
            foodService={foodService}
            userService={userService}
            setIsLoading={setIsLoading}
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
                {foodItems
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
                <Link color="primary">Change limit</Link>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
