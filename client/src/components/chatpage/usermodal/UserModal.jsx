import React from "react";
import "./UserModal.css";
import { IoClose } from "react-icons/io5";
import { FaIdCard, FaPen, FaUserCircle, FaUserTie } from "react-icons/fa";
import { MdAttachEmail } from "react-icons/md";
import {
  getSenderImage,
  getSender,
  getSenderUsername,
  getSenderEmail,
  getSenderProfession,
  getSenderId,
} from "../../../utils/ChatLogic";
import { ChatState } from "../../../context/ChatProvider";

const UserModal = ({ visible, onClose, selectedChat }) => {
  if (!visible) return null;
  const { user: loggedUser } = ChatState();

  const url = getSenderImage(loggedUser, selectedChat?.users)
    ? getSenderImage(loggedUser, selectedChat.users)
    : "../../../images/profile-photo.jpg";

  return (
    <>
      <div className="modal-overlay2">
        <div className="modal-content2 profile-container">
          <div className="box">
            <div className="closediv">
              <IoClose className="close-icon2" onClick={onClose} />
            </div>
            <div className="btns">
              <button className="active">Profile</button>
              <button className="inactive">Assign Task</button>
            </div>
            <div className="profile-content">
              <div className="imgdiv">
                <img src={url} alt="Profile Photo" />
              </div>
              <div className="input-container">
                <FaIdCard />
                <p>{getSenderId(loggedUser, selectedChat?.users)}</p>
              </div>
              <div className="input-container">
                <FaUserCircle />
                <p>{getSender(loggedUser, selectedChat?.users)}</p>
              </div>
              <div className="input-container">
                <FaPen />
                <p>{getSenderUsername(loggedUser, selectedChat?.users)}</p>
              </div>
              <div className="input-container">
                <MdAttachEmail />
                <p>{getSenderEmail(loggedUser, selectedChat?.users)}</p>
              </div>
              <div className="input-container">
                <FaUserTie />
                <p>
                  Profession:{" "}
                  {getSenderProfession(loggedUser, selectedChat?.users)}
                </p>
              </div>
              <p className="error">
                Click on the 'Assign Task' button to assign a task.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;
