import React from "react";
import { useParams } from "react-router-dom";

import UserList from "../components/UserList";
import { useAuth } from "../../shared/context/authStore";
import Button from "../../shared/components/FormElements/Button";

import styles from "./Users.module.css";

const Users = () => {
  const { role } = useParams();
  const userRole = useAuth((state) => state.role);

  return (
    <>
      <div className={styles.layout}>
        <>
          {userRole === "admin" && (
            <div className={styles.addNew}>
              <Button success mid to="/user/new">
                Add New User
              </Button>
            </div>
          )}
          <div className={styles.list}>
            <UserList role={role} />
          </div>
        </>
      </div>
    </>
  );
};

export default Users;
