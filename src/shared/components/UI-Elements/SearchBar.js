import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import styles from "./SearchBar.module.css";

const SearchBar = ({ onInputChange }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  const inputChangeHandler = (e) => {
    onInputChange(e.target.value.toLowerCase());
  };

  return (
    <form className={styles.search} onSubmit={handleSubmit}>
      <input
        className={styles["search__input"]}
        type="text"
        id="search"
        onChange={inputChangeHandler}
      />
      <button className={styles["search__action"]}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
};

export default SearchBar;
