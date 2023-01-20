import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/authStore";
const PrivateRoute = ({ children, ...rest }) => {
  const { isAuthenticated } = useAuth((state) => state);

  return (
    <Route
      {...rest}
      render={() => (isAuthenticated ? children : <Redirect to={"/auth"} />)}
    />
  );
};

export default PrivateRoute;
