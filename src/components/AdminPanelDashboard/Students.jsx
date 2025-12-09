// src/components/AdminPanelDashboard/Students.jsx

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Search,
  Loader2,
  Users,
  Eye,
  X,
  Award,
  BookOpen,
  Calendar,
  Github,
  Linkedin,
  Mail,
  Phone,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/students";

const Students = ({ isDarkMode }) => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(null);
  const [isDeactivating, setIsDeactivating] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchAllStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await fetch(API_BASE_URL, { headers });
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
    if (!window.confirm(`Are you sure you want to delete ${studentName}?`)) return;

    try {
      setIsDeleting(id);
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE", headers });
      const result = await res.json();
      if (result.success) {
        setStudents((current) => current.filter((s) => s.id !== id));
        // Notify admins about this deletion
        try {
          await fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "admin",
              type: "deletion",
              title: "Student deleted",
              message: `${studentName} was deleted (id: ${id}).`,
              metadata: { entity: "student", id },
            }),
          });
        } catch (notifErr) {
          console.error("Failed to create notification:", notifErr);
        }
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

  const handleDeactivate = async (id, currentStatus) => {
    const studentToUpdate = students.find((s) => s.id === id);
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    const studentName = studentToUpdate?.full_name || `ID ${id}`;

    if (!window.confirm(`Are you sure you want to change the status of ${studentName} to "${newStatus}"?`))
      return;

    try {
      setIsDeactivating(id);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setStudents((current) =>
        current.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );
      alert(`Successfully set ${studentName} status to ${newStatus}.`);

      // Notify admins about status change
      try {
        await fetch("http://localhost:5000/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "admin",
            type: "status-change",
            title: "Student status updated",
            message: `${studentName} status changed to ${newStatus} (id: ${id}).`,
            metadata: { entity: "student", id, status: newStatus },
          }),
        });
      } catch (notifErr) {
        console.error("Failed to create notification:", notifErr);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert(`Failed to change student status to ${newStatus}.`);
    } finally {
      setIsDeactivating(null);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      setLoadingDetails(true);
      setSelectedStudent(studentId);
      setStudentDetails(null);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/${studentId}/details`, { headers });
      const data = await res.json();
      if (!data.success) {
        alert("Failed to load student details");
        setSelectedStudent(null);
        setLoadingDetails(false);
        return;
      }

      const details = data.data;

      let interviewsCount = 0;
      try {
        let ivRes = await fetch(`http://localhost:5000/api/interviews?studentId=${studentId}`, { headers });
        if (!ivRes.ok) ivRes = await fetch(`http://localhost:5000/api/interviews/student/${studentId}`, { headers });
        if (ivRes.ok) {
          const ivData = await ivRes.json();
          if (Array.isArray(ivData)) interviewsCount = ivData.length;
          else if (ivData?.success && Array.isArray(ivData.data)) interviewsCount = ivData.data.length;
          else if (Array.isArray(ivData?.data)) interviewsCount = ivData.data.length;
        }
      } catch (ivErr) {
        console.warn("Interview fetch failed:", ivErr);
        interviewsCount = 0;
      }

      const mergedDetails = {
        ...details,
        stats: {
          ...details.stats,
          interviewsCount: typeof interviewsCount === "number" ? interviewsCount : 0,
        },
      };

      setStudentDetails(mergedDetails);
    } catch (err) {
      console.error("Error fetching student details:", err);
      alert("Error loading student details");
      setSelectedStudent(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      const trimmedSearch = searchTerm.trim();
      if (!trimmedSearch) {
        fetchAllStudents();
        return;
      }

      try {
        setSearching(true);
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(trimmedSearch)}`, { headers });
        const data = await res.json();
        if (data.success) setStudents(data.data || []);
        else setStudents([]);
      } catch (err) {
        console.error("Search error:", err);
        setStudents([]);
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
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name"
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
            students.map((student) => {
              const currentStatus = student.status || "Active";
              const isCurrentlyActive = currentStatus === "Active";

              return (
                <motion.div
                  key={student.id}
                  layout
                  className={`rounded-lg shadow-md hover:shadow-lg p-6 transition-all overflow-hidden break-words ${
                    isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold truncate">{student.full_name}</h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            isCurrentlyActive ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {currentStatus}
                        </span>
                        <button
                          onClick={() => fetchStudentDetails(student.id)}
                          className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-blue-600 dark:text-blue-400 ml-1 flex-shrink-0"
                          title="View Details"
                          aria-label={`View details for ${student.full_name}`}
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="text-sm line-clamp-2 break-words">
                        {Array.isArray(student.domains_of_interest)
                          ? student.domains_of_interest.join(", ")
                          : student.domains_of_interest}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-3 flex-wrap">
                    <button
                      onClick={() => handleDeactivate(student.id, currentStatus)}
                      disabled={isDeactivating === student.id}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        isDeactivating === student.id
                          ? "bg-blue-300 text-blue-800 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isDeactivating === student.id ? "Updating..." : isCurrentlyActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={isDeleting === student.id}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        isDeleting === student.id ? "bg-red-300 text-red-800 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
                      }`}
                    >
                      {isDeleting === student.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">{searchTerm ? "No students found matching your search." : "No students found."}</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal code remains unchanged */}
      {/* ... */}
    </div>
  );
};

export default Students;
