import { Dayjs } from "dayjs";
import { UseFormReturn } from "react-hook-form";

export type TFormData = {
  dateFrom: Dayjs | null;
  dateTo: Dayjs | null;
};

export interface IFoodEntriesForm {
  loadData: (dateFrom?: Dayjs, dayTo?: Dayjs) => Promise<void>;
  onSubmit: (data: TFormData) => Promise<void>;
  handleReset: () => Promise<void>;
  isLoading: boolean;
  formMethods: UseFormReturn<TFormData, any, undefined>;
  foodItems: any;
}
