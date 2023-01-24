import React, { useContext } from "react";
import { useHistory } from "react-router-dom";

import BusStudent from "../components/BusStudent";

import { SessContext } from "../../shared/context/sess-context";

import Button from "../../shared/components/FormElements/Button";

import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";
import { usePostSession } from "../../api/busesApi";
import "./StudentsInTheBus.css";

const StudentsInTheBus = () => {
  const { mutateAsync: postSession, isLoading } = usePostSession();

  const history = useHistory();
  const sessCtx = useContext(SessContext);

  const endSessionHandler = async () => {
    const sessionData = {
      date: sessCtx.date,
      students: sessCtx.students,
      schoolName: sessCtx.schoolName,
      busDriver: sessCtx.busDriver,
      busId: sessCtx.busId,
      studentHandler: sessCtx.studentHandler,
      employeeId: sessCtx.employeeId,
    };
    await postSession(sessionData, {
      onSuccess: () => {
        localStorage.removeItem("session-info");
        sessCtx.endSess();
        history.replace(`/user/${sessCtx.employeeId}`);
      },
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {
        <div className="attendanceList">
          <div className="wrapper">
            {sessCtx.students?.map((std) => (
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
      }
    </>
  );
};

export default StudentsInTheBus;
