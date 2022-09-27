import React, { useReducer, useEffect } from "react";

import { validate } from "../../util/validators";

import styles from "./Input.module.css";

const inputReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE":
      return {
        ...state,
        value: action.val,
        isValid: validate(action.val, action.validators),
      };
    case "TOUCH":
      return {
        ...state,
        isTouched: true,
      };
    default:
      return state;
  }
};
const Input = (props) => {
  const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.initialValue || "",
    isValid: props.initialValid || false,
    isTouched: false,
  });

  const { id, onInputChange } = props;
  const { value, isValid } = inputState;

  useEffect(() => {
    onInputChange(id, value, isValid);
  }, [id, value, isValid, onInputChange]);

  const changeHandler = (event) => {
    dispatch({
      type: "CHANGE",
      val: event.target.value,

      validators: props.validators,
    });
  };

  const touchHandler = () => {
    dispatch({ type: "TOUCH" });
  };

  let component =
    props.element === "textarea" ? (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        autoFocus={props.autoFocus}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        type={props.hidden}
      />
    ) : props.element === "select" ? (
      <select
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        disabled={props.disabled || props.defaultText === "No available bus"}
      >
        <option value={"default"}>{props.defaultText}</option>

        {props.options}
      </select>
    ) : (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        autoFocus={props.autoFocus}
        onChange={changeHandler}
        onBlur={touchHandler}
        value={inputState.value}
        disabled={props.disabled}
      />
    );

  return (
    <div className={styles.content}>
      <div
        className={`${styles["form-control"]} ${
          styles[
            `${
              !inputState.isValid &&
              inputState.isTouched &&
              "form-control--invalid"
            }`
          ]
        } ${styles[`${props.disabled && "form-control--disabled"}`]}`}
      >
        <label htmlFor={props.id}>{props.label}</label>
        {component}
        {!inputState.isValid && inputState.isTouched && (
          <p>{props.errorText}</p>
        )}
      </div>
    </div>
  );
};

export default Input;
