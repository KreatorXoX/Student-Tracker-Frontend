import React, { useState, useContext, useEffect } from "react";

import { useStudentStatus, useStudentLocation } from "../../api/studentApi";

import { SessContext } from "../../shared/context/sess-context";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI-Elements/Card";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const BusStudent = ({ name, id, image, isOnTheBus }) => {
  const sessCtx = useContext(SessContext);

  const [presence, setPresence] = useState(isOnTheBus);

  const { mutateAsync: updatePresence, isLoading: statusIsLoading } =
    useStudentStatus();
  const { mutateAsync: updateLocation, isLoading: locationIsLoading } =
    useStudentLocation();

  const presenceHandler = async (state) => {
    await updatePresence({ id, state });

    sessCtx.changePresenceHandler(id, state);

    setPresence(state);
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
      const data = {
        id: id,
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        },
      };

      await updateLocation(data);
    };

    return () => clearInterval(sendLocation);
  }, [sessCtx.isActive, presence, id, updateLocation]);

  return (
    <div>
      {(statusIsLoading || locationIsLoading) && <LoadingSpinner />}
      {!statusIsLoading && !statusIsLoading && (
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
