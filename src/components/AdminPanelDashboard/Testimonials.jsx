import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

export default function Testimonials({ isDarkMode = false }) {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch testimonials from database on component mount
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/testimonials");
      const data = await response.json();
      setTestimonials(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/testimonials/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Remove from UI after successful deletion
        setTestimonials(testimonials.filter((t) => t.id !== id));
        alert("Testimonial deleted successfully!");
      } else {
        alert("Failed to delete testimonial: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      alert("Error deleting testimonial");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <p className="text-xl">Loading testimonials...</p>
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
          What our community says about us
        </p>

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
              {/* Delete Button - Appears on Hover */}
              <button
                onClick={() => handleDelete(t.id)}
                className={`absolute top-4 right-4 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 ${
                  isDarkMode
                    ? "bg-red-500/20 hover:bg-red-500/30 text-red-400"
                    : "bg-red-50 hover:bg-red-100 text-red-600"
                }`}
                aria-label="Delete testimonial"
              >
                <Trash2 size={18} />
              </button>

              {/* Quote Icon */}
              <div className={`text-5xl mb-2 leading-none ${isDarkMode ? "text-gray-700" : "text-gray-200"}`}>
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
                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                  isDarkMode 
                    ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white" 
                    : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                }`}>
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
                  {new Date(t.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}