import { useState } from "react";
import { useFetch } from "@/app/_helpers/client";
import { IUser } from "../_store/slices/userSlice";
import { useAlertService } from "./useAlertService";

export function useReportService(): IReportService {
  const alertService = useAlertService();
  const fetch = useFetch();
  const [usersCalories, setUsersCalories] = useState<IUserItem[]>([]);
  const [daysReachedLimit, setDaysReachedLimit] = useState<Date[]>([]);

  return {
    usersCalories,
    daysReachedLimit,
    getUsersCalories: async (dateFrom, dateTo) => {
      const getUsersCalories = await fetch.get(
        `/api/admin/reports/average-calories?dateFrom=${dateFrom}&dateTo=${dateTo}`
      );
      setUsersCalories(getUsersCalories);
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

interface IDaysReachedLimitStore {
  daysReachedLimit?: Date[];
}

export interface IReportService extends IUserStore, IDaysReachedLimitStore {
  getUsersCalories: (dateFrom?: string, dateTo?: string) => Promise<void>;
}
