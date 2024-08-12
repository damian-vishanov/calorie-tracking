import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";
import { IUser } from "../_store/slices/userSlice";
import { useAlertService } from "./useAlertService";

export function useFoodService(): IFoodService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const [foods, setFoods] = useState<IFoodItems | null>(null);
  const [food, setFood] = useState<IFoodItem | null>(null);
  const [daysReachedLimit, setDaysReachedLimit] = useState<Date[]>([]);

  return {
    foods,
    food,
    daysReachedLimit,
    getAll: async (dateFrom, dateTo, page, pageSize) => {
      let path = `/api/admin/food-items${page && `?page=${page}`}${
        pageSize && `&pageSize=${pageSize}`
      }`;

      if (dateFrom && dateTo) {
        path = `/api/admin/food-items?&dateFrom=${dateFrom}&dateTo=${dateTo}${
          page && `&page=${page}`
        }${pageSize && `&pageSize=${pageSize}`}`;
      }

      const foods = await fetch.get(path);
      setFoods(foods);
    },
    getById: async (id) => {
      try {
        const food = await fetch.get(`/api/admin/food-items?id=${id}`);
        setFood(food);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getByUserId: async (userId, dateFrom, dateTo, page, pageSize) => {
      let path = `/api/foods?userId=${userId}${page && `&page=${page}`}${
        pageSize && `&pageSize=${pageSize}`
      }`;

      if (dateFrom && dateTo) {
        path += `&dateFrom=${dateFrom}&dateTo=${dateTo}`;
      }

      const foods = await fetch.get(path);
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
    update: async (id, params) => {
      await fetch.put(`/api/admin/food-items/${id}`, params);
    },
    delete: async (id) => {
      await fetch.delete(`/api/admin/food-items/${id}`);
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

interface IFoodItems {
  items: IFoodItem[];
  totalItems: number;
  page: number;
  pageSize: number;
  takenCalories?: number;
}

interface IFoodStore {
  foods?: IFoodItems;
  food?: IFoodItem;
}

interface IDaysReachedLimitStore {
  daysReachedLimit?: Date[];
}

export interface IFoodService extends IFoodStore, IDaysReachedLimitStore {
  getAll: (
    dateFrom?: string,
    dateTo?: string,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  getById: (id: string) => Promise<void>;
  getByUserId: (
    userId: string,
    dateFrom?: string,
    dateTo?: string,
    page?: number,
    pageSize?: number
  ) => Promise<void>;
  getUserReachedLimitDays: (
    userId: string,
    caloriesLimit: number
  ) => Promise<void>;
  create: (user: IFoodItem) => Promise<void>;
  update: (id: string, params: IFoodItem) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
