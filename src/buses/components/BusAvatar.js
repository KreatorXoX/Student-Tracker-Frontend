import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UI-Elements/Avatar";

const BusAvatar = (props) => {
  return (
    <Avatar>
      <Link to={`/bus/${props.id}`}>
        <img
          src={`https://cdn-icons-png.flaticon.com/128/1068/1068631.png`}
          alt="parent avatar"
          style={{ padding: "0.5rem" }}
        />
        <h3>{props.schoolName}</h3>
      </Link>
    </Avatar>
  );
};

export default BusAvatar;
