import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useCreateUser } from "../../api/usersApi";
import { useGetBuses } from "../../api/busesApi";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";
import { useForm } from "../../shared/hooks/form-hook";
import { userFormInitial } from "../../shared/util/formInitials/userFormInitial";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
  VALIDATOR_MAXLENGTH,
  VALIDATOR_EMAIL,
  VALIDATOR_REQUIRE_SELECT,
} from "../../shared/util/validators";

import styles from "./NewUser.module.css";

const roleOptions = (
  <>
    <option key={"opt1"}>Parent</option>
    <option key={"opt2"}>Employee</option>
    <option key={"opt3"}>Admin</option>
  </>
);

const NewUser = () => {
  const [formState, inputHandler, SetData] = useForm(userFormInitial, false);

  const { mutateAsync: createUser, isLoading: isSending } = useCreateUser();
  const { data, isLoading, isSuccess } = useGetBuses();

  const history = useHistory();
  let busOptions;
  if (isSuccess) {
    busOptions = data?.buses.map((bus) => (
      <option key={bus._id} value={bus._id}>
        {bus.schoolName}
      </option>
    ));
  }

  const role = formState.inputs.role.value;
  const validityWithoutBus =
    formState.inputs.email.isValid &&
    formState.inputs.image.isValid &&
    formState.inputs.name.isValid &&
    formState.inputs.password.isValid &&
    formState.inputs.phoneNumber.isValid &&
    formState.inputs.role.isValid &&
    formState.inputs.surname.isValid;

  useEffect(() => {
    if (role === "Employee") {
      SetData({ bus: { value: "", isValid: false } }, false);
    } else {
      SetData({ bus: undefined }, validityWithoutBus);
    }
  }, [role, SetData, validityWithoutBus]);

  const formHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("email", formState.inputs.email.value);
    formData.append("image", formState.inputs.image.value);
    formData.append(
      "name",
      formState.inputs.name.value + " " + formState.inputs.surname.value
    );
    formData.append("password", formState.inputs.password.value);
    formData.append("phoneNumber", formState.inputs.phoneNumber.value);
    formData.append("role", formState.inputs.role.value.toLowerCase());
    formData.append(
      "busId",
      formState.inputs.role.value === "Employee"
        ? formState.inputs.bus.value
        : undefined
    );
    await createUser(formData);

    history.push(`/users/${formState.inputs.role.value.toLowerCase()}`);
  };

  return (
    <>
      {(isLoading || isSending) && <LoadingSpinner asOverlay />}
      <form onSubmit={formHandler} className={styles.parentForm}>
        <div className={styles.profilePic}>
          <ImageUpload id="image" onInputChange={inputHandler} />
        </div>
        <div className={styles.name}>
          <Input
            id="name"
            label="Name"
            type="text"
            placeholder="Enter the user's name"
            errorText="Name Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
        <div className={styles.surname}>
          <Input
            id="surname"
            label="Surname"
            type="text"
            placeholder="Enter the user's surname"
            errorText="Surname Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
        <div className={styles.phoneNumber}>
          <Input
            id="phoneNumber"
            label="Contact Number"
            type="text"
            placeholder="Example : 555-555-55-55"
            errorText="Phone number must contain 10 digits !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(13), VALIDATOR_MAXLENGTH(14)]}
          />
        </div>
        <div className={styles.email}>
          <Input
            id="email"
            label="Email Address"
            type="email"
            placeholder="Enter the user's email address"
            errorText="Enter a valid email!"
            onInputChange={inputHandler}
            validators={[VALIDATOR_EMAIL()]}
          />
        </div>

        <div className={styles.role}>
          <Input
            id="role"
            label="User Role"
            type="text"
            element="select"
            placeholder="parent, employee, admin"
            errorText="Role Field can't be empty !"
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE_SELECT()]}
            options={roleOptions}
            defaultText={"Please pick a role"}
          />
        </div>

        <div className={styles.password}>
          <Input
            id="password"
            label="Password"
            type="text"
            placeholder="Enter the temporary password"
            errorText="Password should be min 5 characters."
            onInputChange={inputHandler}
            validators={[VALIDATOR_MINLENGTH(5)]}
          />
        </div>
        {formState.inputs.role.value === "Employee" && (
          <div className={styles.bus}>
            <Input
              id="bus"
              label="Buses"
              type="text"
              element="select"
              placeholder="Pick a bus for the employee"
              errorText="Must pick a bus"
              onInputChange={inputHandler}
              options={busOptions}
              defaultText={"Please pick a bus"}
              validators={[VALIDATOR_REQUIRE_SELECT()]}
            />
          </div>
        )}
        <div className={styles.btn}>
          <Button disabled={!formState.isValid} success mid type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default NewUser;
