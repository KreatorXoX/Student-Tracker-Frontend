import axios from "axios";

export const axiosClient = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
