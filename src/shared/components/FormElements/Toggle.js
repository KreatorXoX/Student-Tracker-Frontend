import React from "react";

import styles from "./Toggle.module.css";

const Toggle = ({ label, onChange, studentStatus }) => {
  return (
    <div className={styles.container}>
      <h3>{label}</h3>
      <div className={styles["toggle-switch"]}>
        <input
          type="checkbox"
          className={styles.checkbox}
          name={label}
          id={label}
          checked={studentStatus}
          onChange={onChange}
        />
        <label className={styles.label} htmlFor={label}>
          <span className={styles.inner} />
          <span className={styles.switch} />
        </label>
      </div>
    </div>
  );
};

export default Toggle;
