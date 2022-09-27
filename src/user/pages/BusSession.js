import { useContext } from "react";
import { useHistory } from "react-router-dom";

import { AuthContext } from "../../shared/context/auth-context";
import { SessContext } from "../../shared/context/sess-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import Modal from "../../shared/components/UI-Elements/Modal";
import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

const BusSession = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const sessCtx = useContext(SessContext);
  const authCtx = useContext(AuthContext);

  const startSessionHandler = async () => {
    try {
      const data = await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/students/bus/${authCtx.userInfo.busId}`,
        "GET",
        null,
        { Authorization: "Bearer " + authCtx.token }
      );

      const stds = data.students.filter((std) => std.isComing !== false);

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
        authCtx.userInfo.id,
        data.busId
      );
      history.push("/busStudents");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      <div style={{ alignSelf: "center" }}>
        {isLoading && <LoadingSpinner />}
        {!isLoading && (
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
