"use client";

import Link from "next/link";

import { Grid, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import AdminFoodEntries from "@/app/_components/food/AdminFoodEntries";

export default function Home() {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex" }} mb={2}>
        <Link href="/admin/food/add">
          <Button variant="contained" startIcon={<AddIcon />}>
            Add user food
          </Button>
        </Link>
      </Grid>
      <AdminFoodEntries />
    </>
  );
}
