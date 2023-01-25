import { useHistory } from "react-router-dom";

import Button from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UI-Elements/Modal";

import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import { useAuthStore } from "../../shared/context/authStore";
import { useGetStudents } from "../../api/studentApi";
import { useGetBus } from "../../api/busesApi";
import { useSessionStore } from "../../shared/context/sessionStore";

const BusSession = () => {
  const history = useHistory();

  const userInfo = useAuthStore((state) => state.userInfo);
  const startSession = useSessionStore((state) => state.setSession);
  const sessionInfo = useSessionStore((state) => state.sessionInfo);

  const { data: busData } = useGetBus(userInfo.busId);
  const {
    data: busStudents,
    isLoading,
    isSuccess,
  } = useGetStudents("bus", userInfo.busId);

  const startSessionHandler = async () => {
    try {
      const stds = busStudents?.students?.filter(
        (std) => std.isComing !== false
      );

      const sessionStudents = stds.map((std) => {
        return {
          id: std.id,
          name: std.name,
          image: std.image,
          wasOnTheBus: false,
          isOnTheBus: false,
        };
      });

      const sessionParams = {
        isActive: true,
        students: sessionStudents,
        schoolName: busData.bus.schoolName,
        busDriver: busData.bus.busDriver.name,
        studentHandler: busData.bus.studentHandler.name,
        date: new Date().toLocaleDateString(),
        employeeId: userInfo.id,
        busId: busData.bus.id,
      };

      startSession(sessionParams);
      history.push("/busStudents");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <div style={{ alignSelf: "center" }}>
        {isLoading && <LoadingSpinner />}
        {!isLoading && isSuccess && (
          <Button
            style={{ padding: "8em 4em", borderRadius: "50%" }}
            large
            success
            onClick={startSessionHandler}
          >
            Start The Bus Session
          </Button>
        )}
      </div>
      <Modal
        show={sessionInfo.isActive}
        header={"Active Session Warning"}
        footer={
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              large
              warning
              onClick={() => {
                history.push("/busStudents");
              }}
            >
              Continue
            </Button>
            <Button large success onClick={startSessionHandler}>
              Start a new session
            </Button>
          </div>
        }
      >
        <p>Do you want to continue with the current session ?</p>
      </Modal>
    </>
  );
};

export default BusSession;
