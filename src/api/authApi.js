import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";
import { axiosClient } from "./axios";
import { ToastSuccess, ToastError } from "../shared/util/toastAlerts";

const loginHandler = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials) => loginHandler(credentials),
    onSuccess: (data) => {
      try {
        useAuthStore.getState().setLogin(data.accessToken);
      } catch (error) {
        ToastError(error);
      }
      ToastSuccess("User Logged In !");
    },
    onError: (error) => {
      ToastError(error);
    },
  });

const logoutHandler = async () => {
  await axiosClient.post(
    "/auth/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    }
  );
};

export const useLogout = () =>
  useMutation({
    mutationFn: logoutHandler,
    onSuccess: () => {
      ToastSuccess("User Logged Out !");
    },
    onError: (error) => {
      ToastError(error);
    },
    onSettled: () => {
      useAuthStore.getState().setLogout();
    },
  });
