// server/models/Note.js
import mongoose from "mongoose";

const noteSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isPinned: { type: Boolean, default: false }, // <-- ADD THIS LINE
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;
