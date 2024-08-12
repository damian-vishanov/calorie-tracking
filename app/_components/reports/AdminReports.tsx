"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
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
  TablePagination,
  Typography,
  Grid,
  Paper,
} from "@mui/material";

import { useReportService } from "@/app/_services";

export default function AdminReports() {
  const reportService = useReportService();
  const usersCalories = reportService.usersCalories;

  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(5);

  useEffect(() => {
    reportService.getUsersCalories(
      dayjs().add(-6, "day").format("ddd, D MMM YYYY"),
      dayjs().add(1, "day").format("ddd, D MMM YYYY"),
      page + 1,
      rowsPerPage
    );

    reportService.getFoodItemsCount();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} lg={6}>
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
              <YAxis
                tickFormatter={(tick) => (Number.isInteger(tick) ? tick : "")}
              />
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
      <Grid item xs={12} lg={6}>
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
          {usersCalories?.totalCount > 0 && (
            <>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Avеrage calories</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usersCalories?.users.map((row) => (
                    <TableRow key={row._id}>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{Math.round(row.averageCalories)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <TablePagination
                component="div"
                count={usersCalories?.totalCount}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[5]}
              />
            </>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}
