import React, { useState, useContext, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import Card from "../../shared/components/UI-Elements/Card";
import Modal from "../../shared/components/UI-Elements/Modal";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import { userFormInitial } from "../../shared/util/formInitials/userFormInitial";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";

import styles from "./UserDetails.module.css";

const UserDetails = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler] = useForm(userFormInitial, false);
  const authCtx = useContext(AuthContext);
  const [user, setUser] = useState();
  const history = useHistory();
  const userId = useParams().userId;
  const [updateStatus, setUpdateStatus] = useState(false);
  const [showNotification, setNotification] = useState(false);

  const openNotificationHandler = () => setNotification(true);

  const closeNotificationHandler = () => {
    setUpdateStatus(false);
    setNotification(false);
  };

  const deleteHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        "DELETE",
        null,
        { Authorization: "Bearer " + authCtx.token }
      );
    } catch (error) {}

    history.push(`/users/${user.role}`);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/user/${userId}`,
          "GET",
          null,
          { Authorization: "Bearer " + authCtx.token }
        );
        setUser(data.user);
      } catch (error) {}
    };

    fetchUser();
  }, [sendRequest, userId, authCtx.token]);

  const formHandler = async (e) => {
    e.preventDefault();

    let infoToUpdate;
    if (formState.inputs.password.value.length > 4) {
      infoToUpdate = {
        name:
          formState.inputs.name.value + " " + formState.inputs.surname.value,
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
        phoneNumber: formState.inputs.phoneNumber.value,
      };
    } else {
      infoToUpdate = {
        name:
          formState.inputs.name.value + " " + formState.inputs.surname.value,
        email: formState.inputs.email.value,
        password: user.password,
        phoneNumber: formState.inputs.phoneNumber.value,
      };
    }
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/users/${userId}`,
        "PATCH",
        JSON.stringify(infoToUpdate),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      setUpdateStatus(true);
    } catch (error) {}
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {user && !isLoading && (
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
                  initialValue={user.name.split(" ")[0]}
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
                  initialValue={user.name.split(" ")[1]}
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
                  initialValue={user.email}
                  initialValid={true}
                />
              </div>
              {user.role === "employee" && (
                <div className={styles.schoolName}>
                  <Input
                    id="schoolName"
                    label="School Name"
                    type="text"
                    placeholder="Enter the school name"
                    errorText=""
                    onInputChange={inputHandler}
                    validators={[]}
                    initialValue={user.busId.schoolName}
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
                  initialValue={user.phoneNumber}
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
                <Card image={user.image} />
              </div>

              <div className={styles.addStudent}>
                {user.role === "parent" && (
                  <Button mid to={`/students/parent/${userId}`}>
                    Show Students
                  </Button>
                )}
                {user.role === "parent" &&
                  authCtx.userInfo.role !== "parent" && (
                    <Button to={`/student/new/${userId}`} mid success>
                      Add Child
                    </Button>
                  )}
              </div>

              <div className={styles.btn}>
                {authCtx.userInfo.role === "admin" && (
                  <Button warning mid to={`/users/${user.role}`}>
                    Back to
                    {" " +
                      `${user.role}`.charAt(0).toUpperCase() +
                      `${user.role}s`.slice(1)}
                  </Button>
                )}
                <Button invert mid type="submit">
                  Update Changes
                </Button>
                {authCtx.userInfo.role === "admin" && (
                  <Button
                    onClick={openNotificationHandler}
                    danger
                    mid
                    type="button"
                  >
                    Delete
                    {" " +
                      `${user.role}`.charAt(0).toUpperCase() +
                      `${user.role}`.slice(1)}
                  </Button>
                )}
              </div>
            </>
          </form>
          <Modal
            show={showNotification}
            onClick={closeNotificationHandler}
            header={`Delete ${user.role} info`}
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
          <Modal
            show={updateStatus}
            onClick={closeNotificationHandler}
            header="Update Status"
            footer={
              <div>
                <Button large onClick={closeNotificationHandler}>
                  Close
                </Button>
              </div>
            }
          >
            <p>User information is updated successfully</p>
          </Modal>
        </>
      )}
    </>
  );
};

export default UserDetails;

// /parent/:parentId/student
