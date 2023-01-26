import React, { useState, useEffect } from "react";

import { useStudentStatus, useStudentLocation } from "../../api/studentApi";

import { useSessionStore } from "../../shared/context/sessionStore";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UI-Elements/Card";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const BusStudent = ({ name, id, image, isOnTheBus }) => {
  const sessionInfo = useSessionStore((state) => state.sessionInfo);
  const changePersence = useSessionStore((state) => state.changePersence);

  const [presence, setPresence] = useState(isOnTheBus);

  const { mutateAsync: updatePresence, isLoading: statusIsLoading } =
    useStudentStatus();
  const { mutateAsync: updateLocation, isLoading: locationIsLoading } =
    useStudentLocation();

  const presenceHandler = async (state) => {
    await updatePresence({ id, state });

    changePersence(id, state);

    setPresence(state);
  };

  useEffect(() => {
    let sendLocation;
    if (sessionInfo.isActive && presence) {
      sendLocation = setInterval(() => {
        return navigator.geolocation.getCurrentPosition(successCB, (err) => {
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
  }, [sessionInfo.isActive, presence, id, updateLocation]);

  return (
    <div>
      {(statusIsLoading || locationIsLoading) && <LoadingSpinner />}
      {!statusIsLoading && !locationIsLoading && (
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
