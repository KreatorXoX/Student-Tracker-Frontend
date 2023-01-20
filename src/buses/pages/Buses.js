import React from "react";

import BusList from "../components/BusList";

import Button from "../../shared/components/FormElements/Button";

import styles from "./Buses.module.css";

const Buses = () => {
  return (
    <>
      <div className={styles.layout}>
        <div className={styles.addNew}>
          <Button success large to="/bus/new">
            Add New Bus
          </Button>
        </div>
        <div className={styles.list}>
          <BusList />
        </div>
      </div>
    </>
  );
};

export default Buses;
