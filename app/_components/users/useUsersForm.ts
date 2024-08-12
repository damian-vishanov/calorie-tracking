import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { useAlertService, IUserService } from "@/app/_services";
import { TFormData, IFoodEntriesForm } from "./commonTypes";

type Props = {
  userService: IUserService;
};

export function useUsersForm({ userService }: Props): IFoodEntriesForm {
  const alertService = useAlertService();
  const formMethods = useForm<TFormData>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const { setValue } = formMethods;

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
