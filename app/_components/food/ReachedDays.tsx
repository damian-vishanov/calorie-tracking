"use client";

import { useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";

import { Grid, Typography, Paper } from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { IFoodService, IUserService } from "@/app/_services";
import { IFoodEntriesForm } from "./commonTypes";

type Props = {
  foodService: IFoodService;
  userService: IUserService;
  foodEntriesForm: IFoodEntriesForm;
};

export default function ReachedDays({
  foodService,
  userService,
  foodEntriesForm,
}: Props) {
  const { formMethods, onSubmit } = foodEntriesForm;
  const { setValue, handleSubmit } = formMethods;
  const isDayHighlighted = (day: Dayjs) => {
    if (foodService.daysReachedLimit?.length) {
      return foodService.daysReachedLimit.some((highlightedDay) =>
        day.isSame(dayjs(highlightedDay), "day")
      );
    }
  };

  useEffect(() => {
    if (userService.currentUser?.id) {
      const currentUser = userService.currentUser;
      foodService.getUserReachedLimitDays(
        currentUser?.id,
        currentUser?.caloriesLimit
      );
    }
  }, [userService.currentUser]);

  return (
    <Grid item xs={12}>
      <Paper
        sx={{ display: "flex", flexDirection: "column", p: 2, height: 380 }}
      >
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Days reached the limit
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={null}
            views={["day"]}
            sx={{ width: "100%" }}
            disableFuture
            onChange={(newValue) => {
              setValue("dateFrom", newValue);
              setValue("dateTo", newValue);
              handleSubmit(onSubmit)();
            }}
            slotProps={{
              day: (day) => {
                const isSelected = isDayHighlighted(day.day);
                return {
                  sx: {
                    bgcolor: isSelected ? "warning.main" : "transparent",
                    color: isSelected ? "white" : "inherit",
                    borderRadius: "50%",
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                    transition:
                      "transform 0.3s ease, background-color 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.2)",
                      bgcolor: isSelected ? "secondary.dark" : "grey.300",
                    },
                  },
                  children: (
                    <Typography
                      sx={{
                        bgcolor: isSelected ? "warning.main" : "transparent",
                        color: isSelected ? "white" : "inherit",
                        borderRadius: "50%",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {day.day.format("D")}
                    </Typography>
                  ),
                };
              },
            }}
          />
        </LocalizationProvider>
      </Paper>
    </Grid>
  );
}
