import React from "react";
import { Link } from "react-router-dom";

import styles from "./Button.module.css";

const Button = (props) => {
  let buttonClasses = `${styles.btn} ${
    props.danger
      ? styles.danger
      : props.success
      ? styles.success
      : props.warning
      ? styles.warning
      : styles.regular
  } ${props.mid ? styles.mid : props.large ? styles.large : styles.sm} ${
    props.invert ? styles.invert : ""
  }`;

  if (props.href) {
    return (
      <a className={buttonClasses} href={props.href}>
        {props.children}
      </a>
    );
  }
  if (props.to) {
    return (
      <Link to={props.to} exact={props.exact} className={buttonClasses}>
        {props.children}
      </Link>
    );
  }
  return (
    <button
      onClick={props.onClick}
      type={props.type || "button"}
      className={buttonClasses}
      disabled={props.disabled}
      style={props.style}
    >
      {props.children}
    </button>
  );

  // const component = (
  //   <button
  //     onClick={props.onClick}
  //     type={props.type || "button"}
  //     className={buttonClasses}
  //     disabled={props.disabled}
  //   >
  //     {props.children}
  //   </button>
  // );

  // return component;
};

export default Button;
