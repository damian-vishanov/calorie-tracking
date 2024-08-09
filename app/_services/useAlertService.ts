import { useDispatch, useSelector } from "react-redux";

import { addAlert, clearAlert, IAlert } from "../_store/slices/alertSlice";
import { selectAlert } from "../_store/selectors";

export function useAlertService(): IAlertService {
  const dispatch = useDispatch();
  const alert = useSelector(selectAlert);

  return {
    alert,
    success: (message: string, showAfterRedirect = false) => {
      const type = "success";
      dispatch(addAlert({ type, message, showAfterRedirect }));
    },
    error: (message: string, showAfterRedirect = false) => {
      const type = "danger";
      dispatch(addAlert({ type, message, showAfterRedirect }));
    },
    clear: () => {
      dispatch(clearAlert());
    },
  };
}

interface IAlertStore {
  alert?: IAlert;
}

interface IAlertService extends IAlertStore {
  success: (message: string, showAfterRedirect?: boolean) => void;
  error: (message: string, showAfterRedirect?: boolean) => void;
  clear: () => void;
}
