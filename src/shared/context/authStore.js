import axios from "axios";
import jwtDecode from "jwt-decode";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useAuth = create(
  persist(
    (set) => ({
      persist: false,
      isAuthenticated: false,
      role: null,
      setAuth: (role) =>
        set((state) => ({
          ...state,
          isAuthenticated: true,
          role: role,
          persist: true,
        })),
    }),
    {
      name: "persist-auth",
    }
  )
);

export const useAuthStore = create(
  devtools((set) => ({
    userInfo: {
      id: null,
      role: null,
      busId: null,
    },
    token: null,
    setLogin: (token) =>
      set((state) => {
        let user;
        if (token) {
          const decodedToken = jwtDecode(token);

          user = {
            id: decodedToken.id,
            role: decodedToken.role,
            busId: decodedToken?.busId,
          };
        } else {
          throw new Error("Invalid Token");
        }
        useAuth.getState().setAuth(user.role);
        console.log("store token is : ", token);
        return {
          ...state,
          userInfo: user,
          token: token,
        };
      }),
    setLogout: () =>
      set((state) => {
        useAuth.getState().setAuth(null);
        return {
          ...state,
          userInfo: {
            id: null,
            role: null,
            busId: null,
          },
          token: null,
        };
      }),
  }))
);

const refresh = useAuth.getState().persist;
const refreshUrl = "http://localhost:5000/api/auth/refresh";
if (refresh) {
  axios
    .get(refreshUrl, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    })
    .then((response) => {
      if (response.data?.accessToken) {
        useAuthStore.getState().setLogin(response.data.accessToken);
      }
    })
    .catch((err) => {
      console.log(err);
      useAuthStore.getState().setLogout();
    });
}