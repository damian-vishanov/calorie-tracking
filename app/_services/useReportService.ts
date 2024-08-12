import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";

export function useReportService(): IReportService {
  const fetch = useFetch();
  const [usersCalories, setUsersCalories] = useState<IUsersItems>(null);
  const [foodItemsCount, setFoodItemsCount] = useState<IFoodItemCount[]>([]);

  return {
    usersCalories,
    foodItemsCount,
    getUsersCalories: async (dateFrom, dateTo, page, pageSize) => {
      const getUsersCalories = await fetch.get(
        `/api/admin/reports/average-calories?dateFrom=${dateFrom}&dateTo=${dateTo}&page=${[
          page,
        ]}&pageSize=${pageSize}`
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

interface IUserItem {
  _id: string;
  email: string;
  averageCalories: number;
}

export interface IUsersItems {
  users: IUserItem[];
  totalCount: number;
}

interface IUserStore {
  usersCalories?: IUsersItems;
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
  getUsersCalories: (
    dateFrom?: string,
    dateTo?: string,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  getFoodItemsCount: () => Promise<void>;
}
