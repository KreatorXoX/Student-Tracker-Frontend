import React from "react";
import { NavLink, Link } from "react-router-dom";

import { useLogout } from "../../../api/authApi";

import { useSessionStore } from "../../context/sessionStore";
import { useAuthStore } from "../../context/authStore";

import "./NavLinks.css";

const NavLinks = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const sessionInfo = useSessionStore((state) => state.sessionInfo);

  const { mutateAsync: logoutUser } = useLogout();

  const logoutHandler = async () => {
    await logoutUser();
  };

  return (
    !sessionInfo.isActive && (
      <>
        {userInfo?.id && (
          <ul className="nav-links">
            {userInfo.role === "admin" && (
              <>
                <li>
                  <NavLink to="/buses">Buses</NavLink>
                </li>
                <li>
                  <NavLink to="/users/parent">Parents</NavLink>
                </li>
                <li>
                  <NavLink to="/users/employee">Employees</NavLink>
                </li>
              </>
            )}
            {userInfo.role === "employee" && (
              <li>
                <NavLink to={`/start`}>Start Session</NavLink>
              </li>
            )}
            <li>
              <NavLink to={`/user/${userInfo.id}`}>My Profile</NavLink>
            </li>
            {userInfo.role !== "employee" && (
              <li>
                <NavLink to="/students">Students</NavLink>
              </li>
            )}

            <li onClick={logoutHandler}>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        )}
        {!userInfo && (
          <ul className="nav-links">
            <li className="side-drawer-login">
              <NavLink to="/auth">Login Now</NavLink>
            </li>
          </ul>
        )}
      </>
    )
  );
};

export default NavLinks;
