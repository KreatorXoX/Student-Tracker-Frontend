import { axiosClient } from "./axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../shared/context/authStore";
import { ToastError, ToastSuccess } from "../shared/util/toastAlerts";

// Get Req
const getStudents = async (by, id) => {
  const response = await axiosClient.get(`/students?by=${by}&id=${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetStudents = (by, id) =>
  useQuery({
    queryFn: () => getStudents(by, id),
    queryKey: ["students"],
    onError: (err) => {
      ToastError(err);
    },
  });

const getStudentById = async (id) => {
  const response = await axiosClient.get(`/students/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useGetStudent = (id) =>
  useQuery({
    queryFn: () => getStudentById(id),
    queryKey: [`student-${id}`],
    onError: (err) => {
      ToastError(err);
    },
  });

const getStudentByBus = async (busId) => {
  const response = await axiosClient.get(`/students/bus/${busId}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useStudentByBus = (busId) =>
  useQuery({
    queryFn: () => getStudentByBus(busId),
    queryKey: [`${busId}-students`],
    onError: (err) => {
      ToastError(err);
    },
  });

const getStudentByParent = async (parentId) => {
  const response = await axiosClient.get(`/students/parent/${parentId}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useStudentByParent = (parentId) =>
  useQuery({
    queryFn: () => getStudentByParent(parentId),
    queryKey: [`${parentId}-students`],
    onError: (err) => {
      ToastError(err);
    },
  });

// Post Req
const createStudent = async (studentData) => {
  const response = await axiosClient.post("/students", studentData, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createStudent(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["students"]);
      ToastSuccess("New Student Created Successfuly");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Patch Req
const updateStudent = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(`/students/${id}`, restProps, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateStudent(data),
    onSuccess: ({ student }) => {
      queryClient.invalidateQueries([`student-${student.id}`]);
      ToastSuccess("Student updated Successfully");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

const updateStatus = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(
    `/students/updateStatus/${id}`,
    restProps,
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    }
  );
  return response.data;
};

export const useStudentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status) => updateStatus(status),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries([`student-${id}`]);
      ToastSuccess("Student status is updated");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};
const updateLocation = async ({ id, ...restProps }) => {
  const response = await axiosClient.patch(
    `/students/updateLocation/${id}`,
    restProps,
    {
      headers: {
        Authorization: `Bearer ${useAuthStore.getState().token}`,
      },
    }
  );
  return response.data;
};

export const useStudentLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateLocation(data),
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries([`student-${id}`]);
      ToastSuccess("Student location is updated");
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};

// Delete Req
const deleteStudent = async (id) => {
  const response = await axiosClient.delete(`/students/${id}`, {
    headers: {
      Authorization: `Bearer ${useAuthStore.getState().token}`,
    },
  });
  return response.data;
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => deleteStudent(id),
    onSuccess: ({ message }) => {
      queryClient.invalidateQueries(["students"]);
      ToastSuccess(message);
    },
    onError: (err) => {
      ToastError(err);
    },
  });
};
