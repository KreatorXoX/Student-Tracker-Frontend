import React from "react";
import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";

import Backdrop from "./Backdrop";

import styles from "./Modal.module.css";

const ModalOverlay = (props) => {
  const content = (
    <div className={styles.modal}>
      <header className={styles.modalHeader}>
        <h2>{props.header}</h2>
      </header>
      <form
        onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault()}
      >
        <div className={styles.modalContent}>{props.children}</div>
        <footer className={styles.modalFooter}>{props.footer}</footer>
      </form>
    </div>
  );
  return createPortal(content, document.getElementById("modalPortal"));
};
const Modal = (props) => {
  return (
    <>
      {props.show && <Backdrop onClick={props.onClick} />}
      <CSSTransition
        in={props.show}
        mountOnEnter
        unmountOnExit
        timeout={300}
        classNames="modal"
      >
        <ModalOverlay {...props} />
      </CSSTransition>
    </>
  );
};

export default Modal;
