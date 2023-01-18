import React, { useContext } from "react";

import Bus from "./assets/images/bus.png";

import { useAuth } from "./shared/context/authStore";
import { SessContext } from "./shared/context/sess-context";

import Button from "./shared/components/FormElements/Button";

import styles from "./HomePage.module.css";
const HomePage = () => {
  const isLoggedIn = useAuth((state) => state.isAuthenticated);
  const sessCtx = useContext(SessContext);

  return (
    <div className={styles.homePage}>
      <div className={styles.content1}>
        <div>
          <h3>
            Student{" "}
            <span className={styles.nobreak}>
              <span className={styles.color}>Tracker</span> App
            </span>
          </h3>
        </div>
        <div>
          <p>
            Many desktop publishing packages and web page editors now use Lorem
            Ipsum as their default model text, and a search for 'lorem ipsum'
            will uncover many web sites still in their infancy. Various versions
            have evolved over the years, sometimes by accident, sometimes on
            purpose (injected humour and the like).
          </p>
        </div>
        {!isLoggedIn && (
          <div className={styles.actions}>
            <Button to="/auth">Login/Register</Button>
          </div>
        )}
        {sessCtx.isActive && (
          <div className={styles.actions}>
            <Button to="/start">Go to Session</Button>
          </div>
        )}
      </div>
      <div className={styles.content2}>
        <img src={Bus} alt="bus" width={250} height={250} />
      </div>
    </div>
  );
};

export default HomePage;
