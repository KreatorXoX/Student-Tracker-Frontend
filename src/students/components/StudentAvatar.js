import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UI-Elements/Avatar";

const StudentAvatar = (props) => {
  return (
    <Avatar>
      <Link to={`/student/${props.id}`}>
        <img src={props.stdImg} alt="student avatar" />
        <h3>
          {props.name} {props.surname}
        </h3>
      </Link>
    </Avatar>
  );
};

export default StudentAvatar;
