import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  User,
  Search,
  Linkedin,
  Trash2,
  Loader2,
  Users,
  Sun,
  Moon,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/students";

const Students = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🌓 Load & Apply Theme on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDarkMode(true);
    } else {
      root.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // 🌓 Handle Theme Toggle
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    if (newTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", newTheme);
  };

  // Fetch all students
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

  // Delete student
  const handleDelete = async (id) => {
    const studentToDelete = students.find((s) => s.id === id);
    const studentName = studentToDelete?.full_name || `ID ${id}`;

    if (
      !window.confirm(
        `Are you sure you want to delete ${studentName}? This action cannot be undone.`
      )
    )
      return;

    try {
      setIsDeleting(id);
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result.success) {
        setStudents((current) => current.filter((s) => s.id !== id));
      } else {
        alert(result.message || "Failed to delete student");
      }
    } catch (err) {
      console.error("Deletion network error:", err);
      alert("Error deleting student. Check backend connection.");
    } finally {
      setIsDeleting(null);
    }
  };

  // Search with debounce
  useEffect(() => {
    if (isDeleting) return;

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
        console.error("Search error:", err);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchAllStudents, isDeleting]);

  // Exit animation for delete
  const itemVariants = {
    exit: { opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 font-inter transition-all duration-300">
      <main className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Heading + Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mt-4 mb-4 flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-600" />
            Manage Students
          </div>
          <motion.button
            onClick={toggleTheme}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-400" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </motion.button>
        </div>

        {/* Search Bar */}
        <div className="stat-card p-4 shadow-md bg-white dark:bg-gray-800 transition-all duration-300">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-400 outline-none transition-all"
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
                key={`skeleton-${idx}`}
                className="stat-card p-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
              />
            ))
          ) : students.length > 0 ? (
            students.map((student) => (
              <motion.div
                key={student.id}
                layout
                variants={itemVariants}
                exit="exit"
                className="stat-card p-6 hover:shadow-lg hover:ring-1 hover:ring-indigo-200 dark:hover:ring-indigo-500 transition-all duration-200 bg-white dark:bg-gray-800 rounded-lg"
              >
                {/* Student Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 truncate">
                      {student.full_name || "Unnamed"}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-300 line-clamp-2">
                      {Array.isArray(student.domains_of_interest)
                        ? student.domains_of_interest.join(", ")
                        : student.domains_of_interest || "No domain info"}
                    </p>
                  </div>
                </div>

                {/* Optional info */}
                {student.email && (
                  <p className="text-sm text-gray-400 dark:text-gray-300 mt-1 truncate">
                    Email: {student.email}
                  </p>
                )}
                {student.phone && (
                  <p className="text-sm text-gray-400 dark:text-gray-300 mt-1 truncate">
                    Phone: {student.phone}
                  </p>
                )}
                {student.graduation_year && (
                  <span className="text-xs font-medium text-indigo-600 bg-indigo-100 dark:bg-indigo-700 dark:text-indigo-200 px-3 py-1 rounded-full mt-2 shadow-sm inline-block">
                    Grad {student.graduation_year}
                  </span>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  {student.linkedin_url ? (
                    <a
                      href={student.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-800 text-blue-600 dark:text-blue-200 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-700 hover:text-blue-700 transition-all duration-200 shadow-sm text-sm"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span>LinkedIn Profile</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500 text-sm italic">
                      No LinkedIn link
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(student.id)}
                    disabled={isDeleting === student.id}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md flex-shrink-0
                        ${
                          isDeleting === student.id
                            ? "bg-red-200 text-red-700 cursor-not-allowed dark:bg-red-600 dark:text-red-200"
                            : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 dark:text-white"
                        }`}
                  >
                    {isDeleting === student.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {isDeleting === student.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full p-10 text-center stat-card shadow-inner text-gray-500 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg">
              <Search className="w-12 h-12 mx-auto mb-4 text-gray-300 dark:text-gray-400" />
              <p className="text-xl font-semibold">No students found.</p>
              <p>
                Ensure your backend server at <b>http://localhost:5000</b> is
                running and accessible.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Students;
