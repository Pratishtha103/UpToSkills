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
import { toast } from "react-toastify";

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

  // 🔹 CONFIRM POPUP STATE
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  /* ================= FETCH ALL ================= */
  const fetchAllStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(API_BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setStudents(data.success ? data.data : []);
    } catch {
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllStudents();
  }, [fetchAllStudents]);

  /* ================= DELETE ================= */
  const handleDelete = (id) => {
    const student = students.find((s) => s.id === id);
    setConfirmConfig({
      title: "Delete Student",
      message: `Are you sure you want to delete ${student?.full_name}?`,
      onConfirm: () => confirmDelete(id),
    });
    setShowConfirm(true);
  };

  const confirmDelete = async (id) => {
    setShowConfirm(false);
    try {
      setIsDeleting(id);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.success) {
        setStudents((s) => s.filter((x) => x.id !== id));
        toast.success("Student deleted successfully");
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error("Error deleting student");
    } finally {
      setIsDeleting(null);
    }
  };

  /* ================= ACTIVATE / DEACTIVATE ================= */
  const handleDeactivate = (id, status) => {
    const student = students.find((s) => s.id === id);
    const newStatus = status === "Active" ? "Inactive" : "Active";

    setConfirmConfig({
      title: "Change Student Status",
      message: `Change status of ${student?.full_name} to "${newStatus}"?`,
      onConfirm: () => confirmStatusChange(id, newStatus),
    });
    setShowConfirm(true);
  };

  const confirmStatusChange = async (id, newStatus) => {
    setShowConfirm(false);
    try {
      setIsDeactivating(id);
      await new Promise((r) => setTimeout(r, 500));
      setStudents((s) =>
        s.map((x) => (x.id === id ? { ...x, status: newStatus } : x))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsDeactivating(null);
    }
  };

  /* ================= SEARCH ================= */
  useEffect(() => {
    const t = setTimeout(async () => {
      if (!searchTerm.trim()) {
        fetchAllStudents();
        return;
      }
      try {
        setSearching(true);
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_BASE_URL}/search?q=${encodeURIComponent(searchTerm)}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        setStudents(data.success ? data.data : []);
      } catch {
        setStudents([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [searchTerm, fetchAllStudents]);

  /* ================= DETAILS ================= */
  const fetchStudentDetails = async (id) => {
    try {
      setSelectedStudent(id);
      setLoadingDetails(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/${id}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!data.success) return toast.error("Failed to load details");
      setStudentDetails(data.data);
    } catch {
      toast.error("Error loading details");
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold flex items-center gap-2 mb-6">
        <Users /> Manage Students
      </h1>

      {/* SEARCH */}
      <div className="mb-6 relative">
        <Search className="absolute left-3 top-3 text-gray-400" />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search students"
          className="w-full pl-10 py-2 rounded-lg border dark:bg-gray-800"
        />
        {searching && (
          <Loader2 className="absolute right-4 top-3 animate-spin" />
        )}
      </div>

      {/* STUDENTS */}
      <div className="grid md:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading...</p>
        ) : students.length ? (
          students.map((s) => (
            <div
              key={s.id}
              className="p-5 rounded-xl shadow bg-white dark:bg-gray-800"
            >
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{s.full_name}</h3>
                <button onClick={() => fetchStudentDetails(s.id)}>
                  <Eye />
                </button>
              </div>

              <p className="text-sm mt-2">{s.domains_of_interest}</p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => handleDeactivate(s.id, s.status)}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  {s.status === "Active" ? "Deactivate" : "Activate"}
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  Dekete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No students found</p>
        )}
      </div>

      {/* ================= CONFIRM POPUP ================= */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className={`p-6 rounded-xl w-full max-w-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h3 className="text-xl font-bold mb-2">
                {confirmConfig.title}
              </h3>
              <p className="text-gray-500 mb-6">
                {confirmConfig.message}
              </p>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Students;
