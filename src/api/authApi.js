import { useMutation } from "@tanstack/react-query";
import { axiosClient } from "./axios";

const loginHandler = async (credentials) => {
  const response = await axiosClient.post("/auth/login", credentials);
  return response.data;
};

export const useLogin = () =>
  useMutation({
    mutationFn: (credentials) => loginHandler(credentials),
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });
