import Note from "../models/note.js";

export const addNote = async (req, res) => {
  const { userId, title, description } = req.body;

  try {
    const newNote = new Note({
      user: userId,
      title,
      description,
    });

    const savedNote = await newNote.save();
    res.status(200).json(savedNote);
  } catch (error) {
    res.status(500).json({ message: "Failed to create note", error });
  }
};

export const getAllNotes = async (req, res) => {
  const { userId } = req.params;

  try {
    const notes = await Note.find({ user: userId });
    res.status(200).json(notes);
  } catch (error) {
    res.status(500).json({ message: "Failed to get notes", error });
  }
};

export const deleteNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const deletedNote = await Note.findOneAndDelete({ _id: noteId });

    if (!deletedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete note", error });
  }
};

export const markNote = async (req, res) => {
  const { noteId } = req.params;

  try {
    const note = await Note.findOne({ _id: noteId });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    note.isImportant = !note.isImportant;
    await note.save();
    res.status(200).json(note);
  } catch (error) {
    console.error("Error marking note as important:", error);
    res.status(500).json({ error: "Failed to mark note as important" });
  }
};
