import React from "react";

import styles from "./Toggle.module.css";

const Toggle = ({ label, onChange, checked }) => {
  return (
    <div className={styles.container}>
      <h3>{label}</h3>
      <div className={styles["toggle-switch"]}>
        <input
          type="checkbox"
          className={styles.checkbox}
          id={label}
          name={label}
          onChange={onChange}
          checked={checked}
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
