import { axiosClient } from "./axios";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";
const getBuses = async () => {
  const response = await axiosClient.get("/buses", {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return await response.data;
};

export const useGetBuses = () =>
  useQuery({ queryFn: getBuses, queryKey: ["buses"] });
