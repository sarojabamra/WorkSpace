import Task from "../models/task.js";

// Function to add a new task
export const addTask = async (req, res) => {
  const { userId, title, description } = req.body;

  try {
    const newTask = new Task({
      user: userId,
      title: title,
      description: description,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ error: "Failed to add task" });
  }
};

export const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    res.status(200).json({ message: "Task deleted successfully", deletedTask });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
};

// Function to mark a task as completed
export const completeTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.completed = true;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error completing task:", error);
    res.status(500).json({ error: "Failed to complete task" });
  }
};

// Function to mark a task as important
export const markImportant = async (req, res) => {
  const { taskId, isImportant } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }
    task.isImportant = isImportant;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.error("Error marking task as important:", error);
    res.status(500).json({ error: "Failed to mark task as important" });
  }
};

// Function to get tasks by user ID and filter
export const getTasks = async (req, res) => {
  const { userId, filter } = req.body;

  try {
    let query = { user: userId };

    // Adjust query based on filter
    if (filter === "completed") {
      query.completed = true;
    } else if (filter === "important") {
      query.isImportant = true;
    } else if (!filter) {
      // If no filter provided, get all tasks
      // No additional conditions needed in query for all tasks
    } else {
      res.status(400).json({ error: "Invalid filter parameter" });
      return;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};
