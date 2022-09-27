import React from "react";
import { createPortal } from "react-dom";

import "./LoadingSpinner.css";

const LoadingSpinner = (props) => {
  let content;
  if (props.asOverlay) {
    content = (
      <div
        className={`${
          props.asOverlay ? "loading-spinner__overlay" : "loading-spinner"
        }`}
      >
        <div className="lds-dual-ring"></div>
      </div>
    );
    return createPortal(content, document.getElementById("spinnerPortal"));
  } else {
    return (
      <div className={`${"loading-spinner"}`}>
        <div className="lds-dual-ring"></div>
      </div>
    );
  }
};

export default LoadingSpinner;
