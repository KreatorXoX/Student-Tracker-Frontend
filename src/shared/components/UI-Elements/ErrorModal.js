import React from "react";

import Button from "../FormElements/Button";
import Modal from "./Modal";

const ErrorModal = (props) => {
  return (
    <Modal
      onCancel={props.onClear}
      header={props.header ? props.header : "An Error Occurred!"}
      show={!!props.error}
      footer={
        <Button large onClick={props.onClear}>
          Okay
        </Button>
      }
    >
      <p>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
