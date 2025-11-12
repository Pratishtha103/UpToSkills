import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, Loader2, User } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/testimonials";

export default function Testimonials({ isDarkMode }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  // Fetch all testimonials
  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      setTestimonials(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setTestimonials([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Delete testimonial
  const handleDelete = async (id) => {
    const testimonial = testimonials.find((t) => t.id === id);
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the testimonial from ${testimonial?.name || "this user"}?`
    );
    if (!confirmDelete) return;

    try {
      setDeleting(id);
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
      });
      const result = await response.json();

      if (result.success) {
        setTestimonials((current) => current.filter((t) => t.id !== id));
      } else {
        alert(result.message || "Failed to delete testimonial");
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Failed to delete testimonial");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-4xl font-extrabold flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-500" />
            Testimonials
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {testimonials.length}
          </div>
        </div>

        {/* Testimonials List - Horizontal Cards */}
        <div className="flex flex-col gap-4">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-lg shadow-md p-6 animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            ))
          ) : testimonials.length > 0 ? (
            testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`rounded-lg shadow-md hover:shadow-lg p-6 transition-all ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex items-start justify-between gap-6">
                  {/* Left Side - User Info and Message */}
                  <div className="flex-1">
                    {/* User Info */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{testimonial.name}</h3>
                        {testimonial.role && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {testimonial.role}
                          </p>
                        )}
                      </div>
                      {/* Date */}
                      {testimonial.created_at && (
                        <p className="text-xs text-gray-400 ml-auto">
                          {new Date(testimonial.created_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      "{testimonial.message}"
                    </p>
                  </div>

                  {/* Right Side - Delete Button */}
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    disabled={deleting === testimonial.id}
                    className={`flex-shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      deleting === testimonial.id
                        ? "bg-red-300 text-red-800 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {deleting === testimonial.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <MessageSquare className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500 dark:text-gray-400">
                No testimonials yet. Users can submit reviews from the /about page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
