"use client";

import { Dispatch, SetStateAction } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { IFoodService, IUserService } from "@/app/_services";

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
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      dateFrom: dayjs(),
      dateTo: dayjs(),
    },
  });

  const onSubmit = async (data: FormData) => {
    // if (userService.currentUser?.id && data.dateFrom && data.dateTo) {
    const dateFrom = dayjs(data.dateFrom).format("ddd, D MMM YYYY");
    setIsLoading(true);
    await foodService.getByUserId(
      userService.currentUser.id,
      dayjs(data.dateFrom).format("ddd, D MMM YYYY"),
      dayjs(data.dateTo).add(1, "day").format("ddd, D MMM YYYY")
    );
  };
  // };

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
                onChange={field.onChange}
                sx={{ mb: 4 }}
              />
            )}
          />
        </LocalizationProvider>
        {/* <LocalizationProvider
          dateAdapter={AdapterDayjs}
          adapterLocale={"en-gb"}
        >
          <Controller
            name="dateTo"
            control={control}
            render={({ field }) => (
              <DatePicker
                label="To"
                value={field.value}
                onChange={field.onChange}
                sx={{ mb: 4 }}
              />
            )}
          />
        </LocalizationProvider> */}
        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Apply
        </Button>
      </Paper>
    </Grid>
  );
}
