"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { AddEditFood } from "@/app/_components/food";
import { Spinner } from "@/app/_components/Spinner";
import { useFoodService } from "@/app/_services";

export default Edit;

function Edit({ params: { id } }: any) {
  const router = useRouter();
  const foodService = useFoodService();
  const food = foodService.food;

  useEffect(() => {
    if (!id) return;

    foodService.getById(id);
  }, [router]);

  return <AddEditFood isAdmin={true} food={food} />;
}
