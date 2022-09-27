import React, { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import NavLogo from "../../../assets/images/street-light.png";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UI-Elements/Backdrop";

import "./MainNavigation.css";

const MainNavigation = () => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false);

  const openDrawerHandler = () => {
    setDrawerIsOpen(true);
  };

  const closeDrawerHandler = useCallback(() => {
    setDrawerIsOpen(false);
  }, []);

  //closing the drawer on resize
  const handleResizeEvent = useCallback(() => {
    if (window.innerWidth > 968) {
      closeDrawerHandler();
    }
  }, [closeDrawerHandler]);

  useEffect(() => {
    window.addEventListener("resize", handleResizeEvent);

    return () => {
      window.removeEventListener("resize", handleResizeEvent);
    };
  }, [handleResizeEvent]);

  return (
    <React.Fragment>
      <SideDrawer show={drawerIsOpen} onClick={closeDrawerHandler}>
        <div className="drawer-canceler">X</div>
        <h1 className="main-navigation__drawer-title">
          <img src={NavLogo} width={55} height={65} alt="navLogo" />
          <Link to="/">onTheBUS</Link>
        </h1>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      {drawerIsOpen && <Backdrop onClick={closeDrawerHandler} />}
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span />
          <span />
          <span />
        </button>
        <h1 className="main-navigation__title">
          <img src={NavLogo} alt="navLogo" />
          <Link to="/">onTheBUS</Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
