import { createContext } from "react";

export const AuthContext = createContext({
  userInfo: {
    role: "",
    id: "",
    busId: "",
  },
  token: null,
  isLoggedIn: false,
  login: (id, token) => {},
  logout: () => {},
});
