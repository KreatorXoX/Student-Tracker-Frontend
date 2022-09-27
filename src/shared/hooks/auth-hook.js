import { useState, useCallback, useEffect } from "react";

let autoLogout;

export const useAuth = () => {
  const [token, setToken] = useState();
  const [tokenExpirationTime, setTokenExpirationTime] = useState();
  const [userInfo, setUserInfo] = useState({ role: "", id: "", busId: "" });

  const loginHandler = useCallback((role, id, busId, token, expirationTime) => {
    setUserInfo({ role, id, busId });
    setToken(token);

    const tokenExpirationTime =
      expirationTime || new Date(new Date().getTime() + 1000 * 60 * 60);

    setTokenExpirationTime(tokenExpirationTime);
    localStorage.setItem(
      "user-info",
      JSON.stringify({
        userId: id,
        userRole: role,
        userBusId: busId,
        token: token,
        expiresIn: tokenExpirationTime.toISOString(),
      })
    );
  }, []);

  const logoutHandler = useCallback(() => {
    setToken(null);
    setTokenExpirationTime(null);
    setUserInfo({ role: "", id: "", busId: "" });
    localStorage.removeItem("user-info");
  }, []);

  useEffect(() => {
    const storedUserInfo = JSON.parse(localStorage.getItem("user-info"));
    if (
      storedUserInfo &&
      storedUserInfo.token &&
      new Date(storedUserInfo.expiresIn) > new Date()
    ) {
      loginHandler(
        storedUserInfo.userRole,
        storedUserInfo.userId,
        storedUserInfo.userBusId,
        storedUserInfo.token,
        new Date(storedUserInfo.expiresIn)
      );
    }
  }, [loginHandler]);

  useEffect(() => {
    if (token && tokenExpirationTime) {
      const remainingTime =
        tokenExpirationTime.getTime() - new Date().getTime();
      autoLogout = setTimeout(logoutHandler, remainingTime);
    } else {
      clearTimeout(autoLogout);
    }
  }, [token, logoutHandler, tokenExpirationTime]);

  return { token, login: loginHandler, logout: logoutHandler, userInfo };
};
