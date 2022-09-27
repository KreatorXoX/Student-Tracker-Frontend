import React from "react";

import BusAvatar from "./BusAvatar";

import { useSearch } from "../../shared/hooks/search-hook";

import SearchBar from "../../shared/components/UI-Elements/SearchBar";

import styles from "./BusList.module.css";

const BusList = ({ buses }) => {
  const { searchState, busHandler } = useSearch(buses);

  if (!buses || buses.length === 0) {
    return (
      <div>
        <h2 style={{ color: "white" }}>No Buses Found! You can create one</h2>
      </div>
    );
  }
  return (
    <>
      <div className={styles.searchBar}>
        <SearchBar onInputChange={busHandler} />
      </div>
      <div className={styles.busList}>
        {searchState.searchedData.length === 0 && <p>No Results</p>}
        {searchState.searchedData.map((bus) => (
          <BusAvatar key={bus.id} id={bus.id} schoolName={bus.schoolName} />
        ))}
      </div>
    </>
  );
};

export default BusList;
