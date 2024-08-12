import { useAlertService } from "@/app/_services";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Dayjs } from "dayjs";
import { TFormData, IFoodEntriesForm } from "./commonTypes";
import { IUserService } from "@/app/_services";

type Props = {
  userService: IUserService;
};

export function useUsersForm({ userService }: Props): IFoodEntriesForm {
  const alertService = useAlertService();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const formMethods = useForm<TFormData>();
  const { setValue } = formMethods;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  const loadData = async () => {
    setIsLoading(true);
    await userService.getAll(page + 1, rowsPerPage);
    setIsLoading(false);
  };

  const onSubmit = async (data: TFormData) => {
    alertService.clear();

    await loadData();
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

  const users = userService.users;

  return {
    loadData,
    onSubmit,
    handleReset,
    isLoading,
    formMethods,
    users,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
  };
}
