import React, { useEffect, useState } from "react";
import Button from "../FormElements/Button";
import Modal from "./Modal";

const ErrorModal = (props) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (props.error) {
      setShow(true);
    }
  }, [props.error]);

  let errorMessage = "";

  if (props.error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    errorMessage = props.error.response.data?.message;
  } else if (props.error.request) {
    // The request was made but no response was received
    // `props.error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    errorMessage = props.error.request?.statusText;
  } else {
    // Something happened in setting up the request that triggered an props.Error
    errorMessage = ("Error", props.error.message);
  }

  return (
    <Modal
      onCancel={props.onClear}
      header={
        props.error.message
          ? props.error.message
          : props.header
          ? props.header
          : "An Error Occurred!"
      }
      show={show}
      footer={
        <Button large onClick={() => setShow(false)}>
          Okay
        </Button>
      }
    >
      <p>{errorMessage}</p>
    </Modal>
  );
};

export default ErrorModal;
