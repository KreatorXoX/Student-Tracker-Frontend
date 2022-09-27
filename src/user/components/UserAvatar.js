import React from "react";
import { Link } from "react-router-dom";

import Avatar from "../../shared/components/UI-Elements/Avatar";

const UserAvatar = (props) => {
  return (
    <Avatar>
      <Link to={`/user/${props.id}`}>
        <img src={props.image} alt={props.name} />
        <h3>{props.name}</h3>
      </Link>
    </Avatar>
  );
};

export default UserAvatar;
