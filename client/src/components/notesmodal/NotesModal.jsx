import react, { useEffect, useState } from "react";
import { FaPenAlt, FaStar } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { MdDelete, MdOutlineTaskAlt } from "react-icons/md";
import "./NotesModal.css";
import { API } from "../../service/api";
import { ChatState } from "../../context/ChatProvider";
import { addElipses } from "../../utils/common-utils";

const NotesModal = ({ visible, onClose }) => {
  const [activePage, setActivePage] = useState("create");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user: loggedUser } = ChatState();
  const [expandedNotes, setExpandedNotes] = useState({});

  const toggleExpand = (noteId) => {
    setExpandedNotes((prevExpanded) => ({
      ...prevExpanded,
      [noteId]: !prevExpanded[noteId],
    }));
  };

  const toggleState = (page) => {
    setActivePage(page);
  };

  const addNote = async () => {
    try {
      const response = await API.addNote({
        userId: loggedUser._id,
        title: noteTitle,
        description: noteDescription,
      });

      if (response.isSuccess) {
        console.log("Note added to database successfully.");
        setNoteTitle("");
        setNoteDescription("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getAllNotes = async () => {
    try {
      const response = await API.getAllNotes(loggedUser);
      if (response.isSuccess) {
        setNotes(response.data);
      }
    } catch (error) {}
  };

  const markImportant = async (note) => {
    try {
      const response = await API.markAsImportant(note);
      if (response.isSuccess) {
        console.log("Note deleted successfully.");
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const deleteNote = async (note) => {
    try {
      const response = await API.deleteNote(note);
      if (response.isSuccess) {
        setFetchAgain(!fetchAgain);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllNotes();
  }, [activePage, fetchAgain]);

  if (!visible) return null;

  return (
    <>
      <div className="notes-container">
        <div className="box">
          <div className="closediv">
            <IoClose className="close-icon" onClick={onClose} />
          </div>
          <div className="title">
            <h2
              className={`${activePage === "create" ? `active` : ``}`}
              onClick={() => toggleState("create")}
            >
              Create Note
            </h2>

            <h2
              className={`${activePage === "mynotes" ? `active` : ``}`}
              onClick={() => toggleState("mynotes")}
            >
              My Notes
            </h2>
          </div>

          {activePage == "create" && (
            <>
              <div className="add-task">
                <p className="intro">
                  Stay organized and achieve your goals. Start by adding your
                  tasks below to keep track of everything you need to do.
                </p>
                <div className="input-field">
                  <FaNoteSticky />
                  <input
                    placeholder="Give a title to your note..."
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                  />
                </div>
                <div className="input-field note-description">
                  <FaPenAlt />
                  <textarea
                    placeholder="Write a description for your note..."
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                  />
                </div>
                <button className="add-btn" onClick={() => addNote()}>
                  Add Note
                </button>
              </div>
            </>
          )}
          <div className="section-2">
            <div className="task-list">
              {activePage === "mynotes" &&
                notes.map((note) => {
                  const isExpanded = expandedNotes[note._id] || false;
                  return (
                    <div className="task-item" key={note._id}>
                      <div className="col1">
                        <div>
                          <h4>{note.title}</h4>
                          <p>
                            {isExpanded
                              ? note.description
                              : addElipses(note.description, 125)}
                          </p>
                          {note.description.split(" ").length > 20 && (
                            <button
                              className="expand-btn"
                              onClick={() => toggleExpand(note._id)}
                            >
                              {isExpanded ? "Read less" : "Read more"}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="col2">
                        <FaStar
                          className={`imp ${
                            note.isImportant ? "icon2" : "iconn"
                          }`}
                          onClick={() => markImportant(note)}
                        />
                        <MdDelete
                          className="dlt iconn"
                          onClick={() => deleteNote(note)}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotesModal;
