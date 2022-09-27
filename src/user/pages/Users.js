import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";

import UserList from "../components/UserList";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";

import styles from "./Users.module.css";

const Users = () => {
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [users, setUsers] = useState();
  const { role } = useParams();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/byRole/${role}`,
          "GET",
          null,
          { Authorization: "Bearer " + authCtx.token }
        );
        setUsers(data.users);
      } catch (error) {
        setUsers();
      }
    };

    fetchUsers();
  }, [sendRequest, role, authCtx.token]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className={styles.layout}>
        {isLoading && <LoadingSpinner asOverlay />}
        <>
          {authCtx.userInfo.role === "admin" && (
            <div className={styles.addNew}>
              <Button success mid to="/user/new">
                Add New User
              </Button>
            </div>
          )}
          <div className={styles.list}>
            {!isLoading && <UserList users={users} />}
          </div>
        </>
      </div>
    </>
  );
};

export default Users;
