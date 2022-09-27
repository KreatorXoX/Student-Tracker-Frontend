import { useCallback, useEffect, useState } from "react";

export const useSession = () => {
  const [sessionInfo, setSessionInfo] = useState({});

  const startSessionHandler = useCallback(
    (
      isActive,
      students,
      schoolName,
      busDriver,
      studentHandler,
      date,
      employeeId,
      busId
    ) => {
      setSessionInfo({
        isActive,
        students,
        schoolName,
        busDriver,
        studentHandler,
        date,
        employeeId,
        busId,
      });
      localStorage.setItem(
        "session-info",
        JSON.stringify({
          isActive,
          students,
          schoolName,
          busDriver,
          studentHandler,
          date,
          employeeId,
          busId,
        })
      );
    },
    []
  );

  useEffect(() => {
    const storedSessionInfo = JSON.parse(localStorage.getItem("session-info"));
    if (storedSessionInfo) {
      startSessionHandler(
        storedSessionInfo.isActive,
        storedSessionInfo.students,
        storedSessionInfo.schoolName,
        storedSessionInfo.busDriver,
        storedSessionInfo.studentHandler,
        storedSessionInfo.date,
        storedSessionInfo.employeeId,
        storedSessionInfo.busId
      );
    }
  }, [startSessionHandler]);

  const endSessionHandler = () => {
    //clear isOnTheBus and wasOnTheBus in the db.
    //set session isActive to false

    setSessionInfo({});
  };

  const changePresenceHandler = (id, state) => {
    setSessionInfo((prevCtx) => {
      const students = prevCtx.students;

      for (let std of students) {
        if (std.id === id) {
          std.isOnTheBus = state;
          std.wasOnTheBus = true;
        }
      }
      return {
        ...prevCtx,
        students: students,
      };
    });
  };

  return {
    sessionInfo,
    startSession: startSessionHandler,
    endSession: endSessionHandler,
    changePresence: changePresenceHandler,
  };
};
