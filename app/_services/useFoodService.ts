import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";
import { IUser } from "../_store/slices/userSlice";

export function useFoodService(): IFoodService {
  const fetch = useFetch();
  const [foods, setFoods] = useState<IFoodItem[]>([]);
  const [daysReachedLimit, setDaysReachedLimit] = useState<Date[]>([]);

  return {
    foods,
    daysReachedLimit,
    getAll: async (dateFrom, dateTo) => {
      let foods;
      if (dateFrom && dateTo) {
        foods = await fetch.get(
          `/api/admin/food-items?&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
      } else {
        foods = await fetch.get(`/api/admin/food-items`);
      }

      setFoods(foods);
    },
    getByUserId: async (userId, dateFrom, dateTo) => {
      const foods = await fetch.get(
        `/api/foods?userId=${userId}&dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      setFoods(foods);
    },
    getUserReachedLimitDays: async (userId, caloriesLimit) => {
      const days = await fetch.get(
        `/api/foods?userId=${userId}&caloriesLimit=${caloriesLimit}`
      );
      setDaysReachedLimit(days);
    },
    create: async (food) => {
      await fetch.post("/api/foods", food);
    },
  };
}

export interface IFoodItem {
  id: string | null;
  takenAt: Date;
  name: string;
  calorieValue: string;
  cheating: boolean;
  userId: string;
  user?: IUser;
}

interface IFoodStore {
  foods?: IFoodItem[];
}

interface IDaysReachedLimitStore {
  daysReachedLimit?: Date[];
}

export interface IFoodService extends IFoodStore, IDaysReachedLimitStore {
  getAll: (dateFrom?: string, dateTo?: string) => Promise<void>;
  getByUserId: (
    userId: string,
    dateFrom: string,
    dateTo: string
  ) => Promise<void>;
  getUserReachedLimitDays: (
    userId: string,
    caloriesLimit: number
  ) => Promise<void>;
  create: (user: IFoodItem) => Promise<void>;
}
