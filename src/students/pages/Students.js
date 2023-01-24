import React from "react";
import { useLocation } from "react-router-dom";

import StudentList from "../components/StudentList";

import { useGetStudents } from "../../api/studentApi";
import { useAuthStore } from "../../shared/context/authStore";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import styles from "./Students.module.css";

const Students = () => {
  const userInfo = useAuthStore((state) => state.userInfo);
  const location = useLocation();

  let fetchId;
  let fetchBy;

  const pathArray = location.pathname.split("/");

  if (pathArray.length > 2) {
    fetchId = pathArray[3];
    fetchBy = pathArray[2];
  }

  if (userInfo.role === "parent") {
    fetchBy = userInfo.role;
    fetchId = userInfo.id;
  }

  const { data, isLoading, isSuccess } = useGetStudents(fetchBy, fetchId);

  return (
    <>
      <div className={styles.layout}>
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && isSuccess && (
          <div className={styles.list}>
            <StudentList students={data.students} />
          </div>
        )}
      </div>
    </>
  );
};
export default Students;
