//Mentors.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
import { Search, Loader2,Users } from "lucide-react";

const MentorCard = ({ mentor, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 flex flex-col gap-3 transition-colors duration-300">
      {/* Header (Name + Buttons) */}
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
          <button
            onClick={() => setShowDetails(true)}
            className="text-blue-500 hover:text-blue-700 text-lg"
            title="View Details"
          >
            <FaEye />
          </button>
        </div>
      </div>

      {/* Email & Phone */}
      <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
        {mentor.email && <p>{mentor.email}</p>}
        {mentor.phone && <p>{mentor.phone}</p>}
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
                <strong>About:</strong> {mentor.about_me || "N/A"}
              </p>
              <p>
                <strong>Phone:</strong> {mentor.phone || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {mentor.email || "N/A"}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const fetchMentors = async () => {
    try {
      setSearching(true);
      const res = await axios.get(`${API_BASE}/api/mentors`);
      setMentors(res.data || []);
    } catch (err) {
      console.error("Failed to load mentors", err);
      setError("Unable to load mentors");
    } finally {
      setLoading(false);
      setSearching(false);
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

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  const filteredMentors = mentors.filter((m) => {
    const nameMatch = m.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const expertiseMatch = m.expertise_domains
      ?.join(", ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return nameMatch || expertiseMatch;
  });

  if (loading) return <div className="p-4">Loading mentors...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <section className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="text-4xl font-extrabold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Manage Mentors
        </div>
     <br />
      {/* SEARCH BAR  */}
      <div
        className={`p-4 shadow-md rounded-lg border transition-colors duration-300 mb-8 ${
          isDarkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white border-gray-300"
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search mentors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none ${
              isDarkMode
                ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
            }`}
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

      {/* Mentor Cards */}
      {filteredMentors.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">
          No mentors found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((m) => (
            <MentorCard key={m.id} mentor={m} onDelete={deleteMentor} />
          ))}
        </div>
      )}
    </section>
  );
}
