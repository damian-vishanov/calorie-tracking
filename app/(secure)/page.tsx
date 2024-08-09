"use client";

import Link from "next/link";

import { Grid, Paper, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import { FoodEntries } from "../_components/food";

export default function Home() {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex" }} mb={2}>
        <Link href="/add-food">
          <Button variant="contained" startIcon={<AddIcon />}>
            Add food
          </Button>
        </Link>
      </Grid>
      <FoodEntries />
    </>
  );
}
