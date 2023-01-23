import React from "react";

import UserAvatar from "./UserAvatar";
import { useSearch } from "../../shared/context/searchStore";
import SearchBar from "../../shared/components/UI-Elements/SearchBar";
import { useGetUsersByRole } from "../../api/usersApi";

import styles from "./UserList.module.css";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const UserList = ({ role }) => {
  const { data, isSuccess, isLoading } = useGetUsersByRole(role);
  const search = useSearch((state) => state.search);

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <SearchBar />
      <div className={styles.userlist}>
        {isSuccess &&
          data?.users
            ?.filter((user) =>
              user.name.toLowerCase().includes(search.toLowerCase())
            )
            .map((user) => (
              <UserAvatar
                key={user.id}
                id={user.id}
                name={user.name}
                image={user.image.url}
              />
            ))}
      </div>
    </>
  );
};

export default UserList;
