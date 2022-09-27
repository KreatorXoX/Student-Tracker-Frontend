import React, { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import StudentList from "../components/StudentList";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import styles from "./Students.module.css";

const Students = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [students, setStudents] = useState();
  const authCtx = useContext(AuthContext);
  const location = useLocation();

  let fetchId;
  let fetchRole;

  const pathArray = location.pathname.split("/");

  if (pathArray.length > 2) {
    fetchId = pathArray[3];
    fetchRole = pathArray[2];
  }

  useEffect(() => {
    const fetchStudents = async () => {
      let whichStudents;
      if (authCtx.userInfo.role === "parent") {
        whichStudents = `parent/${authCtx.userInfo.id}`;
      }

      if (authCtx.userInfo.role === "employee") {
        whichStudents = `bus/${authCtx.userInfo.busId}`;
      }

      if (authCtx.userInfo.role === "admin") {
        if (fetchRole === "bus") {
          whichStudents = `bus/${fetchId}`;
        } else if (fetchRole === "parent") {
          whichStudents = `parent/${fetchId}`;
        } else {
          whichStudents = "";
        }
      }

      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/students/${whichStudents}`,
          "GET",
          null,
          { Authorization: "Bearer " + authCtx.token }
        );

        setStudents(data.students);
      } catch (error) {}
    };
    fetchStudents();
  }, [sendRequest, authCtx.userInfo, authCtx.token, fetchId, fetchRole]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className={styles.layout}>
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && !error && students && (
          <div className={styles.list}>
            <StudentList students={students} />
          </div>
        )}
      </div>
    </>
  );
};
export default Students;
