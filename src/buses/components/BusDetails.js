import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useDeleteBus, useGetBus, usePopulateBus } from "../../api/busesApi";
import { useUpdateBus } from "../../api/busesApi";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UI-Elements/Modal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import { busInitials } from "../../shared/util/formInitials/busFormInitial";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";

import styles from "./BusDetails.module.css";

const BusDetails = () => {
  const history = useHistory();
  const busId = useParams().busId;

  const { data, isSuccess, isLoading, isFetching, isError } = useGetBus(busId);
  const { mutateAsync: updateBus } = useUpdateBus();
  const { mutateAsync: deleteBus } = useDeleteBus();
  const { mutateAsync: populateBus } = usePopulateBus();

  const [showNotification, setNotification] = useState(false);
  const openNotificationHandler = () => setNotification(true);
  const closeNotificationHandler = () => setNotification(false);

  const deleteHandler = async () => {
    await deleteBus(busId, {
      onSuccess: () => {
        history.push("/buses");
      },
    });
  };
  const populateHandler = async () => {
    await populateBus(busId, {
      onSuccess: (data) => {
        console.log(data);
      },
    });
  };

  const [formState, inputHandler] = useForm(busInitials, false);

  const formHandler = async (e) => {
    e.preventDefault();

    const updateData = {
      id: busId,
      schoolName: formState.inputs.schoolName.value,
      busDriver: {
        name:
          formState.inputs.bName.value + " " + formState.inputs.bSurname.value,
        phoneNumber: formState.inputs.bPhoneNumber.value,
      },
      studentHandler: {
        name:
          formState.inputs.hName.value + " " + formState.inputs.hSurname.value,
        phoneNumber: formState.inputs.hPhoneNumber.value,
      },
    };

    await updateBus(updateData, {
      onSuccess: (data) => {
        console.log(data);
      },
    });

    history.push("/buses");
  };

  if (isError) history.push("/buses");

  let content;
  if (isLoading || isFetching) content = <LoadingSpinner asOverlay />;
  if (isSuccess)
    content = (
      <form onSubmit={formHandler} className={styles.busForm}>
        <div className={styles.licensePlate}>
          <Input
            id="licensePlate"
            label="License Plate"
            type="text"
            placeholder="Enter the bus plate"
            errorText="enter a valid plate"
            onInputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
            initialValue={data.bus.licensePlate}
            initialValid={true}
            disabled
          />
        </div>
        <div className={styles.school}>
          <Input
            id="schoolName"
            label="School Name"
            type="text"
            placeholder="Enter the school name"
            errorText="School Name Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={data.bus.schoolName}
            initialValid={true}
          />
        </div>
        <div className={styles.bName}>
          <Input
            id="bName"
            label="Driver Name"
            type="text"
            placeholder="Enter the drivers' name"
            errorText="Name Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={data.bus.busDriver.name.split(" ")[0]}
            initialValid={true}
          />
        </div>
        <div className={styles.bSname}>
          <Input
            id="bSurname"
            label="Driver Surname"
            type="text"
            placeholder="Enter the drivers' surname"
            errorText="Surname Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={data.bus.busDriver.name.split(" ")[1]}
            initialValid={true}
          />
        </div>
        <div className={styles.bPhoneNumber}>
          <Input
            id="bPhoneNumber"
            label="Driver Contact Number"
            type="text"
            placeholder="Example : 555-555-55-55"
            errorText="Phone number must contain 10 digits !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(13), VALIDATOR_MAXLENGTH(14)]}
            initialValue={data.bus.busDriver.phoneNumber}
            initialValid={true}
          />
        </div>
        <div className={styles.hName}>
          <Input
            id="hName"
            label="Handler Name"
            type="text"
            placeholder="Enter the handlers' name"
            errorText="Name Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={data.bus.studentHandler.name.split(" ")[0]}
            initialValid={true}
          />
        </div>
        <div className={styles.hSname}>
          <Input
            id="hSurname"
            label="Handler Surname"
            type="text"
            placeholder="Enter the handlers' surname"
            errorText="Surname Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
            initialValue={data.bus.studentHandler.name.split(" ")[1]}
            initialValid={true}
          />
        </div>
        <div className={styles.hPhoneNumber}>
          <Input
            id="hPhoneNumber"
            label="Handler Contact Number"
            type="text"
            placeholder="Example : 555-555-55-55"
            errorText="Phone number must contain 10 digits !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(13), VALIDATOR_MAXLENGTH(14)]}
            initialValue={data.bus.studentHandler.phoneNumber}
            initialValid={true}
          />
        </div>
        <div className={styles.studentBtns}>
          <Button large to={`/students/bus/${busId}`}>
            Show Students
          </Button>
          <Button large success onClick={populateHandler}>
            Populate Bus
          </Button>
        </div>
        <div className={styles.btn}>
          <Button warning large to={"/buses"}>
            Back to buses
          </Button>
          <Button invert large type="submit">
            Update Changes
          </Button>
          <Button onClick={openNotificationHandler} danger large type="button">
            Delete Bus
          </Button>
        </div>
      </form>
    );

  return (
    <>
      {content}
      <Modal
        show={showNotification}
        onClick={closeNotificationHandler}
        header="Delete Bus Info"
        footer={
          <div>
            <Button onClick={closeNotificationHandler}>Close</Button>
            <Button danger onClick={deleteHandler}>
              Delete
            </Button>
          </div>
        }
      >
        <p>
          Are you sure you want to delete this bus information ? Deletion cannot
          be undone!
        </p>
      </Modal>
    </>
  );
};

export default BusDetails;
