import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Bookmark,
  BookmarkCheck,
  X,
  Save,
  Loader2,
  FileText,
  Calendar,
  Sparkles,
} from "lucide-react";

const DashboardPage = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editingNote, setEditingNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = "https://dashboard-primetrade.onrender.com/api/notes";
  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get(API_URL, getAuthHeaders());
      setNotes(data);
    } catch (error) {
      console.error("Could not fetch notes", error);
      setError("Failed to load notes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError("Failed to save note. Please try again.");
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    // Scroll to form on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setError("");
      try {
        await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
        fetchNotes();
      } catch (error) {
        console.error("Could not delete note", error);
        setError("Failed to delete note. Please try again.");
      }
    }
  };

  const handleTogglePin = async (note) => {
    setError("");
    try {
      await axios.put(
        `${API_URL}/${note._id}`,
        { ...note, isPinned: !note.isPinned },
        getAuthHeaders()
      );
      fetchNotes();
    } catch (error) {
      console.error("Could not update pin status", error);
      setError("Failed to update pin status. Please try again.");
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort notes: pinned first, then by updatedAt date
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

  const pinnedCount = notes.filter((note) => note.isPinned).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl opacity-30"></div>
              <Sparkles className="relative w-10 h-10 text-purple-600" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-blue-800 bg-clip-text text-transparent mb-2">
            Your Notes Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Organize your thoughts, ideas, and inspirations
          </p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-gray-600 text-sm font-medium">
                Total Notes:{" "}
              </span>
              <span className="text-blue-600 font-bold text-lg">
                {notes.length}
              </span>
            </div>
            <div className="bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-md border border-gray-200">
              <span className="text-gray-600 text-sm font-medium">
                Pinned:{" "}
              </span>
              <span className="text-purple-600 font-bold text-lg">
                {pinnedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 mb-6 rounded-xl shadow-md backdrop-blur-sm animate-in slide-in-from-top">
            <div className="flex items-center">
              <X className="w-5 h-5 mr-3" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Create/Edit Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <form
                onSubmit={handleSubmit}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                {/* Form Header */}
                <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    {editingNote ? (
                      <>
                        <Edit className="w-6 h-6 mr-2" />
                        Edit Note
                      </>
                    ) : (
                      <>
                        <Plus className="w-6 h-6 mr-2" />
                        Create Note
                      </>
                    )}
                  </h2>
                  <p className="text-blue-100 text-sm mt-1">
                    {editingNote
                      ? "Update your note"
                      : "Start writing something amazing"}
                  </p>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-gray-500" />
                      Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm"
                      required
                      placeholder="Enter note title..."
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <Edit className="w-4 h-4 mr-2 text-gray-500" />
                      Content
                    </label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50 backdrop-blur-sm resize-none"
                      rows="8"
                      required
                      placeholder="Write your note here..."
                    ></textarea>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-3 pt-2">
                    <button
                      type="submit"
                      className="group relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-3.5 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      <span className="flex items-center justify-center">
                        <Save className="w-5 h-5 mr-2" />
                        {editingNote ? "Update Note" : "Save Note"}
                      </span>
                    </button>
                    {editingNote && (
                      <button
                        onClick={() => {
                          setEditingNote(null);
                          setTitle("");
                          setContent("");
                        }}
                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center border border-gray-300"
                        type="button"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Notes List */}
          <div className="lg:col-span-2">
            {/* Search Bar */}
            <div className="bg-white/80 backdrop-blur-xl p-5 rounded-2xl shadow-lg border border-gray-200 mb-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notes by title or content..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/50"
                />
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col justify-center items-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
                <p className="text-gray-600 font-medium">
                  Loading your notes...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNotes.length > 0 ? (
                  sortedNotes.map((note) => (
                    <div
                      key={note._id}
                      className={`group relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 overflow-hidden transform hover:-translate-y-1 ${
                        note.isPinned
                          ? "border-yellow-400 bg-gradient-to-br from-yellow-50 to-white"
                          : "border-gray-200 hover:border-purple-300"
                      }`}
                    >
                      {/* Pin Badge */}
                      {note.isPinned && (
                        <div className="absolute top-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                          Pinned
                        </div>
                      )}

                      <div className="p-6">
                        {/* Note Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                              {note.title}
                            </h3>
                            <div className="flex items-center text-xs text-gray-500 space-x-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>
                                {new Date(note.updatedAt).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleTogglePin(note)}
                            className={`p-2.5 rounded-xl transition-all duration-200 ${
                              note.isPinned
                                ? "bg-yellow-100 hover:bg-yellow-200 text-yellow-600"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-yellow-500"
                            }`}
                            title={note.isPinned ? "Unpin note" : "Pin note"}
                          >
                            {note.isPinned ? (
                              <BookmarkCheck className="w-5 h-5" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        {/* Note Content */}
                        <div className="mb-5 pb-5 border-b border-gray-200">
                          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {note.content}
                          </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleEdit(note)}
                            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(note._id)}
                            className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center font-semibold shadow-md hover:shadow-lg"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-20 bg-white/60 backdrop-blur-sm rounded-2xl border-2 border-dashed border-gray-300">
                    <div className="relative inline-block mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-2xl opacity-20"></div>
                      <FileText className="relative w-20 h-20 text-gray-400 mx-auto" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">
                      No notes found
                    </h3>
                    <p className="text-gray-500 text-lg">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Create your first note to get started"}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
