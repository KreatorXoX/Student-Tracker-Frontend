import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../context/authStore";
const AdminRoute = ({ children, ...rest }) => {
  const { isAuthenticated, role } = useAuth((state) => state);

  return (
    <Route
      {...rest}
      render={() =>
        isAuthenticated && role === "admin" ? (
          children
        ) : (
          <Redirect to={"/auth"} />
        )
      }
    />
  );
};

export default AdminRoute;
