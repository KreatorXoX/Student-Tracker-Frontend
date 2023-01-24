import React from "react";
import { useHistory } from "react-router-dom";
import Logo from "../../assets/images/busLogo.png";

import { useLogin } from "../../api/authApi";

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

const AuthForm = () => {
  const { mutateAsync: login, isError, isLoading, error } = useLogin();

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
    await login(
      {
        email: formState.inputs.email.value,
        password: formState.inputs.password.value,
      },
      {
        onSettled: (data) => {
          const { role, id } = data;
          if (role === "admin") {
            history.push("/buses");
          } else if (role === "employee") {
            history.push("/start");
          } else {
            history.push(`/user/${id}`);
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
