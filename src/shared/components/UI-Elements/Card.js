import React from "react";

import styles from "./Card.module.css";

const Card = (props) => {
  return (
    <div className={styles.card} style={props.style}>
      <div className={styles.cardImage}>
        <img src={props.image} alt="student" />
      </div>
      <div className={styles.cardName}>
        <p>{props.name}</p>
      </div>
      <div className={styles.cardDescription}>{props.description || null}</div>
      <div className={styles.cardActions}>{props.actions || null}</div>
    </div>
  );
};

export default Card;
