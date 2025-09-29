import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Note from "../models/Note.js";

const router = express.Router();

// @desc    Get all notes for a user
// @route   GET /api/notes
router.get('/', protect, async (req, res) => {
    // Sort by isPinned (desc), then by updatedAt (desc)
    const notes = await Note.find({ user: req.user._id }).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  });
  
  // @desc    Create a new note
  // @route   POST /api/notes
  router.post('/', protect, async (req, res) => {
    const { title, content } = req.body;
    const note = new Note({
      title,
      content,
      user: req.user._id,
    });
    const createdNote = await note.save();
    res.status(201).json(createdNote);
  });
  
  // @desc    Update a note
  // @route   PUT /api/notes/:id
  router.put('/:id', protect, async (req, res) => {
    const { title, content, isPinned } = req.body; // <-- ADD isPinned
    const note = await Note.findById(req.params.id);
  
    if (note && note.user.toString() === req.user._id.toString()) {
      note.title = title || note.title;
      note.content = content || note.content;
      // Handle boolean value for isPinned
      if (isPinned !== undefined) {
          note.isPinned = isPinned;
      }
      const updatedNote = await note.save();
      res.json(updatedNote);
    } else {
      res.status(404).json({ message: 'Note not found or user not authorized' });
    }
  });
  
// @desc    Delete a note
// @route   DELETE /api/notes/:id
router.delete("/:id", protect, async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (note && note.user.toString() === req.user._id.toString()) {
    await note.deleteOne(); // Use deleteOne()
    res.json({ message: "Note removed" });
  } else {
    res.status(404).json({ message: "Note not found or user not authorized" });
  }
});

export default router;
