import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { Dayjs } from "dayjs";

export type TFormData = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
};

export interface IFoodEntriesForm {
  loadData: (dateFrom?: Dayjs, dayTo?: Dayjs) => Promise<void>;
  reloadData: () => Promise<void>;
  onSubmit: (data: TFormData) => Promise<void>;
  handleReset: () => Promise<void>;
  isLoading: boolean;
  formMethods: UseFormReturn<TFormData, any, undefined>;
  foodItems: any;
  setPage: Dispatch<SetStateAction<number>>;
  setRowsPerPage: Dispatch<SetStateAction<number>>;
  page: number;
  rowsPerPage: number;
}
