import React from "react";
import "./Sidebar.css";
import { FaTasks } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
import { FaVideo } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { useState } from "react";

import { FaNoteSticky } from "react-icons/fa6";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import TaskModal from "../taskmodal/TaskModal";
import NotesModal from "../notesmodal/NotesModal";

const Sidebar = ({ isUserSearching }) => {
  const [activeIcon, setActiveIcon] = useState("chat");
  const { user } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [notesVisible, setNotesVisible] = useState(false);

  const handleModalOpen = () => {
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setActiveIcon("chat");
  };

  const handleNotesModalClose = () => {
    setNotesVisible(false);
    setActiveIcon("chat");
  };

  const toggleState = (icon) => {
    setActiveIcon(icon);
  };

  const openTaskModal = () => {
    setModalVisible(true);
    toggleState("task");
  };

  const openNotesModal = () => {
    setNotesVisible(true);
    toggleState("notes");
  };

  const url = user?.image ? user.image : "../../../images/profile-photo.jpg";

  return (
    <div className="sidebar">
      <div className="top">
        <FaUsers className="contacts-icon icon main-icon" />
      </div>
      <div className="sidebar-menu">
        <IoIosChatboxes
          className={`chat-icon icon ${
            activeIcon === "chat" ? "active-icon" : ""
          }`}
          onClick={() => toggleState("chat")}
        />
        <FaVideo
          className={`conference-icon icon ${
            activeIcon === "conference" ? "active-icon" : ""
          }`}
          onClick={() => toggleState("conference")}
        />
        <FaTasks
          className={`task-icon icon ${
            activeIcon === "task" ? "active-icon" : ""
          }`}
          onClick={() => openTaskModal()}
        />
        <FaNoteSticky
          className={`notes-icon icon ${
            activeIcon === "notes" ? "active-icon" : ""
          }`}
          onClick={() => openNotesModal()}
        />

        <div className="hr" />
        <div className="profileimgdiv">
          <img src={url} alt="Profile Photo" />
        </div>
      </div>
      <NotesModal visible={notesVisible} onClose={handleNotesModalClose} />
      <TaskModal visible={modalVisible} onClose={handleModalClose} />
    </div>
  );
};

export default Sidebar;
