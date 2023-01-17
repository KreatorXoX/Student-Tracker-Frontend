import React from "react";
import { useHistory } from "react-router-dom";
import { useAuthStore } from "../../shared/context/authStore";

import Logo from "../../assets/images/busLogo.png";
import { useForm } from "../../shared/hooks/form-hook";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UI-Elements/ErrorModal";
import LoadingSpinner from "../../shared/components/UI-Elements/LoadingSpinner";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import styles from "./AuthForm.module.css";
import { useLogin } from "../../api/authApi";
import jwtDecode from "jwt-decode";

const AuthForm = () => {
  const { mutateAsync: logUser, isError, isLoading, error } = useLogin();
  const login = useAuthStore((state) => state.setLogin);

  const history = useHistory();

  const [formState, inputHandler] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const formHandler = async (e) => {
    e.preventDefault();
    await logUser(
      {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      },
      {
        onSuccess: (data) => {
          try {
            login(data.accessToken);
          } catch (error) {
            console.log(error);
          }
        },
        onSettled: (data) => {
          const userInfo = jwtDecode(data.accessToken);
          if (userInfo.role === "admin") {
            history.push("/buses");
          } else if (userInfo.role === "employee") {
            history.push("/start");
          } else {
            history.push(`/user/${userInfo.userId}`);
          }
        },
      }
    );
  };

  return (
    <>
      {isError && <ErrorModal error={error} />}
      <form onSubmit={formHandler} className={styles.login}>
        <div className={styles["login__upperrow"]}>
          <img className={styles["login__img"]} src={Logo} alt="logo" />
          {isLoading && <LoadingSpinner />}
          {!isLoading && <h1 className={styles["login__title"]}>Welcome</h1>}
        </div>
        <div className={styles["login__fields"]}>
          <div className={styles["login__field"]}>
            <Input
              id="email"
              type="email"
              label="Email"
              placeholder="example@example.com"
              errorText="Enter a valid email"
              onInputChange={inputHandler}
              validators={[VALIDATOR_EMAIL()]}
              autoFocus
            />
          </div>
          <div className={styles["login__field"]}>
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="******"
              errorText="At least 5 characters"
              onInputChange={inputHandler}
              validators={[VALIDATOR_MINLENGTH(5)]}
            />
          </div>
        </div>
        <div className={styles["login__actions"]}>
          <Button type="submit" mid disabled={!formState.isValid} warning>
            Login Now
          </Button>
        </div>
      </form>
    </>
  );
};

export default AuthForm;
