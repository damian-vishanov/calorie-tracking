import Link from "next/link";

import { Grid, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

import UsersManagement from "@/app/_components/users/UsersManagement";

export default function Users() {
  return (
    <>
      <Grid item xs={12} sx={{ display: "flex" }} mb={2}>
        <Link href="/admin/users-management/add">
          <Button variant="contained" startIcon={<AddIcon />}>
            Add user
          </Button>
        </Link>
      </Grid>
      <UsersManagement />
    </>
  );
}
