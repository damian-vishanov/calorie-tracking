"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";

import {
  Grid,
  Paper,
  Button,
  Box,
  TextField,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import { IUser } from "@/app/_store/slices/userSlice";
import { useAlertService, useUserService } from "@/app/_services";
import { Spinner } from "@/app/_components/Spinner";

type Props = {
  userToEdit?: IUser;
};

type FormData = {
  email: string;
  password: string;
  role: string;
  caloriesLimit: string;
};

export function AddEditUser({ userToEdit }: Props) {
  const router = useRouter();
  const alertService = useAlertService();
  const userService = useUserService();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      role: "",
      caloriesLimit: "",
    },
  });

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    if (userToEdit) {
      const data = {
        email: userToEdit.email,
        role: userToEdit.role,
        caloriesLimit: userToEdit.caloriesLimit.toString(),
      };
      reset(data);
    }
  }, [userToEdit, reset]);

  async function onSubmit(data: FormData) {
    alertService.clear();
    try {
      const formattedData = {
        id: userToEdit ? userToEdit.id : null,
        email: data.email,
        caloriesLimit: parseInt(data.caloriesLimit),
        role: data.role,
        ...(userToEdit ? null : { password: data.password }),
      };

      if (userToEdit) {
        await userService.update(userToEdit.id, formattedData);
      } else {
        await userService.create(formattedData);
      }

      router.push("/admin/users-management");

      alertService.success(userToEdit ? "User edited" : "User added", true);
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
            {userToEdit ? "Edit" : "Add New"} User
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ mb: 3, mt: 3 }}>
              <TextField
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Invalid email address",
                  },
                })}
                label="Email"
                variant="outlined"
                disabled={!!userToEdit}
                fullWidth
                error={!!errors.email}
                helperText={errors.email ? errors.email.message : ""}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            {!userToEdit && (
              <Box sx={{ mb: 3, mt: 3 }}>
                <TextField
                  {...register("password", {
                    required: "Password is required",
                  })}
                  margin="normal"
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  error={!!errors.password}
                  helperText={errors.password ? errors.password.message : ""}
                />
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <TextField
                {...register("caloriesLimit", {
                  required: "Calories limit is required",
                  pattern: {
                    value: /^\d+$/,
                    message: "Calories limit must be a positive number",
                  },
                })}
                label="Calories Limit"
                variant="outlined"
                fullWidth
                error={!!errors.caloriesLimit}
                helperText={
                  errors.caloriesLimit ? errors.caloriesLimit.message : ""
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box sx={{ mb: 3, mt: 3 }}>
              <FormControl fullWidth error={!!errors.role}>
                <InputLabel id="role-select-label">Role</InputLabel>
                <Controller
                  name="role"
                  control={control}
                  rules={{ required: "Role is required" }}
                  render={({ field }) => (
                    <Select
                      labelId="role-select-label"
                      id="role-select"
                      label="Role"
                      {...field}
                      disabled={userToEdit?.id === userService.currentUser?.id}
                      onChange={(event) => field.onChange(event.target.value)}
                    >
                      <MenuItem value="Admin">Admin</MenuItem>
                      <MenuItem value="Client">Client</MenuItem>
                    </Select>
                  )}
                />
                {errors.role && (
                  <Typography color="error" variant="body2">
                    {errors.role.message}
                  </Typography>
                )}
              </FormControl>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
              <Button
                component={Link}
                href="/admin/users-management"
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
