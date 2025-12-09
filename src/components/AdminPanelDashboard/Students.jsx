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
  AlertCircle,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/students";

/* -----------------------------------------------
   CONFIRMATION MODAL
------------------------------------------------ */
const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  message,
  isDarkMode = false,
  confirmText = "Confirm",
  confirmColor = "red",
}) => {
  if (!isOpen) return null;

  const getColorClasses = () => {
    switch (confirmColor) {
      case "red":
        return "bg-red-500 hover:bg-red-600";
      case "blue":
        return "bg-blue-500 hover:bg-blue-600";
      case "yellow":
        return "bg-yellow-500 hover:bg-yellow-600";
      default:
        return "bg-red-500 hover:bg-red-600";
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: -20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
          className={`relative max-w-sm w-full rounded-2xl shadow-2xl p-8 ${
            isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
        >
          <div
            className={`flex justify-center mb-6 p-4 rounded-full w-fit mx-auto ${
              isDarkMode ? "bg-yellow-500/10" : "bg-yellow-50"
            }`}
          >
            <AlertCircle className="w-10 h-10 text-yellow-500" />
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-bold mb-2">Are you sure?</h2>
            <p
              className={`text-sm leading-relaxed ${
                isDarkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              {message}
            </p>
          </div>

          <div className="flex gap-3">
            <motion.button
              onClick={onCancel}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm transition-all ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-900 hover:bg-gray-300"
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </motion.button>

            <motion.button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 rounded-lg font-semibold text-sm text-white transition-all ${getColorClasses()}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {confirmText}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* -----------------------------------------------
   MAIN STUDENTS COMPONENT
------------------------------------------------ */
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

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    message: "",
    action: null,
    studentId: null,
    currentStatus: null,
  });

  const showConfirmation = (message, action, studentId, currentStatus = null) => {
    setConfirmModal({
      isOpen: true,
      message,
      action,
      studentId,
      currentStatus,
    });
  };

  const closeConfirmation = () => {
    setConfirmModal({
      isOpen: false,
      message: "",
      action: null,
      studentId: null,
      currentStatus: null,
    });
  };

  const handleConfirmAction = async () => {
    if (confirmModal.action === "delete") {
      await performDelete(confirmModal.studentId);
    } else if (confirmModal.action === "deactivate") {
      await performDeactivate(
        confirmModal.studentId,
        confirmModal.currentStatus
      );
    }
    closeConfirmation();
  };

  /* -----------------------------------------------
     FETCH ALL STUDENTS
  ------------------------------------------------ */
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

  /* -----------------------------------------------
     DELETE STUDENT
  ------------------------------------------------ */
  const handleDelete = (id) => {
    const student = students.find((s) => s.id === id);
    const name = student?.full_name || `ID ${id}`;
    showConfirmation(`Are you sure you want to delete ${name}?`, "delete", id);
  };

  const performDelete = async (id) => {
    const student = students.find((s) => s.id === id);
    const name = student?.full_name || `ID ${id}`;

    try {
      setIsDeleting(id);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token
        ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
        : { "Content-Type": "application/json" };

      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers,
      });

      const result = await res.json();

      if (result.success) {
        setStudents((prev) => prev.filter((s) => s.id !== id));

        // notify admins
        try {
          await fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "admin",
              type: "deletion",
              title: "Student deleted",
              message: `${name} was deleted (id: ${id}).`,
              metadata: { entity: "student", id },
            }),
          });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(null);
    }
  };

  /* -----------------------------------------------
     ACTIVATE / DEACTIVATE STUDENT
  ------------------------------------------------ */
  const handleDeactivate = (id, currentStatus) => {
    const student = students.find((s) => s.id === id);
    const name = student?.full_name || `ID ${id}`;

    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    showConfirmation(
      `Are you sure you want to change the status of ${name} to "${newStatus}"?`,
      "deactivate",
      id,
      currentStatus
    );
  };

  const performDeactivate = async (id, currentStatus) => {
    const student = students.find((s) => s.id === id);
    const name = student?.full_name || `ID ${id}`;
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    try {
      setIsDeactivating(id);
      await new Promise((r) => setTimeout(r, 800));

      setStudents((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: newStatus } : s
        )
      );

      // notify admins
      try {
        await fetch("http://localhost:5000/api/notifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: "admin",
            type: "status-change",
            title: "Student status updated",
            message: `${name} status changed to ${newStatus} (id: ${id}).`,
            metadata: { entity: "student", id, status: newStatus },
          }),
        });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeactivating(null);
    }
  };

  /* -----------------------------------------------
     FETCH STUDENT DETAILS
  ------------------------------------------------ */
  const fetchStudentDetails = async (studentId) => {
    try {
      setLoadingDetails(true);
      setSelectedStudent(studentId);

      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/${studentId}/details`, {
        headers,
      });
      const data = await res.json();

      if (data.success) {
        setStudentDetails(data.data);
      } else {
        setSelectedStudent(null);
      }
    } catch (err) {
      console.error(err);
      setSelectedStudent(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  /* -----------------------------------------------
     SEARCH STUDENTS
  ------------------------------------------------ */
  useEffect(() => {
    const timeout = setTimeout(async () => {
      const text = searchTerm.trim();

      if (!text) {
        fetchAllStudents();
        return;
      }

      try {
        setSearching(true);

        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(
          `${API_BASE_URL}/search?q=${encodeURIComponent(text)}`,
          { headers }
        );
        const data = await res.json();

        setStudents(data.success ? data.data || [] : []);
      } catch {
        setStudents([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchAllStudents]);

  /* -----------------------------------------------
     UI COMPONENT
  ------------------------------------------------ */
  return (
    <div
      className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onCancel={closeConfirmation}
        onConfirm={handleConfirmAction}
        message={confirmModal.message}
        isDarkMode={isDarkMode}
        confirmText={
          confirmModal.action === "delete" ? "Delete" : "Change Status"
        }
        confirmColor={confirmModal.action === "delete" ? "red" : "blue"}
      />

      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-4xl font-extrabold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Manage Students
        </div>

        {/* Search */}
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
              placeholder="Search by name & domain"
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

        {/* Students List */}
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
              const isActive = currentStatus === "Active";

              return (
                <motion.div
                  key={student.id}
                  layout
                  className={`rounded-lg shadow-md hover:shadow-lg p-6 transition-all ${
                    isDarkMode
                      ? "bg-gray-800 text-gray-100"
                      : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex flex-col gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-600 flex-shrink-0">
                        <User className="w-6 h-6 text-white" />
                      </div>

                      <div className="flex-1 min-w-0 flex flex-wrap items-center gap-2">
                        <h3 className="text-xl font-bold break-words">
                          {student.full_name}
                        </h3>
                        <span
                          className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                            isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm line-clamp-2">
                      {Array.isArray(student.domains_of_interest)
                        ? student.domains_of_interest.join(", ")
                        : student.domains_of_interest}
                    </p>
                  </div>

                  <div className="flex justify-end mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 gap-3">
                    <button
                      onClick={() =>
                        handleDeactivate(student.id, currentStatus)
                      }
                      disabled={isDeactivating === student.id}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        isDeactivating === student.id
                          ? "bg-blue-300 text-blue-800 cursor-not-allowed"
                          : "bg-blue-500 text-white hover:bg-blue-600"
                      }`}
                    >
                      {isDeactivating === student.id
                        ? "Updating..."
                        : isActive
                        ? "Deactivate"
                        : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(student.id)}
                      disabled={isDeleting === student.id}
                      className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        isDeleting === student.id
                          ? "bg-red-300 text-red-800 cursor-not-allowed"
                          : "bg-red-500 text-white hover:bg-red-600"
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
              <p className="text-gray-500">
                {searchTerm
                  ? "No students found matching your search."
                  : "No students found."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Student Details Modal */}
      <AnimatePresence>
        {selectedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <div
                className={`sticky top-0 z-10 p-6 border-b flex justify-between items-center ${
                  isDarkMode
                    ? "bg-gray-800 border-gray-700"
                    : "bg-white border-gray-200"
                }`}
              >
                <h2 className="text-2xl font-bold">Student Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : studentDetails ? (
                  <div className="space-y-6">
                    <div
                      className={`p-6 rounded-lg ${
                        isDarkMode ? "bg-gray-700" : "bg-gray-50"
                      }`}
                    >
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Profile Information
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Full Name
                          </p>
                          <p className="font-semibold">
                            {studentDetails.profile?.full_name ||
                              studentDetails.profile?.profile_full_name ||
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Email
                          </p>
                          <p className="font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {studentDetails.profile?.email || "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Phone
                          </p>
                          <p className="font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {studentDetails.profile?.phone ||
                              studentDetails.profile?.contact_number ||
                              "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Status
                          </p>
                          <p
                            className={`font-semibold ${
                              studentDetails.profile?.profile_completed
                                ? "text-green-500"
                                : "text-yellow-500"
                            }`}
                          >
                            {studentDetails.profile?.profile_completed
                              ? "Completed"
                              : "Incomplete"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-center py-8">No details available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
