"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import {
  IFoodItem,
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
  Switch,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useEffect, useState } from "react";

import { Spinner } from "../Spinner";

type Props = {
  isAdmin: Boolean;
  foodToEdit?: IFoodItem;
};

type FormData = {
  userId: string;
  date: Dayjs | null;
  time: Dayjs | null;
  name: string;
  calorieValue: string;
  cheating: boolean;
};

export function AddEditFood({ isAdmin, foodToEdit }: Props) {
  const router = useRouter();
  const alertService = useAlertService();
  const foodService = useFoodService();
  const userService = useUserService();
  const [loading, setLoading] = useState(true);
  const users = userService.users;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      date: null,
      time: null,
      name: "",
      calorieValue: "",
      cheating: false,
      userId: "",
    },
  });

  const selectedDate = watch("date");

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      if (isAdmin) {
        await userService.getAll();
      }

      if (foodToEdit) {
        setValue("userId", foodToEdit.userId);
      } else if (userService.currentUser?.id) {
        setValue("userId", userService.currentUser?.id);
      }

      setLoading(false);
    }

    loadData();
  }, [isAdmin, setValue, userService.currentUser]);

  useEffect(() => {
    if (foodToEdit) {
      const data = {
        date: dayjs(foodToEdit.takenAt),
        time: dayjs(foodToEdit.takenAt),
        name: foodToEdit.name,
        calorieValue: foodToEdit.calorieValue.toString(),
        cheating: foodToEdit.cheating,
        userId: foodToEdit.userId,
      };
      reset(data);
    }
  }, [foodToEdit]);

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
        id: foodToEdit ? foodToEdit.id : null,
        name: data.name,
        calorieValue: data.calorieValue,
        takenAt: dateTime,
        userId: isAdmin ? data.userId : userService.currentUser?.id,
        cheating: data.cheating,
      };

      if (foodToEdit) {
        await foodService.update(foodToEdit.id, formattedData);
      } else {
        await foodService.create(formattedData);
      }

      if (foodToEdit) {
        if (isAdmin) {
          router.push("/admin/food");
        } else {
          router.push("/");
        }
      } else {
        if (isAdmin) {
          router.push("/admin/food");
        } else {
          router.push("/");
        }
      }

      if (foodToEdit) {
        alertService.success("Food edited", true);
      } else {
        alertService.success("Food added", true);
      }
    } catch (error: any) {
      alertService.error(error);
    }
  }

  if (loading) {
    return <Spinner />;
  }

  return (
    <Grid container justifyContent="center" style={{ marginTop: "20px" }}>
      <Grid item xs={12} sm={8} md={6}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" component="h1" gutterBottom>
            {foodToEdit ? "Edit" : "Add New"} Food
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            {isAdmin && (
              <Box sx={{ mb: 3, mt: 3 }}>
                <FormControl fullWidth error={!!errors.userId}>
                  <InputLabel id="category-select-label">User</InputLabel>
                  <Controller
                    name="userId"
                    control={control}
                    rules={{ required: "User is required" }}
                    render={({ field }) => (
                      <Select
                        labelId="userId"
                        label="User"
                        {...field}
                        onChange={(event) => field.onChange(event.target.value)}
                      >
                        {users?.map((el) => (
                          <MenuItem key={el.id} value={el.id}>
                            {el.role}: {el.email}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.userId && (
                    <Typography color="error" variant="body2">
                      {errors.userId.message}
                    </Typography>
                  )}
                </FormControl>
              </Box>
            )}
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
                        disableFuture={
                          selectedDate
                            ? dayjs().isSame(selectedDate, "day")
                            : false
                        }
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
                    message: "Calorie value must be a positive number",
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
              <Button
                component={Link}
                href="/admin/food"
                variant="text"
                color="inherit"
              >
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
