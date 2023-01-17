import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Toggle from "../../shared/components/FormElements/Toggle";

import Map from "../../shared/components/UI-Elements/Map";
import Card from "../../shared/components/UI-Elements/Card";
import Modal from "../../shared/components/UI-Elements/Modal";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import { studentInitial } from "../../shared/util/formInitials/studentFormInitial";
import {
  VALIDATOR_MIN,
  VALIDATOR_MAX,
  VALIDATOR_REQUIRE,
  VALIDATOR_REQUIRE_SELECT,
} from "../../shared/util/validators";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAddressCard,
  faMapLocation,
} from "@fortawesome/free-solid-svg-icons";

import styles from "./StudentDetails.module.css";

const StudentDetails = () => {
  const authCtx = useContext(AuthContext);
  const [formState, inputHandler] = useForm(studentInitial, false);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [student, setStudent] = useState();
  const [isComing, setIsComing] = useState();
  const [selectOptions, setSelectOptions] = useState([]);

  const [showContacts, setShowContacts] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showNotification, setNotification] = useState(false);

  const history = useHistory();
  const stdId = useParams().stdId;

  const openContactsHandler = () => setShowContacts(true);
  const closeContactsHandler = () => setShowContacts(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const openNotificationHandler = () => setNotification(true);
  const closeNotificationHandler = () => setNotification(false);

  const deleteStudentHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/students/${stdId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (error) {}
    setNotification(false);
    history.push("/students");
  };

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/students/${stdId}`,
          "GET",
          null,
          { Authorization: "Bearer " + authCtx.token }
        );

        if (authCtx.userInfo.role === "admin") {
          const busData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/buses`,
            "GET",
            null,
            { Authorization: "Bearer " + authCtx.token }
          );

          setSelectOptions(
            busData.buses.map((bus) => {
              if (bus.capacity > 0)
                return <option key={bus.id}>{bus.schoolName}</option>;
              return null;
            })
          );
        } else {
          setSelectOptions([
            <option key={studentData.student.id}>
              {studentData.student.schoolName}
            </option>,
          ]);
        }

        setStudent(studentData.student);
        setIsComing(studentData.student.isComing);
      } catch (error) {}
    };
    fetchStudent();
  }, [sendRequest, stdId, authCtx.token, authCtx.userInfo.role]);

  const formHandler = async (e) => {
    e.preventDefault();
    const updatedStudent = {
      name: formState.inputs.name.value + " " + formState.inputs.surname.value,
      age: formState.inputs.age.value,
      bloodType: formState.inputs.bloodType.value,
      schoolName: formState.inputs.schoolName.value,
      alergies: formState.inputs.alergies.value.split(","),
      knownDiseases: formState.inputs.knownDiseases.value.split(","),
      isComing,
    };
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/students/${stdId}`,
        "PATCH",
        JSON.stringify(updatedStudent),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (error) {}

    history.push("/students");
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {student && (
        <>
          <form onSubmit={formHandler} className={styles.studentForm}>
            <div className={styles.name}>
              <Input
                id="name"
                label="Student Name"
                type="text"
                placeholder="Enter the students' name"
                errorText="Name Field can't be empty !"
                onInputChange={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={student.name.split(" ")[0]}
                initialValid={true}
              />
            </div>
            <div className={styles.surname}>
              <Input
                id="surname"
                label="Student Surname"
                type="text"
                placeholder="Enter the students' surname"
                errorText="Surname Field can't be empty !"
                onInputChange={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={student.name.split(" ")[1]}
                initialValid={true}
              />
            </div>
            <div className={styles.age}>
              <Input
                id="age"
                label="Student Age"
                type="number"
                placeholder="Enter the students' name"
                errorText="Age must be between 5 - 25!"
                onInputChange={inputHandler}
                validators={[VALIDATOR_MIN(5), VALIDATOR_MAX(25)]}
                initialValue={student.age}
                initialValid={true}
              />
            </div>
            <div className={styles.bloodType}>
              <Input
                id="bloodType"
                label="Blood Type"
                type="text"
                placeholder="Enter the students' blood type"
                errorText="Blood Type Field can't be empty !"
                onInputChange={inputHandler}
                validators={[VALIDATOR_REQUIRE()]}
                initialValue={student.bloodType}
                initialValid={true}
              />
            </div>
            <div className={styles.schoolName}>
              <Input
                id="schoolName"
                element="select"
                options={selectOptions}
                label="School Name"
                type="text"
                disabled={authCtx.userInfo.role === "admin" ? false : true}
                errorText="Please pick a school name"
                initialValue={student.schoolName}
                initialValid={true}
                defaultText={
                  selectOptions.filter((option) => option !== null).length !== 0
                    ? "Please pick a school"
                    : "No available bus"
                }
                onInputChange={inputHandler}
                validators={[VALIDATOR_REQUIRE_SELECT()]}
              />
            </div>

            <div className={styles.alergies}>
              <Input
                id="alergies"
                label="Alergies"
                type="text"
                placeholder="Enter the students' alergies"
                errorText=""
                onInputChange={inputHandler}
                validators={[]}
                initialValue={student.alergies.join(",")}
                initialValid={true}
              />
            </div>
            <div className={styles.knownDiseases}>
              <Input
                id="knownDiseases"
                label="Known Diseases"
                type="text"
                placeholder="Enter the students' known diseases"
                errorText=""
                onInputChange={inputHandler}
                validators={[]}
                initialValue={student.knownDiseases.join(",")}
                initialValid={true}
              />
            </div>
            <div className={styles.profilePic}>
              {/* <Avatar style={{ backgroundColor: "white", marginTop: "1rem" }}>
                <img
                  src={`http://localhost:5000/${student.image}`}
                  style={{ borderRadius: "5%" }}
                  alt="profile"
                />
              </Avatar> */}
              <Card image={student.image} />
            </div>
            <div className={styles.emergencyContacts}>
              <strong>Emergency Contacts</strong>
              <div className={styles.contacts}>
                <Button onClick={openContactsHandler} large warning>
                  <FontAwesomeIcon icon={faAddressCard} />
                </Button>
              </div>
            </div>

            <div className={styles.viewOnMap}>
              {student.isOnTheBus && (
                <>
                  <strong>View On Map</strong>
                  <div className={styles.map}>
                    <Button success onClick={openMapHandler} large warning>
                      <FontAwesomeIcon icon={faMapLocation} />
                    </Button>
                  </div>
                </>
              )}
              {!student.isOnTheBus && student.wasOnTheBus && (
                <p style={{ color: "red", cursor: "default" }}>
                  *Child is not in the Bus
                </p>
              )}
              {!student.isOnTheBus && !student.wasOnTheBus && (
                <p style={{ color: "red", cursor: "default" }}>
                  *Bus session not started
                </p>
              )}
            </div>
            <div className={styles.isComing}>
              <Toggle
                studentStatus={isComing}
                label={"Is Coming"}
                onChange={() => {
                  setIsComing((prev) => !prev);
                }}
              />
            </div>
            <div className={styles.btn}>
              <Button to="/students" success large>
                Back to students
              </Button>

              <Button invert large type="submit">
                Update Changes
              </Button>
              {authCtx.userInfo.role === "admin" && (
                <Button
                  onClick={openNotificationHandler}
                  danger
                  large
                  type="button"
                >
                  Delete Student
                </Button>
              )}
            </div>
          </form>

          <Modal
            show={showContacts}
            onClick={closeContactsHandler}
            header="Emergency Contacts"
            footer={
              <Button medium onClick={closeContactsHandler}>
                Close
              </Button>
            }
          >
            <div className={styles.modalContacts}>
              {student.emergencyContacts.map((contact) => (
                <div key={contact.name} className={styles.modalContact}>
                  <div>Name : {contact.name}</div>
                  <div>Relation : {contact.howRelated}</div>
                  <div>Phone Number : {contact.phoneNumber}</div>
                </div>
              ))}
            </div>
          </Modal>
          <Modal
            show={showNotification}
            onClick={closeNotificationHandler}
            header="Delete Student Info"
            footer={
              <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                <Button onClick={closeNotificationHandler}>Close</Button>
                <Button danger onClick={deleteStudentHandler}>
                  Delete
                </Button>
              </div>
            }
          >
            <p>
              Are you sure you want to delete this student information ?
              Deletion cannot be undone!
            </p>
          </Modal>
          <Modal
            show={showMap}
            onClick={closeMapHandler}
            header="Map Info"
            footer={
              <div>
                <Button onClick={closeMapHandler}>Close</Button>
              </div>
            }
          >
            <Map
              center={{
                lat: Number(student.location.lat),
                lng: Number(student.location.lng),
              }}
              zoom={15}
            />
          </Modal>
        </>
      )}
    </>
  );
};

export default StudentDetails;
