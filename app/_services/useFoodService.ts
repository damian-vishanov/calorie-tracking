import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";
import { IUser } from "../_store/slices/userSlice";
import { useAlertService } from "./useAlertService";

export function useFoodService(isAdmin?: boolean): IFoodService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const [foods, setFoods] = useState<IFoodItems | null>(null);
  const [food, setFood] = useState<IFoodItem | null>(null);
  const [daysReachedLimit, setDaysReachedLimit] = useState<Date[]>([]);
  const apiGroup = isAdmin ? 'admin' : 'user';

  return {
    foods,
    food,
    daysReachedLimit,
    getById: async (id) => {
      try {
        console.log(isAdmin)
        const food = await fetch.get(`/api/${apiGroup}/food-items/${id}`);
        setFood(food);
      } catch (error: any) {
        alertService.error(error);
      }
    },
    getAll: async (dateFrom, dateTo, page, pageSize) => {
      const params = new URLSearchParams();

      if (page) {
        params.append('page', page.toString());
      }

      if (pageSize) {
        params.append('pageSize', pageSize.toString());
      }

      if (dateFrom && dateTo) {
        params.append('dateFrom', dateFrom);
        params.append('dateTo', dateTo);
      }

      const path = `/api/${apiGroup}/food-items${params.size > 0 ? `?${params}` : ''}`;

      const foods = await fetch.get(path);
      setFoods(foods);
    },
    getUserReachedLimitDays: async (caloriesLimit) => {
      const days = await fetch.get(
        `/api/user/food-items/reached-limit-days?caloriesLimit=${caloriesLimit}`
      );
      setDaysReachedLimit(days);
    },
    create: async (food) => {
      await fetch.post(`/api/${apiGroup}/food-items/`, food);
    },
    update: async (id, params) => {
      await fetch.put(`/api/${apiGroup}/food-items/${id}`, params);
    },
    delete: async (id) => {
      await fetch.delete(`/api/${apiGroup}/food-items/${id}`);
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
  getUserReachedLimitDays: (
    caloriesLimit: number
  ) => Promise<void>;
  create: (user: IFoodItem) => Promise<void>;
  update: (id: string, params: IFoodItem) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
