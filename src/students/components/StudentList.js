import StudentAvatar from "./StudentAvatar";

import { useSearch } from "../../shared/hooks/search-hook";

import SearchBar from "../../shared/components/UI-Elements/SearchBar";

import styles from "./StudentList.module.css";

const StudentList = ({ students }) => {
  const { searchState, studentHandler } = useSearch(students);

  if (!students || students.length === 0) {
    return (
      <div>
        <h2 style={{ color: "white" }}>
          No students Found! You can create one
        </h2>
      </div>
    );
  }
  return (
    <>
      <SearchBar onInputChange={studentHandler} />
      <div className={styles.stdList}>
        {searchState.searchedData.length === 0 && <p>No Results</p>}
        {searchState.searchedData.map((std) => (
          <StudentAvatar
            key={std.id}
            id={std.id}
            name={std.name}
            stdImg={std.image}
          />
        ))}
      </div>
    </>
  );
};

export default StudentList;
