import React, { useContext } from "react";
import { NavLink, Link } from "react-router-dom";

import { SessContext } from "../../context/sess-context";
import { AuthContext } from "../../context/auth-context";

import "./NavLinks.css";

const NavLinks = () => {
  const authCtx = useContext(AuthContext);
  const isActive = useContext(SessContext).isActive;
  return (
    !isActive && (
      <>
        {authCtx.isLoggedIn && (
          <ul className="nav-links">
            {authCtx.userInfo.role === "admin" && (
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
            {authCtx.userInfo.role === "employee" && (
              <li>
                <NavLink to={`/start`}>Start Session</NavLink>
              </li>
            )}
            <li>
              <NavLink to={`/user/${authCtx.userInfo.id}`}>My Profile</NavLink>
            </li>
            {authCtx.userInfo.role !== "employee" && (
              <li>
                <NavLink to="/students">Students</NavLink>
              </li>
            )}

            <li onClick={authCtx.logout}>
              <Link to="/">Logout</Link>
            </li>
          </ul>
        )}
        {!authCtx.isLoggedIn && (
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
