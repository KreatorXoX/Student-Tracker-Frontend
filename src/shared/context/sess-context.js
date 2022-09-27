import { createContext } from "react";

export const SessContext = createContext({
  isActive: false,
  students: [],
  schoolName: "",
  busDriver: "",
  studentHandler: "",
  date: "",
  employeeId: "",
  busId: "",
  startSess: (
    isActive,
    students,
    schoolName,
    busDriver,
    studentHandler,
    date,
    employeeId,
    busId
  ) => {},
  endSess: () => {},
  changePresenceHandler: (id, state) => {},
});
