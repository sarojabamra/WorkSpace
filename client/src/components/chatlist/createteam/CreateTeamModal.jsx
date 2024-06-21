import React, { useState } from "react";
import "./CreateTeamModal.css";
import { ChatState } from "../../../context/ChatProvider";
import { FaPen, FaUsers } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { API } from "../../../service/api";
import User from "../user/User";
import { useEffect } from "react";
import { RiTeamFill } from "react-icons/ri";

import UserListItem from "../user/UserListItem";
import { MdOutlinePersonSearch } from "react-icons/md";

const CreateTeamModal = ({ onClose }) => {
  const [teamName, setTeamName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const { user: loggedUser, chats, setChats } = ChatState();
  const [error, setError] = useState("");

  const filterUsers = (user) => {
    if (user._id === loggedUser._id) {
      return false;
    }
    if (!searchQuery) {
      return false;
    }
    const userMatch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    return userMatch;
  };

  const fetchUsers = async () => {
    try {
      let response = await API.getAllUsers();

      if (response.isSuccess) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const addMember = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setError("User already added. Please choose a unique user.");

      return;
    }

    setSelectedUsers((prevSelectedUsers) => [...prevSelectedUsers, user]);
    setError("");
  };

  const removeMember = (userToRemove) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };

  const handleSubmit = async () => {
    if (!teamName || !selectedUsers) {
      setError("Please fill all the fields.");
    }

    try {
      const response = await API.createTeam({
        name: teamName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      });
      if (response.isSuccess) {
        setChats([response.data, ...chats]);
        onClose();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="create-team">
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="closediv">
            <IoClose className="close-icon" onClick={onClose} />
          </div>
          <div className="create-title">
            <RiTeamFill className="team-icon" />
            <h2>Create your Team!</h2>
          </div>
          <p className="email">
            Please give your team a name and use the search bar below to add
            members to your team. Then, click on 'Create Team' to proceed.
          </p>

          <form>
            <div className="input-container">
              <FaPen />
              <input
                type="text"
                placeholder="Give a name to your Team..."
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div className="input-container">
              <MdOutlinePersonSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search Users..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {Array.isArray(selectedUsers) && selectedUsers.length > 0 ? (
              <div className="selected-list">
                {selectedUsers.map((user) => (
                  <div key={user._id}>
                    <div className="selected-users">
                      <p>{user.name}</p>
                      <IoClose
                        className="dlt-user"
                        onClick={() => removeMember(user)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">No user selected yet...</div>
            )}
            <div className="user-list">
              {Array.isArray(users) && users.length > 0 ? (
                users.filter(filterUsers).map((user) => (
                  <div key={user._id} onClick={() => addMember(user)}>
                    <UserListItem user={user} />
                  </div>
                ))
              ) : (
                <div className="nodata"></div>
              )}
            </div>
            <button type="submit" onClick={handleSubmit}>
              Create Team
            </button>
            <p className="error">{error}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;
