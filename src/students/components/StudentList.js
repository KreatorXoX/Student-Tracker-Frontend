import StudentAvatar from "./StudentAvatar";
import { useSearch } from "../../shared/context/searchStore";
import SearchBar from "../../shared/components/UI-Elements/SearchBar";

import styles from "./StudentList.module.css";

const StudentList = ({ students }) => {
  const search = useSearch((state) => state.search);

  return (
    <>
      <SearchBar />
      <div className={styles.stdList}>
        {students
          ?.filter((student) =>
            student.name?.toLowerCase().includes(search.toLowerCase())
          )
          .map((std) => (
            <StudentAvatar
              key={std.id}
              id={std.id}
              name={std.name}
              stdImg={std.image?.url}
            />
          ))}
      </div>
    </>
  );
};

export default StudentList;
