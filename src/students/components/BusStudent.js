import React, { useState, useContext, useEffect } from "react";

import { AuthContext } from "../../shared/context/auth-context";
import { SessContext } from "../../shared/context/sess-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import Card from "../../shared/components/UI-Elements/Card";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const BusStudent = ({ name, id, image, isOnTheBus }) => {
  const sessCtx = useContext(SessContext);
  const authCtx = useContext(AuthContext);
  const [presence, setPresence] = useState(isOnTheBus);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const presenceHandler = async (state) => {
    try {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/students/${id}/onTheBus`,
        "PATCH",
        JSON.stringify({ state: state }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        }
      );
    } catch (error) {}

    sessCtx.changePresenceHandler(id, state);

    if (state) {
      setPresence(true);
    } else {
      setPresence(false);
    }
  };

  useEffect(() => {
    let sendLocation;
    if (sessCtx.isActive && presence) {
      sendLocation = setInterval(async () => {
        navigator.geolocation.getCurrentPosition(successCB, (err) => {
          console.log(err);
        });
      }, 50000);
    }

    const successCB = async (position) => {
      const location = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      try {
        await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/students/${id}/location`,
          "PATCH",
          JSON.stringify(location),
          {
            "Content-Type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          }
        );
      } catch (error) {}
    };

    return () => clearInterval(sendLocation);
  }, [sessCtx.isActive, presence, id, sendRequest, authCtx.token]);

  return (
    <div>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner />}
      {!isLoading && !error && (
        <Card
          style={{ opacity: presence ? "1" : "0.4" }}
          image={image}
          name={name}
          actions={
            <>
              <Button onClick={presenceHandler.bind(null, true)}>
                Present
              </Button>

              <Button onClick={presenceHandler.bind(null, false)}>
                Absent
              </Button>
            </>
          }
        />
      )}
    </div>
  );
};

export default BusStudent;
