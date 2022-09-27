import React, { useState, useEffect, useContext } from "react";

import BusList from "../components/BusList";

import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import styles from "./Buses.module.css";

const Buses = () => {
  const authCtx = useContext(AuthContext);
  const [loadedBuses, setLoadedBuses] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const data = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/buses/`,
          "GET",
          null,
          { Authorization: "Bearer " + authCtx.token }
        );
        setLoadedBuses(data.buses);
      } catch (error) {}
    };

    fetchBuses();
  }, [sendRequest, authCtx.token]);

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div className={styles.layout}>
        <div className={styles.addNew}>
          <Button success large to="/bus/new">
            Add New Bus
          </Button>
        </div>
        {isLoading && <LoadingSpinner asOverlay />}
        {!isLoading && (
          <div className={styles.list}>
            <BusList buses={loadedBuses} />
          </div>
        )}
      </div>
    </>
  );
};

export default Buses;
