import React, { useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useGetUser } from "../../api/usersApi";
import { useDeleteUser } from "../../api/usersApi";
import { useUpdateUser } from "../../api/usersApi";

import { useAuth } from "../../shared/context/authStore";
import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI-Elements/Card";
import Modal from "../../shared/components/UI-Elements/Modal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";
import { userFormInitial } from "../../shared/util/formInitials/userFormInitial";

import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";

import styles from "./UserDetails.module.css";

const UserDetails = () => {
  const [formState, inputHandler] = useForm(userFormInitial, false);

  const role = useAuth((state) => state.role);

  const history = useHistory();
  const userId = useParams().userId;

  const { data, isLoading, isSuccess } = useGetUser(userId);
  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const [showNotification, setNotification] = useState(false);

  const openNotificationHandler = () => setNotification(true);

  const closeNotificationHandler = () => {
    setNotification(false);
  };

  const deleteHandler = async () => {
    await deleteUser(userId);
    history.push(`/users/${data.user.role}`);
  };

  const formHandler = async (e) => {
    e.preventDefault();

    let infoToUpdate;
    if (formState.inputs.password.value.length > 4) {
      infoToUpdate = {
        id: userId,
        name:
          formState.inputs.name.value + " " + formState.inputs.surname.value,
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
        phoneNumber: formState.inputs.phoneNumber.value,
      };
    } else {
      infoToUpdate = {
        id: userId,
        name:
          formState.inputs.name.value + " " + formState.inputs.surname.value,
        email: formState.inputs.email.value,
        phoneNumber: formState.inputs.phoneNumber.value,
      };
    }

    await updateUser(infoToUpdate);
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {data?.user && isSuccess && (
        <>
          <form onSubmit={formHandler} className={styles.parentForm}>
            <>
              <div className={styles.name}>
                <Input
                  id="name"
                  label="Name"
                  type="text"
                  placeholder="Enter your name"
                  errorText="Name Field can't be empty !"
                  onInputChange={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  initialValue={data.user.name.split(" ")[0]}
                  initialValid={true}
                />
              </div>
              <div className={styles.surname}>
                <Input
                  id="surname"
                  label="Surname"
                  type="text"
                  placeholder="Enter your surname"
                  errorText="Surname Field can't be empty !"
                  onInputChange={inputHandler}
                  validators={[VALIDATOR_REQUIRE()]}
                  initialValue={data.user.name.split(" ")[1]}
                  initialValid={true}
                />
              </div>
              <div className={styles.email}>
                <Input
                  id="email"
                  label="Email Address"
                  type="text"
                  placeholder="Example : example@example.com"
                  errorText="Please enter a valid email!"
                  onInputChange={inputHandler}
                  validators={[VALIDATOR_EMAIL()]}
                  initialValue={data.user.email}
                  initialValid={true}
                />
              </div>
              {data.user.role === "employee" && (
                <div className={styles.schoolName}>
                  <Input
                    id="schoolName"
                    label="School Name"
                    type="text"
                    placeholder="Enter the school name"
                    errorText=""
                    onInputChange={inputHandler}
                    validators={[]}
                    initialValue={data.user.busId?.schoolName}
                    initialValid={true}
                    disabled
                  />
                </div>
              )}
              <div className={styles.phoneNumber}>
                <Input
                  id="phoneNumber"
                  label="Phone Number"
                  type="text"
                  placeholder="Example : 555-555-55-55"
                  errorText="Please enter a valid phone number!"
                  onInputChange={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(13)]}
                  initialValue={data.user.phoneNumber}
                  initialValid={true}
                />
              </div>
              <div className={styles.password}>
                <Input
                  id="password"
                  label="Update Password"
                  type="password"
                  placeholder="*******"
                  errorText="Password should be min 5 characters."
                  onInputChange={inputHandler}
                  validators={[VALIDATOR_MINLENGTH(5)]}
                  initialValue={""}
                  initialValid={true}
                />
              </div>
              <div className={styles.profilePic}>
                {/* <Avatar style={{ backgroundColor: "white", marginTop: "1rem" }}>
                  <img
                    src={`http://localhost:5000/${user.image}`}
                    style={{ borderRadius: "5%" }}
                    alt="profile"
                  />
                </Avatar> */}
                <Card image={data.user.image} />
              </div>

              <div className={styles.addStudent}>
                {data.user.role === "parent" && (
                  <Button mid to={`/students/parent/${userId}`}>
                    Show Students
                  </Button>
                )}
                {data.user.role === "parent" && role === "admin" && (
                  <Button to={`/student/new/${userId}`} mid success>
                    Add Child
                  </Button>
                )}
              </div>

              <div className={styles.btn}>
                {role === "admin" && (
                  <Button warning mid to={`/users/${data.user.role}`}>
                    Back to
                    {" " +
                      `${data.user.role}`.charAt(0).toUpperCase() +
                      `${data.user.role}s`.slice(1)}
                  </Button>
                )}
                <Button invert mid type="submit">
                  Update Changes
                </Button>
                {role === "admin" && (
                  <Button
                    onClick={openNotificationHandler}
                    danger
                    mid
                    type="button"
                  >
                    Delete
                    {" " +
                      `${data.user.role}`.charAt(0).toUpperCase() +
                      `${data.user.role}`.slice(1)}
                  </Button>
                )}
              </div>
            </>
          </form>
          <Modal
            show={showNotification}
            onClick={closeNotificationHandler}
            header={`Delete ${data.user.role} info`}
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
              Are you sure you want to delete this parent information ? Deletion
              cannot be undone!
            </p>
          </Modal>
        </>
      )}
    </>
  );
};

export default UserDetails;
