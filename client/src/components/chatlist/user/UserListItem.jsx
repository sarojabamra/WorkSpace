import React from "react";
import { IoIosAddCircle } from "react-icons/io";

const UserListItem = ({ user }) => {
  const url = user.image ? user.image : "../../../images/profile-photo.jpg";
  return (
    <div className="userbg">
      <div className="user-container2">
        <div className="column1">
          <div className="user-imgdiv">
            <img src={url} />
          </div>
          <div>
            <p className="name">{user.name}</p>

            <p className="email">{user.email}</p>
          </div>
        </div>
        <div className="column2">
          <IoIosAddCircle className="addchat-icon icon2" />
        </div>
      </div>
    </div>
  );
};

export default UserListItem;
