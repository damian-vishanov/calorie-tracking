import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";
import { useAlertService } from "./useAlertService";

export function useReportService(): IReportService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const [usersCalories, setUsersCalories] = useState<IUserItem[]>([]);
  const [foodItemsCount, setFoodItemsCount] = useState<IFoodItemCount[]>([]);

  return {
    usersCalories,
    foodItemsCount,
    getUsersCalories: async (dateFrom, dateTo) => {
      const getUsersCalories = await fetch.get(
        `/api/admin/reports/average-calories?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      setUsersCalories(getUsersCalories);
    },
    getFoodItemsCount: async () => {
      const getFoodItemsCount = await fetch.get(
        `/api/admin/reports/food-items-count`
      );
      setFoodItemsCount(getFoodItemsCount);
    },
  };
}

export interface IUserItem {
  id: string | null;
  email: string;
  averageCalories: string;
}

interface IUserStore {
  usersCalories?: IUserItem[];
}

interface IFoodItemCount {
  day: string;
  currentWeek: number;
  previousWeek: number;
}

interface IFoodsCountStore {
  foodItemsCount?: IFoodItemCount[];
}

export interface IReportService extends IUserStore, IFoodsCountStore {
  getUsersCalories: (dateFrom?: string, dateTo?: string) => Promise<void>;
  getFoodItemsCount: () => Promise<void>;
}
