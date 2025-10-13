// src/components/AdminPanelDashboard/Students.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { User, Search, Loader2, Users } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/students";

const Students = ({ isDarkMode }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);

  const fetchAllStudents = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      if (data.success) setStudents(data.data || []);
      else setStudents([]);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  const handleDelete = async (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    const studentName = studentToDelete?.full_name || `ID ${id}`;
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`))
      return;

    try {
      setIsDeleting(id);
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      const result = await res.json();
      if (result.success) {
        setStudents((current) => current.filter((s) => s.id !== id));
      } else {
        alert(result.message || "Failed to delete student");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting student");
    } finally {
      setIsDeleting(null);
    }
  };

  // Search functionality
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchTerm.trim()) {
        fetchAllStudents();
        return;
      }
      try {
        setSearching(true);
        const res = await fetch(`${API_BASE_URL}/search/${searchTerm}`);
        const data = await res.json();
        if (data.success) setStudents(data.data);
        else setStudents([]);
      } catch (err) {
        console.error(err);
      } finally {
        setSearching(false);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [searchTerm, fetchAllStudents]);

  return (
    <div
      className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-4xl font-extrabold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Manage Students
        </div>

        {/* Search Bar */}
        <div
          className={`p-4 shadow-md rounded-lg border transition-colors duration-300 ${
            isDarkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
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

        {/* Students Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-lg shadow-md p-6 animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              ></div>
            ))
          ) : students.length > 0 ? (
            students.map((student) => (
              <motion.div
                key={student.id}
                layout
                className={`rounded-lg shadow-md hover:shadow-lg p-6 transition-all ${
                  isDarkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">
                      {student.full_name}
                    </h3>
                    <p className="text-sm line-clamp-2">
                      {Array.isArray(student.domains_of_interest)
                        ? student.domains_of_interest.join(", ")
                        : student.domains_of_interest}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={isDeleting === student.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                      isDeleting === student.id
                        ? "bg-red-300 text-red-800 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600"
                    }`}
                  >
                    {isDeleting === student.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <p>No students found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Students;
