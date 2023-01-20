import React from "react";
import BusAvatar from "./BusAvatar";

import { useGetBuses } from "../../api/busesApi";

import { useSearch } from "../../shared/context/searchStore";
import SearchBar from "../../shared/components/UI-Elements/SearchBar";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import styles from "./BusList.module.css";

const BusList = () => {
  const search = useSearch((state) => state.search);
  const { data, isLoading, isSuccess, isFetching } = useGetBuses();

  let content;

  if (isLoading || isFetching) content = <LoadingSpinner asOverlay />;
  if (isSuccess)
    content = (
      <div className={styles.busList}>
        {data.buses
          ?.filter((bus) =>
            bus.schoolName?.toLowerCase().includes(search.toLowerCase())
          )
          .map((bus) => (
            <BusAvatar key={bus.id} id={bus.id} schoolName={bus.schoolName} />
          ))}
      </div>
    );

  return (
    <>
      <div className={styles.searchBar}>
        <SearchBar />
      </div>
      {content}
    </>
  );
};

export default BusList;
