import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrash, FaPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";

export default function AssignedPrograms({ isDarkMode }) {
  const [programs, setPrograms] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedMentor, setSelectedMentor] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  // 🔔 CONFIRM POPUP STATE
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({
    title: "",
    message: "",
    onConfirm: null,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setErrorMessage("");
    setLoading(true);
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const programsRes = await axios.get("http://localhost:5000/api/courses");
      setPrograms(programsRes.data || []);
    } catch {
      setErrorMessage("Failed to load programs.");
      setLoading(false);
      return;
    }

    try {
      const mentorsRes = await axios.get("http://localhost:5000/api/mentors", {
        headers,
      });
      setMentors(
        mentorsRes.data?.data ||
          mentorsRes.data?.mentors ||
          mentorsRes.data ||
          []
      );
    } catch {
      setErrorMessage("Failed to load mentors.");
      setLoading(false);
      return;
    }

    try {
      const assignRes = await axios.get(
        "http://localhost:5000/api/assigned-programs",
        { headers }
      );
      setAssignments(assignRes.data?.data || assignRes.data || []);
    } catch {
      setErrorMessage("Failed to load assigned programs.");
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  /* ================= ASSIGN PROGRAM ================= */
  const handleAssignProgram = () => {
    if (!selectedProgram || !selectedMentor) return;

    const program = programs.find((p) => String(p.id) === selectedProgram);
    const mentor = mentors.find((m) => String(m.id) === selectedMentor);

    setConfirmConfig({
      title: "Assign Program",
      message: `Assign "${program?.title}" to ${mentor?.full_name}?`,
      onConfirm: confirmAssignProgram,
    });
    setShowConfirm(true);
  };

  const confirmAssignProgram = async () => {
    setShowConfirm(false);
    try {
      setAssignLoading(true);
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await axios.post(
        "http://localhost:5000/api/assigned-programs",
        {
          course_id: selectedProgram,
          mentor_id: selectedMentor,
        },
        { headers }
      );

      if (res.data.success) {
        setAssignments([res.data.data, ...assignments]);
        setSelectedProgram("");
        setSelectedMentor("");
      }
    } finally {
      setAssignLoading(false);
    }
  };

  /* ================= REMOVE ASSIGNMENT ================= */
  const handleRemoveAssignment = (id) => {
    setConfirmConfig({
      title: "Remove Assignment",
      message: "Are you sure you want to remove this assignment?",
      onConfirm: () => confirmRemoveAssignment(id),
    });
    setShowConfirm(true);
  };

  const confirmRemoveAssignment = async (id) => {
    setShowConfirm(false);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.delete(
        `http://localhost:5000/api/assigned-programs/${id}`,
        { headers }
      );
      setAssignments(assignments.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Failed to remove assignment", err);
    }
  };

  const formatDate = (date) =>
    new Date(date).toISOString().split("T")[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen p-6 text-red-600">{errorMessage}</div>
    );
  }

  return (
    <main
      className={`min-h-screen p-6 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h1 className="text-3xl font-bold mb-6">
        Assign Programs to Mentors
      </h1>

      {/* ASSIGN FORM */}
      <section
        className={`p-6 rounded-lg mb-8 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex gap-4 mb-4">
          <select
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="flex-1 p-2 rounded border"
          >
            <option value="">Select Program</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          <select
            value={selectedMentor}
            onChange={(e) => setSelectedMentor(e.target.value)}
            className="flex-1 p-2 rounded border"
          >
            <option value="">Select Mentor</option>
            {mentors.map((m) => (
              <option key={m.id} value={m.id}>
                {m.full_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleAssignProgram}
          disabled={assignLoading}
          className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded"
        >
          <FaPlus /> {assignLoading ? "Assigning..." : "Assign Program"}
        </button>
      </section>

      {/* ASSIGNMENTS TABLE */}
      <section
        className={`rounded-lg overflow-hidden ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <table className="w-full">
          <thead className="bg-gray-200 dark:bg-gray-700">
            <tr>
              <th className="p-3 text-left">Program</th>
              <th className="p-3 text-left">Mentor</th>
              <th className="p-3 text-left">Assigned On</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-3">{a.program_name}</td>
                <td className="p-3">{a.mentor_name}</td>
                <td className="p-3">{formatDate(a.assigned_on)}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleRemoveAssignment(a.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded"
                  >
                    <FaTrash /> Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ================= CONFIRM MODAL ================= */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className={`p-6 rounded-xl w-full max-w-md ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              }`}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
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
                  className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConfig.onConfirm}
                  className="px-4 py-2 rounded bg-red-600 text-white"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
