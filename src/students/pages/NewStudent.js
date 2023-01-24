import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";

import { useGetBuses } from "../../api/busesApi";
import { useCreateStudent } from "../../api/studentApi";

import { useForm } from "../../shared/hooks/form-hook";
import Input from "../../shared/components/FormElements/Input";
import ImageUpload from "../../shared/components/FormElements/ImageUpload";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UI-Elements/Modal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";
import { studentInitial } from "../../shared/util/formInitials/studentFormInitial";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_REQUIRE_SELECT,
  VALIDATOR_MIN,
  VALIDATOR_MAX,
} from "../../shared/util/validators";

import styles from "./NewStudent.module.css";

const NewStudent = () => {
  const parentId = useParams().parentId;
  const history = useHistory();
  const [formState, inputHandler] = useForm(studentInitial, false);

  const [diseases, setDiseases] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [alergies, setAlergies] = useState([]);
  const [diseaseModal, setOpenDiseaseModal] = useState(false);
  const [contactModal, setOpenContactModal] = useState(false);
  const [alergyModal, setOpenAlergyModal] = useState(false);

  const { data, isLoading, isSuccess } = useGetBuses();
  const { mutateAsync: createStudent } = useCreateStudent();

  let busOptions;
  if (isSuccess) {
    busOptions = data?.buses.map((bus) => {
      if (bus.capacity > 0)
        return <option key={bus.id}>{bus.schoolName}</option>;
      return null;
    });
  }

  const formHandler = async (e) => {
    e.preventDefault();

    const studentData = {
      name: formState.inputs.name.value + " " + formState.inputs.surname.value,
      image: formState.inputs.image.value,
      schoolName: formState.inputs.schoolName.value,
      age: formState.inputs.age.value,
      bloodType: formState.inputs.bloodType.value,
      alergies: alergies,
      knownDiseases: diseases,
      emergencyContacts: contacts,
    };

    await createStudent(
      { parentId, studentData },
      {
        onSuccess: () => {
          history.push("/students");
        },
      }
    );
  };

  const addDiseaseHandler = () => {
    setOpenDiseaseModal(true);
  };
  const addContactHandler = () => {
    setOpenContactModal(true);
  };
  const addAlergyHandler = () => {
    setOpenAlergyModal(true);
  };

  const closeModalHandler = () => {
    setOpenDiseaseModal(false);
    setOpenContactModal(false);
    setOpenAlergyModal(false);
  };

  const diseaseSubmitHandler = (e) => {
    e.preventDefault();
    const dis = [...diseases, formState.inputs.knownDisease.value];
    setDiseases(dis);
    setOpenDiseaseModal(false);
  };

  const contactSubmitHandler = (e) => {
    e.preventDefault();
    const newContact = {
      name:
        formState.inputs.contactName.value +
        " " +
        formState.inputs.contactSurname.value,
      howRelated: formState.inputs.contactRelation.value,
      phoneNumber: formState.inputs.contactPhoneNumber.value,
    };

    const cont = [...contacts, newContact];
    setContacts(cont);
    setOpenContactModal(false);
  };

  const alergySubmitHandler = (e) => {
    e.preventDefault();
    console.log(formState.inputs.alergy);
    const alg = [...alergies, formState.inputs.alergy.value];
    setAlergies(alg);
    setOpenAlergyModal(false);
  };

  const deleteAlergyHandler = (alergy) => {
    setAlergies((prev) => {
      return prev.filter((curAlergy) => curAlergy !== alergy);
    });
  };
  const deleteDiseaseHandler = (disease) => {
    setDiseases((prev) => {
      return prev.filter((curDisease) => curDisease !== disease);
    });
  };
  const deleteContactHandler = (contact) => {
    setContacts((prev) => {
      return prev.filter((curContact) => curContact !== contact);
    });
  };
  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <form onSubmit={formHandler} className={styles.studentForm}>
          <div className={styles.profilePic}>
            <ImageUpload
              id="image"
              onInputChange={inputHandler}
              errorText="Supported extensions are : .jpg, .png, .jpeg"
            />
          </div>
          <div className={styles.name}>
            <Input
              id="name"
              label="Student Name"
              type="text"
              placeholder="Enter the student's name"
              errorText="Name Field can't be empty !"
              onInputChange={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          </div>
          <div className={styles.surname}>
            <Input
              id="surname"
              label="Student Surname"
              type="text"
              placeholder="Enter the student's surname"
              errorText="Surname Field can't be empty !"
              onInputChange={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          </div>
          <div className={styles.schoolName}>
            <Input
              id="schoolName"
              element="select"
              options={busOptions}
              label="School Name"
              type="text"
              placeholder="Enter the School Name"
              errorText="Please pick a school name"
              defaultText={
                busOptions.filter((option) => option !== null).length !== 0
                  ? "Please pick a school"
                  : "No available bus"
              }
              onInputChange={inputHandler}
              validators={[VALIDATOR_REQUIRE_SELECT()]}
            />
          </div>
          <div className={styles.age}>
            <Input
              id="age"
              label="Student Age"
              type="number"
              placeholder="Enter the student's age"
              errorText="Age must be between 3 - 100"
              onInputChange={inputHandler}
              validators={[VALIDATOR_MIN(3), VALIDATOR_MAX(101)]}
            />
          </div>
          <div className={styles.bloodType}>
            <Input
              id="bloodType"
              label="Student Blood Type"
              type="text"
              placeholder="Enter the student's blood type"
              errorText="Blood type Field can't be empty !"
              onInputChange={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
          </div>
          <div className={styles.alergies}>
            <h3>Alergies</h3>
            <ul className="alergies">
              {alergies.map((alergy) => (
                <li key={alergy}>
                  {alergy}{" "}
                  <FontAwesomeIcon
                    className={styles.icon}
                    style={{ color: "red" }}
                    icon={faMinusCircle}
                    onClick={deleteAlergyHandler.bind(null, alergy)}
                  />
                </li>
              ))}
            </ul>
            <Button onClick={addAlergyHandler} type="button">
              Add Alergy +
            </Button>
          </div>
          <div className={styles.diseases}>
            <h3>Diseases</h3>
            <ul className="diseases">
              {diseases.map((disease) => (
                <li key={disease}>
                  {disease}{" "}
                  <FontAwesomeIcon
                    className={styles.icon}
                    style={{ color: "red" }}
                    icon={faMinusCircle}
                    onClick={deleteDiseaseHandler.bind(null, disease)}
                  />
                </li>
              ))}
            </ul>
            <Button onClick={addDiseaseHandler} type="button">
              Add Disease +
            </Button>
          </div>
          <div className={styles.contacts}>
            <h3>Contacts</h3>
            <ul className="contacts">
              {contacts.map((contact) => (
                <li key={contact.name}>
                  {contact.name + " "}
                  <FontAwesomeIcon
                    className={styles.icon}
                    style={{ color: "red" }}
                    icon={faMinusCircle}
                    onClick={deleteContactHandler.bind(null, contact)}
                  />
                </li>
              ))}
            </ul>
            <Button onClick={addContactHandler} type="button">
              Add Contact +
            </Button>
          </div>
          <div className={styles.btn}>
            <Button disabled={!formState.isValid} success mid type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
      <Modal
        show={alergyModal}
        onClick={closeModalHandler}
        header={"Add New Alergy"}
        onSubmit={alergySubmitHandler}
        footer={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button large onClick={closeModalHandler}>
              Close
            </Button>
            <Button large danger type="submit">
              Submit
            </Button>
          </div>
        }
      >
        <div>
          <Input
            id="alergy"
            label="Known Alergies"
            type="text"
            placeholder="Example: Lactose,Peanut,..."
            errorText=""
            onInputChange={inputHandler}
            validators={[]}
            initialValid={true}
          />
        </div>
      </Modal>
      <Modal
        show={diseaseModal}
        onClick={closeModalHandler}
        header={"Add New Disease"}
        onSubmit={diseaseSubmitHandler}
        footer={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button large onClick={closeModalHandler}>
              Close
            </Button>
            <Button large danger type="submit">
              Submit
            </Button>
          </div>
        }
      >
        <div>
          <Input
            id="knownDisease"
            label="Known Disease"
            type="text"
            placeholder="Example: Obesity,Asthma,..."
            errorText=""
            onInputChange={inputHandler}
            validators={[]}
            initialValid={true}
          />
        </div>
      </Modal>
      <Modal
        show={contactModal}
        onClick={closeModalHandler}
        header={"Add New Contact"}
        onSubmit={contactSubmitHandler}
        footer={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button large onClick={closeModalHandler}>
              Close
            </Button>
            <Button danger large type="submit">
              Submit
            </Button>
          </div>
        }
      >
        <div>
          <Input
            id="contactName"
            label="Name"
            type="text"
            placeholder=""
            errorText=""
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
        <div>
          <Input
            id="contactSurname"
            label="Surname"
            type="text"
            placeholder=""
            errorText=""
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
        <div>
          <Input
            id="contactRelation"
            label="How are they related ?"
            type="text"
            placeholder="Example : Mother, Grandfather..."
            errorText=""
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
        <div>
          <Input
            id="contactPhoneNumber"
            label="Phone Number"
            type="text"
            placeholder="555-555-55-55"
            errorText=""
            onInputChange={inputHandler}
            validators={[VALIDATOR_REQUIRE()]}
          />
        </div>
      </Modal>
    </>
  );
};

export default NewStudent;
