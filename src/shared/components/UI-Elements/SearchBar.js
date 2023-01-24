import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useSearch } from "../../context/searchStore";

import styles from "./SearchBar.module.css";

const SearchBar = ({ placeholder }) => {
  const setSearch = useSearch((state) => state.setSearch);
  return (
    <form className={styles.search}>
      <input
        className={styles["search__input"]}
        type="text"
        id="search"
        placeholder={placeholder ? placeholder : "Search by Name"}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <span className={styles["search__action"]}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </span>
    </form>
  );
};

export default SearchBar;
