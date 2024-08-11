import { useAlertService } from "@/app/_services";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import { TFormData, IFoodEntriesForm } from "./commonTypes";
import { IFoodService, IUserService } from "@/app/_services";

interface IProps {
  userService: IUserService;
  foodService: IFoodService;
  isAdminForm?: boolean;
}

export function useFoodEntriesForm({ userService, foodService, isAdminForm }: IProps): IFoodEntriesForm {
  const alertService = useAlertService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formMethods = useForm<TFormData>();
  const { setValue } = formMethods;

  const loadData = async (dateFrom?: Dayjs, dayTo?: Dayjs) => {
    if (isAdminForm) {
      await foodService.getAll(
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null
      );
    } else {
      await foodService.getByUserId(
        userService.currentUser.id,
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null
      );
    }
  };

  const onSubmit = async (data: TFormData) => {
    alertService.clear();
    if (!data.dateFrom || !data.dateTo) {
      alertService.error("Please select start and end dates");
      return;
    }
  
    if (data.dateFrom > data.dateTo) {
      alertService.error("Start date must be earlier than end date");
      return;
    }
  
    setIsLoading(true);

    await loadData(data.dateFrom, data.dateTo);
  };

  const handleReset = async () => {
    await loadData();
    setValue("dateFrom", null);
    setValue("dateTo", null);
  };

  useEffect(() => {
    if (userService.currentUser?.id) {
        loadData();
    }
  }, [userService.currentUser]);

  useEffect(() => {
    setIsLoading(false);
  }, [foodService]);

  const foodItems = foodService.foods;

  return {
    loadData,
    onSubmit,
    handleReset,
    isLoading,
    formMethods,
    foodItems
  };
}
