import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";

import { TFormData, IFoodEntriesForm } from "./commonTypes";
import { useAlertService, IFoodService, IUserService } from "@/app/_services";

type Props = {
  userService: IUserService;
  foodService: IFoodService;
};

export function useFoodEntriesForm({
  userService,
  foodService,
}: Props): IFoodEntriesForm {
  const alertService = useAlertService();
  const formMethods = useForm<TFormData>({
    defaultValues: {
      dateFrom: null,
      dateTo: null,
    },
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { setValue } = formMethods;
  const [dateFrom, setDateFrom] = useState<Dayjs>(null);
  const [dateTo, setDateTo] = useState<Dayjs>(null);

  const loadData = async (dateFrom?: Dayjs, dayTo?: Dayjs) => {
    setIsLoading(true);

    await foodService.getAll(
      dateFrom ? dateFrom.format("ddd, D MMM YYYY") : null,
      dayTo ? dayTo.add(1, "day").format("ddd, D MMM YYYY") : null,
      page + 1,
      rowsPerPage
    );

    setIsLoading(false);
  };

  const reloadData = async () => {
    loadData(dateFrom, dateTo);
  }

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

    setDateFrom(data.dateFrom);
    setDateTo(data.dateTo);
    setPage(0);
  };

  const handleReset = async () => {
    setValue("dateFrom", null);
    setValue("dateTo", null);
    setDateFrom(null);
    setDateTo(null);
    setPage(0);
  };

  useEffect(() => {
    if (userService.currentUser?.id) {
      reloadData();
    }
  }, [userService.currentUser, page, rowsPerPage, dateFrom, dateTo]);

  const foodItems = foodService.foods;

  return {
    loadData,
    reloadData,
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
