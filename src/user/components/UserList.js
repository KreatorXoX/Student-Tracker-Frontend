import React from "react";

import UserAvatar from "./UserAvatar";

import { useSearch } from "../../shared/hooks/search-hook";

import SearchBar from "../../shared/components/UI-Elements/SearchBar";

import styles from "./UserList.module.css";

const UserList = ({ users }) => {
  const { searchState, userHandler } = useSearch(users);

  if (!users || users.length === 0) {
    return (
      <div>
        <h2 style={{ color: "white" }}>No users Found! You can create one</h2>
      </div>
    );
  }
  return (
    <>
      <SearchBar onInputChange={userHandler} />
      <div className={styles.userlist}>
        {searchState.searchedData.length === 0 && <p>No Results</p>}
        {searchState.searchedData.map((user) => (
          <UserAvatar
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
          />
        ))}
      </div>
    </>
  );
};

export default UserList;
