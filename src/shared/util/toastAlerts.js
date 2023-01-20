import { toast } from "react-hot-toast";
export const ToastSuccess = (message) => {
  toast.success(message);
};

export const ToastError = (err) => {
  let errorMessage = "";

  if (err.response) errorMessage = err.response.data?.message;
  else if (err.request) errorMessage = err.request?.statusText;
  else errorMessage = ("Error", err.message);

  toast.error(errorMessage);
};
