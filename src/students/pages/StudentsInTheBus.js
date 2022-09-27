import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";

import BusStudent from "../components/BusStudent";

import { AuthContext } from "../../shared/context/auth-context";
import { SessContext } from "../../shared/context/sess-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UI-Elements/Modal";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import "./StudentsInTheBus.css";

const StudentsInTheBus = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [openModal, setOpenModal] = useState(false);

  const history = useHistory();
  const sessCtx = useContext(SessContext);
  const authCtx = useContext(AuthContext);

  const endSessionHandler = async () => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/sessions/`,
        "POST",
        JSON.stringify({
          date: sessCtx.date,
          students: sessCtx.students,
          schoolName: sessCtx.schoolName,
          busDriver: sessCtx.busDriver,
          busId: sessCtx.busId,
          studentHandler: sessCtx.studentHandler,
          employeeId: sessCtx.employeeId,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
      setOpenModal(true);
    } catch (error) {}

    localStorage.removeItem("session-info");
  };

  const closeModalHandler = () => {
    setOpenModal(false);
    sessCtx.endSess();
    history.replace(`/user/${sessCtx.employeeId}`);
  };
  return (
    <>
      <Modal
        show={openModal}
        header={"Session Ended"}
        footer={
          <Button style={{ padding: "1em 2em" }} onClick={closeModalHandler}>
            OK
          </Button>
        }
      />
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner asOverlay />}
      {!isLoading && (
        <div className="attendanceList">
          <div className="wrapper">
            {sessCtx.students.map((std) => (
              <BusStudent
                key={std.id}
                id={std.id}
                name={std.name}
                image={std.image}
                isOnTheBus={std.isOnTheBus}
              />
            ))}
          </div>
          <div className="attendanceAction">
            <Button
              style={{ padding: "1em 2em", fontSize: "1rem" }}
              danger
              onClick={endSessionHandler}
            >
              End Session
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StudentsInTheBus;
