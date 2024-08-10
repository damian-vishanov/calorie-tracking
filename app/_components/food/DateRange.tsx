"use client";

import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { IFoodService, IUserService, useAlertService } from "@/app/_services";
import { usePathname } from "next/navigation";

type Props = {
  foodService: IFoodService;
  userService: IUserService;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

type FormData = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
};

export function DateRange({ foodService, userService, setIsLoading }: Props) {
  const pathname = usePathname();
  const alertService = useAlertService();
  const { control, handleSubmit, setValue } = useForm<FormData>();

  const loadData = async (dateFrom?: Dayjs, dayTo?: Dayjs) => {
    if (pathname === "/admin/food-items") {
      await foodService.getAll(
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null
      );
    } else {
      await foodService.getByUserId(
        userService.currentUser.id,
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null
      );
    }
  };

  const onSubmit = async (data: FormData) => {
    alertService.clear();
    if (!data.dateFrom || !data.dateTo) {
      alertService.error("Please select start and end dates");
      return;
    }

    if (data.dateFrom > data.dateTo) {
      alertService.error("Start date must be earlier than end date");
      return;
    }

    setIsLoading(true);

    await loadData(data.dateFrom, data.dateTo);
  };

  const handleResetDates = async () => {
    await loadData();
    setValue("dateFrom", null);
    setValue("dateTo", null);
  };

  return (
    <Grid item xs={12}>
      <Paper
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          minHeight: 300,
        }}
      >
        <Typography
          component="h2"
          variant="h6"
          color="primary"
          gutterBottom
          mb={4}
        >
          Date range
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="dateFrom"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="From"
                format="DD/MM/YYYY"
                value={field.value}
                disableFuture
                onChange={field.onChange}
                sx={{ mb: 2 }}
              />
            )}
          />
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="To"
                format="DD/MM/YYYY"
                value={field.value}
                disableFuture
                onChange={field.onChange}
                sx={{ mb: 4 }}
              />
            )}
          />
        </LocalizationProvider>
        <Button
          sx={{ mb: 2 }}
          variant="contained"
          onClick={handleSubmit(onSubmit)}
        >
          Apply
        </Button>
        <Button sx={{ mb: 2 }} variant="outlined" onClick={handleResetDates}>
          Reset dates
        </Button>
      </Paper>
    </Grid>
  );
}
