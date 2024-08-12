"use client";

import { Controller, UseFormReturn } from "react-hook-form";
import { Button, Grid, Paper, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TFormData, IFoodEntriesForm } from "./commonTypes";

type Props = {
  foodEntriesForm: IFoodEntriesForm;
};

export function DateRange({ foodEntriesForm }: Props) {
  const { formMethods, loadData, onSubmit, handleReset } = foodEntriesForm;
  const { control, handleSubmit, setValue } = formMethods;

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
                value={field.value || null}
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
                value={field.value || null}
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
        <Button sx={{ mb: 2 }} variant="outlined" onClick={handleReset}>
          Reset dates
        </Button>
      </Paper>
    </Grid>
  );
}
