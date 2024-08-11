import React, { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Paper,
  Box,
} from "@mui/material";

import {
  useUserService,
  useFoodService,
  useReportService,
} from "@/app/_services";
import dayjs from "dayjs";

const data = [
  { day: "Day 1", currentWeek: 5, previousWeek: 3 },
  { day: "Day 2", currentWeek: 6, previousWeek: 5 },
  { day: "Day 3", currentWeek: 8, previousWeek: 2 },
  { day: "Day 4", currentWeek: 10, previousWeek: 8 },
  { day: "Day 5", currentWeek: 7, previousWeek: 6 },
  { day: "Day 6", currentWeek: 9, previousWeek: 7 },
  { day: "Day 7", currentWeek: 4, previousWeek: 2 },
];

export default function AdminReports() {
  // const userService = useUserService();
  const reportService = useReportService();
  const usersCalories = reportService.usersCalories;

  useEffect(() => {
    reportService.getUsersCalories(
      dayjs().add(-6, "day").format("ddd, D MMM YYYY"),
      dayjs().add(1, "day").format("ddd, D MMM YYYY")
    );

    reportService.getFoodItemsCount();
  }, []);

  return (
    <Grid container spacing={3}>
      <Grid item xs={7}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 500,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Number of added entries
          </Typography>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={reportService.foodItemsCount}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="currentWeek"
                stroke="#8884d8"
                name="This Week"
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="previousWeek"
                stroke="#82ca9d"
                name="Last Week"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
      <Grid item xs={5}>
        <Paper
          sx={{
            p: 2,
            display: "flex",
            flexDirection: "column",
            height: 400,
          }}
        >
          <Typography component="h2" variant="h6" color="primary" gutterBottom>
            Average calories for last 7 days
          </Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Avеrage calories</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersCalories.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{parseInt(row.averageCalories)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Grid>
    </Grid>
  );
}
