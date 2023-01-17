import React from "react";

import BusList from "../components/BusList";
import { useGetBuses } from "../../api/busesApi";

import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import styles from "./Buses.module.css";

const Buses = () => {
  const { data, isLoading, isSuccess, isFetching, error, isError } =
    useGetBuses();

  return (
    <>
      {isError && <ErrorModal error={error} />}
      <div className={styles.layout}>
        <div className={styles.addNew}>
          <Button success large to="/bus/new">
            Add New Bus
          </Button>
        </div>
        {(isFetching || isLoading) && <LoadingSpinner asOverlay />}
        {isSuccess && (
          <div className={styles.list}>
            <BusList buses={data.buses} />
          </div>
        )}
      </div>
    </>
  );
};

export default Buses;
