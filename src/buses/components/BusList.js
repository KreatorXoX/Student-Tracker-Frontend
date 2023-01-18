import React from "react";

import BusAvatar from "./BusAvatar";
import { useGetBuses } from "../../api/busesApi";
import { useSearch } from "../../shared/hooks/search-hook";

import SearchBar from "../../shared/components/UI-Elements/SearchBar";

import styles from "./BusList.module.css";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const BusList = () => {
  const { data, isLoading } = useGetBuses();

  // implement searchbar using zustand store!!
  const { searchState, busHandler } = useSearch(data.buses);

  if (!data.buses || data.buses.length === 0) {
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
        {isLoading && <LoadingSpinner asOverlay />}
        {data.buses.length === 0 && <p>No Results</p>}
        {data.buses.map((bus) => (
          <BusAvatar key={bus.id} id={bus.id} schoolName={bus.schoolName} />
        ))}
      </div>
    </>
  );
};

export default BusList;
