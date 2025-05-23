import Link from "next/link";
import { Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { FoodEntries } from "../_components/food";

export default function Home() {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex" }} mb={2}>
        <Link href="/food/add">
          <Button variant="contained" startIcon={<AddIcon />}>
            Add food
          </Button>
        </Link>
      </Grid>
      <FoodEntries />
    </>
  );
}
