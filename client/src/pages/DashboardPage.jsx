import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5001/api/notes";
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_URL, getAuthHeaders());
      setNotes(data);
    } catch (error) {
      console.error("Could not fetch notes", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const noteData = { title, content };
    try {
      if (editingNote) {
        await axios.put(
          `${API_URL}/${editingNote._id}`,
          noteData,
          getAuthHeaders()
        );
      } else {
        await axios.post(API_URL, noteData, getAuthHeaders());
      }
      setTitle("");
      setContent("");
      setEditingNote(null);
      fetchNotes();
    } catch (error) {
      console.error("Could not save note", error);
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        fetchNotes();
      } catch (error) {
        console.error("Could not delete note", error);
      }
    }
  };

  const handleTogglePin = async (note) => {
    try {
      await axios.put(
        `${API_URL}/${note._id}`,
        { ...note, isPinned: !note.isPinned },
        getAuthHeaders()
      );
      fetchNotes();
    } catch (error) {
      console.error("Could not update pin status", error);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-1">
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-white rounded shadow-md"
        >
          <h2 className="text-2xl font-bold mb-4">
            {editingNote ? "Edit Note" : "Create Note"}
          </h2>
          <div className="mb-4">
            <label className="block text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              rows="4"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            {editingNote ? "Update Note" : "Save Note"}
          </button>
          {editingNote && (
            <button
              onClick={() => {
                setEditingNote(null);
                setTitle("");
                setContent("");
              }}
              className="w-full mt-2 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel Edit
            </button>
          )}
        </form>
      </div>

      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-4">Your Notes</h2>
        <input
          type="text"
          placeholder="Search notes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded mb-4"
        />
        {loading ? (
          <p>Loading notes...</p>
        ) : (
          <div className="space-y-4">
            {filteredNotes.length > 0 ? (
              filteredNotes.map((note) => (
                <div
                  key={note._id}
                  className={`p-4 bg-white rounded shadow-md border-l-4 ${
                    note.isPinned ? "border-yellow-500" : "border-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold">{note.title}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated:{" "}
                        {new Date(note.updatedAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTogglePin(note)}
                      className="text-2xl p-1 hover:bg-gray-200 rounded-full"
                    >
                      {note.isPinned ? "📌" : "📍"}
                    </button>
                  </div>
                  <p className="text-gray-700 my-2 whitespace-pre-wrap">
                    {note.content}
                  </p>
                  <div className="flex justify-end space-x-2 mt-4">
                    <button
                      onClick={() => handleEdit(note)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No notes found. Create one!</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
