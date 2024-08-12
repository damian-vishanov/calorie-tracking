import { useAlertService } from "@/app/_services";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import { TFormData, IFoodEntriesForm } from "./commonTypes";
import { IFoodService, IUserService } from "@/app/_services";

type Props = {
  userService: IUserService;
  foodService: IFoodService;
  isAdminForm?: boolean;
};

export function useFoodEntriesForm({
  userService,
  foodService,
  isAdminForm,
}: Props): IFoodEntriesForm {
  const alertService = useAlertService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formMethods = useForm<TFormData>();
  const { setValue } = formMethods;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const loadData = async (dateFrom?: Dayjs, dayTo?: Dayjs) => {
    setIsLoading(true);
    if (isAdminForm) {
      await foodService.getAll(
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null,
        page + 1,
        rowsPerPage
      );
    } else {
      await foodService.getByUserId(
        userService.currentUser.id,
        dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
        dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null,
        page + 1,
        rowsPerPage
      );
    }
    setIsLoading(false);
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
  }, [userService.currentUser, page, rowsPerPage]);

  const foodItems = foodService.foods;

  return {
    loadData,
    onSubmit,
    handleReset,
    isLoading,
    formMethods,
    foodItems,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  };
}
