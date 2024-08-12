"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEditFood } from "@/app/_components/food";
import { useFoodService } from "@/app/_services";

export default Edit;

function Edit({ params: { id } }: any) {
  const router = useRouter();
  const foodService = useFoodService();
  const food = foodService.food;

  useEffect(() => {
    if (!id) {
      router.push("/");
      return;
    }

    const loadData = async () => {
      await foodService.getById(id);
    };

    loadData();
  }, [router]);

  return <AddEditFood isAdmin={false} foodToEdit={food} />;
}
