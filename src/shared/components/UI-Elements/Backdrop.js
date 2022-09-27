import React from "react";
import ReactDOM from "react-dom";

import styles from "./Backdrop.module.css";

const Backdrop = (props) => {
  let content = <div onClick={props.onClick} className={styles.backdrop}></div>;
  return ReactDOM.createPortal(
    content,
    document.getElementById("backdropPortal")
  );
};

export default Backdrop;
