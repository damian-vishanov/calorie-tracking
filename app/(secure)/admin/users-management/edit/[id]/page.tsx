"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AddEditUser } from "@/app/_components/users/AddEditUser";
import { useUserService } from "@/app/_services";

export default Edit;

function Edit({ params: { id } }: any) {
  const router = useRouter();
  const userService = useUserService();
  const user = userService.user;

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      await userService.getById(id);
    };

    loadData();
  }, [router]);

  return <AddEditUser userToEdit={user} />;
}
