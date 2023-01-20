import { axiosClient } from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";
import { ToastError, ToastSuccess } from "../shared/util/toastAlerts";

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
  useQuery({
    queryFn: getBuses,
    queryKey: ["buses"],
    onError: (err) => {
      ToastError(err);
    },
  });

const getBusById = async (id) => {
  const response = await axiosClient.get(`/buses/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetBus = (id) =>
  useQuery({
    queryFn: () => getBusById(id),
    queryKey: [`bus-${id}`],
    onError: (err) => {
      ToastError(err);
    },
  });

// Post Req
const createBus = async (busData) => {
  const response = await axiosClient.post("/buses", busData, {
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
      ToastSuccess("New Bus Created Successfuly");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Patch Req
const updateBus = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(`/buses/${id}`, restProps, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useUpdateBus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateBus(data),
    onSuccess: ({ bus }) => {
      queryClient.invalidateQueries([`bus-${bus.id}`]);
      ToastSuccess("Bus updated Successfully");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Patch Req for Populating Bus
const populateBus = async (id) => {
  const response = await axiosClient.patch(
    `/buses/populate/${id}`,
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
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries([`bus-${id}`]);
      ToastSuccess("Bus populated Successfully");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Delete Req
const deleteBus = async (id) => {
  const response = await axiosClient.delete(`/buses/${id}`, {
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
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries(["buses"]);
      ToastSuccess(message);
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};
