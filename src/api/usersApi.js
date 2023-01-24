import { axiosClient } from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";
import { ToastError, ToastSuccess } from "../shared/util/toastAlerts";

// Get Req
const getUsersByRole = async (role) => {
  const response = await axiosClient.get(`/users/${role}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetUsersByRole = (role) =>
  useQuery({
    queryFn: () => getUsersByRole(role),
    queryKey: [`${role}`],
    enabled: !!role,
    onError: (err) => {
      ToastError(err);
    },
  });

const getUserById = async (id) => {
  const response = await axiosClient.get(`/users/user/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });

  return response.data;
};

export const useGetUser = (id) =>
  useQuery({
    queryFn: () => getUserById(id),
    queryKey: [`user-${id}`],
    onError: (err) => {
      ToastError(err);
    },
  });

// const getStudentByBus = async (busId) => {
//   const response = await axiosClient.get(`/students/bus/${busId}`, {
//     headers: {
//       Authorization: `Bearer ${useAuthStore.getState().token}`,
//     },
//   });
//   return response.data;
// };

// export const useStudentByBus = (busId) =>
//   useQuery({
//     queryFn: () => getStudentByBus(busId),
//     queryKey: [`${busId}-students`],
//     onError: (err) => {
//       ToastError(err);
//     },
//   });

// const getStudentByParent = async (parentId) => {
//   const response = await axiosClient.get(`/students/parent/${parentId}`, {
//     headers: {
//       Authorization: `Bearer ${useAuthStore.getState().token}`,
//     },
//   });
//   return response.data;
// };

// export const useStudentByParent = (parentId) =>
//   useQuery({
//     queryFn: () => getStudentByParent(parentId),
//     queryKey: [`${parentId}-students`],
//     onError: (err) => {
//       ToastError(err);
//     },
//   });

// // Post Req
const createUser = async (userData) => {
  const response = await axiosClient.post("/auth/register", userData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      ToastSuccess("New User Created Successfuly");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// // Patch Req
const updateUser = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(`/users/${id}`, restProps, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateUser(data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries([`user-${id}`]);
      ToastSuccess("User updated Successfully");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Delete Req
const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/users/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteUser(id),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries(["users"]);
      ToastSuccess(message);
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};
