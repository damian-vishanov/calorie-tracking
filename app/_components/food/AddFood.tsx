"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import {
  useAlertService,
  useFoodService,
  useUserService,
} from "@/app/_services";
import dayjs, { Dayjs } from "dayjs";

import {
  Grid,
  Paper,
  Button,
  Box,
  TextField,
  Typography,
  CircularProgress,
  Switch, // Import MUI Switch
  FormControlLabel, // Import FormControlLabel for labeling the switch
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Define the form data type
type FormData = {
  date: Dayjs | null;
  time: Dayjs | null;
  name: string;
  calorieValue: string;
  cheating: boolean; // Add a new boolean field for Cheat Day
};

export function AddFood() {
  const router = useRouter();
  const alertService = useAlertService();
  const foodService = useFoodService();
  const userService = useUserService();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      date: null,
      time: null,
      name: "",
      calorieValue: "",
      cheating: false,
    },
  });

  async function onSubmit(data: FormData) {
    alertService.clear();
    try {
      const dateTime = dayjs(
        `${data.date?.format("YYYY-MM-DD")} ${data.time?.format("HH:mm")}`
      ).toDate();

      if (dateTime > new Date()) {
        alertService.error("Date and time cannot be set in the future");
        return;
      }

      const formattedData = {
        id: null,
        name: data.name,
        calorieValue: data.calorieValue,
        takenAt: dateTime,
        userId: userService.currentUser?.id,
        cheating: data.cheating,
      };

      await foodService.create(formattedData);

      router.push("/");
      alertService.success("Food added", true);
    } catch (error: any) {
      alertService.error(error);
    }
  }

  return (
    <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            Add New Food
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3, mt: 3 }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: "Date is required" }}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Select Date"
                      format="DD/MM/YYYY"
                      value={field.value}
                      disableFuture
                      onChange={(newValue) => field.onChange(newValue)}
                      slotProps={{
                        textField: {
                          error: !!errors.date,
                          helperText: errors.date ? errors.date.message : "",
                          fullWidth: true,
                        },
                      }}
                    />
                  )}
                />
                <Box sx={{ mb: 3, mt: 3 }}>
                  <Controller
                    name="time"
                    control={control}
                    rules={{ required: "Time is required" }}
                    render={({ field }) => (
                      <TimePicker
                        {...field}
                        label="Select Time"
                        value={field.value}
                        ampm={false}
                        disableFuture
                        onChange={(newValue) => field.onChange(newValue)}
                        slotProps={{
                          textField: {
                            error: !!errors.time,
                            helperText: errors.time ? errors.time.message : "",
                            fullWidth: true,
                          },
                        }}
                      />
                    )}
                  />
                </Box>
              </LocalizationProvider>
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("name", { required: "Product name is required" })}
                label="Product Name"
                variant="outlined"
                fullWidth
                error={!!errors.name}
                helperText={errors.name ? errors.name.message : ""}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("calorieValue", {
                  required: "Calorie value is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Calorie value must be a number",
                  },
                })}
                label="Calorie Value"
                variant="outlined"
                fullWidth
                error={!!errors.calorieValue}
                helperText={
                  errors.calorieValue ? errors.calorieValue.message : ""
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Controller
                name="cheating"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)}
                        color="primary"
                      />
                    }
                    label="Cheating"
                  />
                )}
              />
              {errors.cheating && (
                <Typography color="error" variant="body2">
                  {errors.cheating.message}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button component={Link} href="/" variant="text" color="inherit">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? <CircularProgress size={24} /> : "Save"}
              </Button>
            </Box>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
