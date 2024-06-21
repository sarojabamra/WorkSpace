import React, { useState, useEffect } from "react";
import UserListItem from "../../chatlist/user/UserListItem";
import { IoClose } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { FaPen } from "react-icons/fa";
import { MdOutlinePersonSearch } from "react-icons/md";
import { ChatState } from "../../../context/ChatProvider";
import { API } from "../../../service/api";
import "./UpdateTeam.css";

const UpdateTeamModal = ({
  visible,
  onClose,
  fecthMessages,
  fetchAgain,
  setFetchAgain,
}) => {
  const [teamName, setTeamName] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { user: loggedUser, selectedChat, setSelectedChat } = ChatState();

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

  const addMember = async (userToAdd) => {
    if (selectedChat.users.some((u) => u._id === userToAdd._id)) {
      setError("User already added. Please choose a unique user.");
      return;
    }

    if (selectedChat.groupAdmin._id !== loggedUser._id) {
      setError("Only admins can add members.");
      return; // Add return here to prevent further execution
    }

    try {
      const response = await API.addToTeam({
        chatId: selectedChat._id,
        userId: userToAdd._id,
      });
      if (response.isSuccess) {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        setError("");
      } else {
        setError("There was an error adding the member.");
      }
    } catch (error) {
      console.log(error);
      setError("There was an error adding the member.");
    }
  };

  const removeMember = async (userToRemove) => {
    if (
      selectedChat.groupAdmin._id !== loggedUser._id &&
      userToRemove._id !== loggedUser._id
    ) {
      setError("Only the admin can add or remove someone.");
      return;
    }

    try {
      const response = await API.removeFromTeam({
        chatId: selectedChat._id,
        userId: userToRemove._id,
      });
      if (response.isSuccess) {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        fecthMessages();
        setError("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renameTeam = async () => {
    if (!teamName) {
      setError("The team name should not be empty.");
      return;
    }

    try {
      const response = await API.renameTeam({
        chatId: selectedChat._id,
        chatName: teamName,
      });

      if (response.isSuccess) {
        setSelectedChat(response.data);
        setFetchAgain(!fetchAgain);
        setError("");
        onClose();
      } else {
        console.log("There was an error updating the team name.");
      }
    } catch (error) {
      console.log("There was an error updating the team name.", error);
    }
  };

  const closeModal = () => {
    setError("");
    onClose();
  };

  useEffect(() => {
    setTeamName(selectedChat.chatName);
  }, [selectedChat]);

  if (!visible) return null;
  return (
    <div>
      <div className="update-team">
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="closediv">
              <IoClose className="close-icon" onClick={closeModal} />
            </div>
            <div className="create-title">
              <h2>Update Team Details</h2>
            </div>
            <p className="email">
              Update your team details and manage members using the options
              below. Add new members to your team or remove existing ones.
            </p>

            <div className="form">
              <div className="input-container-rename">
                <FaPen />

                <input
                  type="text"
                  placeholder=""
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  required
                />
                <button className="rename-btn" onClick={() => renameTeam()}>
                  <p>Rename</p>
                </button>
              </div>

              <div className="input-container">
                <MdOutlinePersonSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Add User to Team..."
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {Array.isArray(selectedChat?.users) &&
              selectedChat?.users.length > 0 ? (
                <div className="selected-list">
                  {selectedChat?.users.map((user) => (
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

              <p className="error">{error}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateTeamModal;
