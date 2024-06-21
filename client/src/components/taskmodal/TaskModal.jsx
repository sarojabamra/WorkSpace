import React, { useEffect } from "react";
import "./TaskModal.css";
import { FaPenAlt } from "react-icons/fa";
import { FaNoteSticky } from "react-icons/fa6";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import { MdOutlineTaskAlt } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { IoClose } from "react-icons/io5";

const TaskModal = ({ visible, onClose }) => {
  const [activePage, setActivePage] = useState("unfinished");
  const [todoList, setTodoList] = useState([]);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  //const [importantTasks, setImportantTasks] = useState([]);

  const toggleState = (page) => {
    setActivePage(page);
  };

  const addTask = () => {
    const newTaskItem = {
      title: taskTitle,
      description: taskDescription,
      isImportant: false,
    };

    setTodoList((prevTodoList) => {
      const updatedTodoList = [...prevTodoList, newTaskItem];
      localStorage.setItem("taskList", JSON.stringify(updatedTodoList));
      return updatedTodoList;
    });

    setTaskTitle("");
    setTaskDescription("");
  };

  useEffect(() => {
    const savedList = JSON.parse(localStorage.getItem("taskList"));
    if (savedList) {
      setTodoList(savedList);
    }

    const savedCompletedTasks = JSON.parse(
      localStorage.getItem("completedTasks")
    );
    if (savedCompletedTasks) {
      setCompletedTasks(savedCompletedTasks);
    }
  }, []);

  const deleteTask = (index) => {
    let newTodoList = [...todoList];
    newTodoList.splice(index, 1);

    localStorage.setItem("taskList", JSON.stringify(newTodoList));
    setTodoList(newTodoList);
  };

  const deleteCompletedTask = (index) => {
    const newCompletedList = [...completedTasks];
    newCompletedList.splice(index, 1);

    // Update state and localStorage for completedTasks
    setCompletedTasks(newCompletedList);
    localStorage.setItem("completedTasks", JSON.stringify(newCompletedList));
  };

  const completeTask = (index) => {
    // Get the completed task
    const completedTask = todoList[index];

    // Update the completed tasks array
    setCompletedTasks((prevCompletedTasks) => {
      const updatedCompletedTasks = [...prevCompletedTasks, completedTask];
      localStorage.setItem(
        "completedTasks",
        JSON.stringify(updatedCompletedTasks)
      );
      return updatedCompletedTasks;
    });

    // Update the todo list by removing the completed task
    setTodoList((prevTodoList) => {
      const updatedTodoList = [...prevTodoList];
      updatedTodoList.splice(index, 1); // Remove the task at the specified index
      localStorage.setItem("taskList", JSON.stringify(updatedTodoList));
      return updatedTodoList;
    });
  };

  const markImportant = (index) => {
    let updatedTodoList = [...todoList];
    updatedTodoList[index].isImportant = !updatedTodoList[index].isImportant;

    localStorage.setItem("taskList", JSON.stringify(updatedTodoList));
    setTodoList(updatedTodoList);
  };
  if (!visible) return null;
  return (
    <>
      <div className="task-container">
        <div className="box">
          <div className="closediv">
            <IoClose className="close-icon" onClick={onClose} />
          </div>
          <div className="title">
            <h2 className="active">My tasks</h2>

            <h2>Assigned to me</h2>
          </div>
          <div className="add-task">
            <p className="intro">
              Stay organized and achieve your goals. Start by adding your tasks
              below to keep track of everything you need to do.
            </p>
            <div className="input-field">
              <FaNoteSticky />
              <input
                placeholder="Give a title to your task..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="input-field">
              <FaPenAlt />
              <input
                placeholder="Give a description to your task..."
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
              />
            </div>
            <button className="add-btn" onClick={() => addTask()}>
              Add task
            </button>
          </div>
          <div className="section-2">
            <div className="btnns">
              <button
                className={`${activePage === "unfinished" ? `active` : ``}`}
                onClick={() => toggleState("unfinished")}
              >
                Unfinished
              </button>
              <button
                className={`${activePage === "important" ? `active` : ``}`}
                onClick={() => toggleState("important")}
              >
                Important
              </button>
              <button
                className={`${activePage === "completed" ? `active` : ``}`}
                onClick={() => toggleState("completed")}
              >
                Completed
              </button>
            </div>
            <div className="task-list">
              {activePage === "unfinished" &&
                todoList.map((todo, index) => {
                  return (
                    <div className="task-item" key={index}>
                      <div className="col1">
                        <div>
                          <MdOutlineTaskAlt
                            className="completed iconn"
                            onClick={() => completeTask(index)}
                          />
                        </div>
                        <div>
                          <h4>{todo.title}</h4>
                          <p>{todo.description}</p>
                        </div>
                      </div>
                      <div className="col2">
                        <FaStar
                          className={`imp ${
                            todo.isImportant ? "icon2" : "iconn"
                          }`}
                          onClick={() => markImportant(index)}
                        />

                        <MdDelete
                          className="dlt iconn"
                          onClick={() => deleteTask(index)}
                        />
                      </div>
                    </div>
                  );
                })}
              {activePage === "important" &&
                todoList
                  .filter((task) => task.isImportant)
                  .map((todo, index) => {
                    return (
                      <div className="task-item" key={index}>
                        <div className="col1">
                          <div>
                            <MdOutlineTaskAlt
                              className="completed iconn"
                              onClick={() => completeTask(index)}
                            />
                          </div>
                          <div>
                            <h4>{todo.title}</h4>
                            <p>{todo.description}</p>
                          </div>
                        </div>
                        <div className="col2">
                          <FaStar
                            className="imp icon2"
                            onClick={() => markImportant(index)}
                          />
                          <MdDelete
                            className="dlt iconn"
                            onClick={() => deleteTask(index)}
                          />
                        </div>
                      </div>
                    );
                  })}
              {activePage === "completed" &&
                completedTasks
                  .slice()
                  .reverse()
                  .map((todo, index) => {
                    return (
                      <div className="completed-task-item" key={index}>
                        <div className="col1">
                          <div>
                            <MdOutlineTaskAlt className="completed iconn" />
                          </div>
                          <div>
                            <h4>{todo.title}</h4>
                            <p>{todo.description}</p>
                          </div>
                        </div>
                        <div className="col2">
                          <MdDelete
                            className="dlt iconn"
                            onClick={() => deleteCompletedTask(index)}
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

export default TaskModal;
