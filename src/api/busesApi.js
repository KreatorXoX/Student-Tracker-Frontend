import { axiosClient } from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";

// Get Req
const getBuses = async () => {
  const response = await axiosClient.get("/buses", {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetBuses = () =>
  useQuery({ queryFn: getBuses, queryKey: ["buses"] });

const getBusById = async (id) => {
  const response = await axiosClient.get(`buses/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetBus = (id) =>
  useQuery({ queryFn: () => getBusById(id), queryKey: ["bus"] });

// Post Req
const createBus = async (busData) => {
  const response = await axiosClient.post("buses", busData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useCreateBus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createBus(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["buses"]);
    },
  });
};

// Patch Req
const updateBus = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(`buses/${id}`, restProps, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id, data) => updateBus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["bus"]);
    },
  });
};

// Patch Req for Populating Bus
const populateBus = async (id) => {
  const response = await axiosClient.patch(
    `buses/populate/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    }
  );
  return response.data;
};

export const usePopulateBus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => populateBus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["bus"]);
    },
  });
};

// Delete Req
const deleteBus = async (id) => {
  const response = await axiosClient.delete(`buses/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useDeleteBus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteBus(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["buses"]);
    },
  });
};
