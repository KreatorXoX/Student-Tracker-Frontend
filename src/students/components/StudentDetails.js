import React, { useEffect, useState } from "react";
import { useParams, useHistory } from "react-router-dom";

import { useGetStudent } from "../../api/studentApi";
import { useDeleteStudent } from "../../api/studentApi";
import { useUpdateStudent } from "../../api/studentApi";
import { useGetBuses } from "../../api/busesApi";

import { useAuth } from "../../shared/context/authStore";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Toggle from "../../shared/components/FormElements/Toggle";
import Map from "../../shared/components/UI-Elements/Map";
import Card from "../../shared/components/UI-Elements/Card";
import Modal from "../../shared/components/UI-Elements/Modal";
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
  const [isComing, setIsComing] = useState(true);
  const history = useHistory();
  const stdId = useParams().stdId;
  const role = useAuth((state) => state.role);

  const {
    data: studentData,
    isLoading: isLoadingStudent,
    isSuccess: isSuccessStudent,
  } = useGetStudent(stdId);

  const { data: busesData, isSuccess: isSuccessBus } = useGetBuses();

  const { mutateAsync: deleteStudent } = useDeleteStudent();
  const { mutateAsync: updateStudent } = useUpdateStudent();

  const [formState, inputHandler] = useForm(studentInitial, false);

  const [showContacts, setShowContacts] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showNotification, setNotification] = useState(false);

  const openContactsHandler = () => setShowContacts(true);
  const closeContactsHandler = () => setShowContacts(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  const openNotificationHandler = () => setNotification(true);
  const closeNotificationHandler = () => setNotification(false);

  const deleteStudentHandler = async () => {
    await deleteStudent(stdId, {
      onSuccess: () => {
        history.push("/students");
      },
    });
    setNotification(false);
  };

  let busesOptions;
  useEffect(() => {
    if (studentData?.student) {
      setIsComing(studentData.student.isComing);
    }
  }, [studentData]);
  if (isSuccessStudent && isSuccessBus) {
    if (role === "admin") {
      busesOptions = busesData?.buses.map((bus) => (
        <option key={bus.id}>{bus.schoolName}</option>
      ));
    } else {
      busesOptions = [
        <option key={studentData.student.id}>
          {studentData.student.schoolName}
        </option>,
      ];
    }
  }

  const formHandler = async (e) => {
    e.preventDefault();
    const updateData = {
      id: stdId,
      name: formState.inputs.name.value + " " + formState.inputs.surname.value,
      age: formState.inputs.age.value,
      bloodType: formState.inputs.bloodType.value,
      schoolName: formState.inputs.schoolName.value,
      alergies: formState.inputs.alergies.value.split(","),
      knownDiseases: formState.inputs.knownDiseases.value.split(","),
      isComing: isComing,
    };

    await updateStudent(updateData, {
      onSuccess: () => {
        history.push("/students");
      },
    });
  };

  return (
    <>
      {isLoadingStudent && <LoadingSpinner asOverlay />}
      {isSuccessStudent && (
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
                initialValue={studentData.student.name.split(" ")[0]}
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
                initialValue={studentData.student.name.split(" ")[1]}
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
                initialValue={studentData.student.age}
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
                initialValue={studentData.student.bloodType}
                initialValid={true}
              />
            </div>
            <div className={styles.schoolName}>
              <Input
                id="schoolName"
                element="select"
                options={busesOptions}
                label="School Name"
                type="text"
                disabled={role === "admin" ? false : true}
                errorText="Please pick a school name"
                initialValue={studentData.student.schoolName}
                initialValid={true}
                defaultText={
                  busesOptions
                    ? busesOptions.filter((option) => option !== null)
                        .length !== 0
                      ? "Please pick a school"
                      : "No available bus"
                    : studentData?.student.schoolName
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
                initialValue={studentData.student.alergies.join(",")}
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
                initialValue={studentData.student.knownDiseases.join(",")}
                initialValid={true}
              />
            </div>
            <div className={styles.profilePic}>
              <Card image={studentData.student.image || ""} />
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
              {studentData.student.isOnTheBus && (
                <>
                  <strong>View On Map</strong>
                  <div className={styles.map}>
                    <Button success onClick={openMapHandler} large warning>
                      <FontAwesomeIcon icon={faMapLocation} />
                    </Button>
                  </div>
                </>
              )}
              {!studentData.student.isOnTheBus &&
                studentData.student.wasOnTheBus && (
                  <p style={{ color: "red", cursor: "default" }}>
                    *Child left the bus!
                  </p>
                )}
              {!studentData.student.isOnTheBus &&
                !studentData.student.wasOnTheBus && (
                  <p style={{ color: "red", cursor: "default" }}>
                    *Bus session not started
                  </p>
                )}
            </div>
            <div className={styles.isComing}>
              <Toggle
                checked={isComing}
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
              {role === "admin" && (
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
              {studentData.student.emergencyContacts.map((contact) => (
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
                lat: Number(studentData.student.location.lat),
                lng: Number(studentData.student.location.lng),
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
