import React from "react";
import { useHistory } from "react-router-dom";

import BusStudent from "../components/BusStudent";

import { usePostSession } from "../../api/busesApi";

import { useSessionStore } from "../../shared/context/sessionStore";
import { useAuthStore } from "../../shared/context/authStore";
import Button from "../../shared/components/FormElements/Button";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import "./StudentsInTheBus.css";

const StudentsInTheBus = () => {
  const { mutateAsync: postSession, isLoading } = usePostSession();

  const history = useHistory();
  const userInfo = useAuthStore((state) => state.userInfo);
  const endSession = useSessionStore((state) => state.endSession);
  const sessionInfo = useSessionStore((state) => state.sessionInfo);

  const endSessionHandler = async () => {
    const sessionData = {
      date: sessionInfo.date,
      students: sessionInfo.students,
      schoolName: sessionInfo.schoolName,
      busDriver: sessionInfo.busDriver,
      busId: sessionInfo.busId,
      studentHandler: sessionInfo.studentHandler,
      employeeId: sessionInfo.employeeId,
    };

    await postSession(sessionData, {
      onSuccess: () => {
        endSession();
        history.replace(`/user/${userInfo.id}`);
      },
    });
  };

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      {
        <div className="attendanceList">
          <div className="wrapper">
            {sessionInfo.students?.map((std) => (
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
