import React, { useEffect, useState } from "react";
import Button from "../FormElements/Button";
import Modal from "./Modal";

const ErrorModal = (props) => {
  console.log("we in modal");
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.error) {
      setShow(true);
    }
  }, [props.error]);
  return (
    <Modal
      onCancel={props.onClear}
      header={props.header ? props.header : "An Error Occurred!"}
      show={show}
      footer={
        <Button large onClick={() => setShow(false)}>
          Okay
        </Button>
      }
    >
      <p>{JSON.stringify(props.error.message)}</p>
    </Modal>
  );
};

export default ErrorModal;
