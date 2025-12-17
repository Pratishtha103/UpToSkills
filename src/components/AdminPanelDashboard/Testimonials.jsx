import React, { useState, useEffect } from "react";
import { Trash2, Loader } from "lucide-react";
import axios from "axios";

const API = "http://localhost:5000";

export default function Testimonials({ isDarkMode = false }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch testimonials from backend
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/api/testimonials`);
      setTestimonials(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching testimonials:", err);
      setError("Failed to load testimonials");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Delete testimonial
  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      await axios.delete(`${API}/api/testimonials/${deleteId}`);
      
      // Remove from local state
      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      setShowDeletePopup(false);
      setDeleteId(null);
    } catch (err) {
      console.error("Error deleting testimonial:", err);
      setError("Failed to delete testimonial");
    } finally {
      setDeleting(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <Loader className="animate-spin" size={48} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex flex-col items-center p-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div
        className={`w-full max-w-5xl rounded-2xl shadow-2xl p-8 backdrop-blur-sm ${
          isDarkMode ? "bg-gray-800/95" : "bg-white/95"
        }`}
      >
        <h2 className="text-4xl font-bold mb-2 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Testimonials
        </h2>

        <p className={`text-center mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
          What our community says about us ({testimonials.length} testimonials)
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {testimonials.length === 0 ? (
          <p className={`text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>
            No testimonials yet.
          </p>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className={`group relative p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  isDarkMode
                    ? "bg-gray-900/50 border-gray-700 hover:border-blue-500/50 hover:shadow-blue-500/10"
                    : "bg-gray-50/50 border-gray-200 hover:border-purple-300 hover:shadow-purple-200/50"
                }`}
              >
                {/* Delete Button */}
                <button
                  onClick={() => {
                    setDeleteId(t.id);
                    setShowDeletePopup(true);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                    isDarkMode
                      ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      : "bg-red-50 hover:bg-red-100 text-red-600"
                  }`}
                  title="Delete testimonial"
                >
                  <Trash2 size={18} />
                </button>

                {/* Quote Icon */}
                <div
                  className={`text-5xl mb-2 leading-none ${
                    isDarkMode ? "text-gray-700" : "text-gray-200"
                  }`}
                >
                  "
                </div>

                <p
                  className={`text-lg mb-4 leading-relaxed ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {t.message}
                </p>

                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                      isDarkMode
                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
                        : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                    }`}
                  >
                    {t.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-lg truncate">{t.name}</h4>

                    {t.role && (
                      <p
                        className={`text-sm truncate ${
                          isDarkMode ? "text-blue-400" : "text-purple-600"
                        }`}
                      >
                        {t.role}
                      </p>
                    )}
                  </div>

                  <p
                    className={`text-xs whitespace-nowrap ${
                      isDarkMode ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {formatDate(t.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* DELETE POPUP */}
      {showDeletePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className={`p-8 rounded-2xl shadow-2xl w-[420px] min-h-[180px] text-center ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            <h2 className="text-xl font-bold mb-4">Delete Testimonial?</h2>

            <p className="text-base mb-8">Are you sure you want to delete this testimonial? This action cannot be undone.</p>

            <div className="flex gap-4">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <Loader className="animate-spin" size={16} />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete"
                )}
              </button>

              <button
                onClick={() => {
                  setShowDeletePopup(false);
                  setDeleteId(null);
                }}
                disabled={deleting}
                className={`flex-1 py-3 rounded-lg text-sm font-medium transition-colors ${
                  isDarkMode 
                    ? "bg-gray-700 hover:bg-gray-600" 
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}