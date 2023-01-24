import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { SessContext } from "../../shared/context/sess-context";

import Button from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UI-Elements/Modal";

import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import { useAuthStore } from "../../shared/context/authStore";
import { useGetStudents } from "../../api/studentApi";
const BusSession = () => {
  const history = useHistory();
  const sessCtx = useContext(SessContext);
  const userInfo = useAuthStore((state) => state.userInfo);

  const { data, isLoading, isSuccess } = useGetStudents("bus", userInfo.busId);

  const startSessionHandler = async () => {
    try {
      const stds = data?.students?.filter((std) => std.isComing !== false);

      const sessionStudents = stds.map((std) => {
        return {
          id: std.id,
          name: std.name,
          image: std.image,
          wasOnTheBus: false,
          isOnTheBus: false,
        };
      });

      sessCtx.startSess(
        true,
        sessionStudents,
        data.schoolName,
        data.busDriver,
        data.studentHandler,
        new Date(Date.now()).toLocaleString(),
        userInfo.id,
        data.busId
      );
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
        show={sessCtx.isActive}
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
