import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";

const MentorCard = ({ mentor, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-3 transition-colors duration-300">
      {/* Top section: Name + Right-side buttons */}
      <div className="flex items-start justify-between">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
          {mentor.full_name}
        </h4>
        
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={() => onDelete(mentor.id)}
            className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md flex items-center gap-2"
          >
            <FaTrash />
            Delete
          </button>
            <br></br>
          <button
            onClick={() => setShowDetails(true)}
            className="text-blue-500 hover:text-blue-700 text-lg"
            title="View Details"
          >
            <FaEye />
          </button>
          
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-xl p-6 w-96 relative shadow-2xl">
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 text-lg"
            >
              ✕
            </button>

            <h2 className="text-2xl font-semibold mb-4 text-center">
              {mentor.full_name}
            </h2>

            <div className="flex flex-col gap-3 text-lg">
              <p>
                <strong>Expertise:</strong>{" "}
                {mentor.expertise_domains?.join(", ") || "N/A"}
              </p>
              <p>
                <strong>Students Trained:</strong>{" "}
                {mentor.studentsTrained || "N/A"}
              </p>
              <p>
                <strong>Current Projects:</strong>{" "}
                {mentor.currentProjects || "N/A"}
              </p>
              <p>
                <strong>LinkedIn:</strong>{" "}
                {mentor.linkedin_url ? (
                  <a
                    href={mentor.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>GitHub:</strong>{" "}
                {mentor.github_url ? (
                  <a
                    href={mentor.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Profile
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Phone:</strong> {mentor.phone || "N/A"}
              </p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Mentors({ isDarkMode }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchMentors = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/mentors`);
      setMentors(res.data || []);
    } catch (err) {
      console.error("Failed to load mentors", err);
      setError("Unable to load mentors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const deleteMentor = async (id) => {
    if (!window.confirm("Delete this mentor?")) return;
    try {
      await axios.delete(`${API_BASE}/api/mentors/${id}`);
      setMentors((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("Failed to delete mentor", err);
      alert("Failed to delete mentor");
    }
  };

  // ✅ Dark mode toggle
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  if (loading) return <div className="p-4">Loading mentors...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h2
        className={`text-2xl font-semibold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        Mentors
      </h2>

      {mentors.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No mentors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} onDelete={deleteMentor} />
          ))}
        </div>
      )}
    </section>
  );
}
