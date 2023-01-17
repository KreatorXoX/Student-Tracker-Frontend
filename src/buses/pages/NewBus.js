import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";

import { busInitials } from "../../shared/util/formInitials/busFormInitial";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
} from "../../shared/util/validators";

import styles from "./NewBus.module.css";

const NewBus = () => {
  const { error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [formState, inputHandler] = useForm(busInitials, false);
  const authCtx = useContext(AuthContext);

  const formHandler = async (e) => {
    e.preventDefault();

    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/buses`,
        "POST",
        JSON.stringify({
          licensePlate: formState.inputs.licensePlate.value,
          schoolName: formState.inputs.schoolName.value,
          busDriver: {
            name:
              formState.inputs.bName.value +
              " " +
              formState.inputs.bSurname.value,
            phoneNumber: formState.inputs.bPhoneNumber.value,
          },
          studentHandler: {
            name:
              formState.inputs.hName.value +
              " " +
              formState.inputs.hSurname.value,
            phoneNumber: formState.inputs.hPhoneNumber.value,
          },
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (error) {}

    history.push("/buses");
  };
  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
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
          />
        </div>
        <div className={styles.schoolName}>
          <Input
            id="schoolName"
            label="School Name"
            type="text"
            placeholder="Enter the school name"
            errorText="School Name Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
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
          />
        </div>
        <div className={styles.bSurname}>
          <Input
            id="bSurname"
            label="Driver Surname"
            type="text"
            placeholder="Enter the drivers' surname"
            errorText="Surname Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
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
          />
        </div>
        <div className={styles.hSurname}>
          <Input
            id="hSurname"
            label="Handler Surname"
            type="text"
            placeholder="Enter the handlers' surname"
            errorText="Surname Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
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
          />
        </div>
        <div className={styles.btn}>
          <Button disabled={!formState.isValid} success mid type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewBus;
