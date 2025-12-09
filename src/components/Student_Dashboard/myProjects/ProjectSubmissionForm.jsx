// src/components/Student_Dashboard/myProjects/ProjectSubmissionForm.jsx

import React, { useState } from "react";
import Footer from "../../Student_Dashboard/dashboard/Footer";

function ProjectSubmissionForm() {
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.id; // ✅ get studentId
  const studentEmail = user?.email; // (optional, auto-fill email)

  const [formData, setFormData] = useState({
    student_email: studentEmail || "",
    title: "",
    description: "",
    tech_stack: "",
    contributions: "",
    is_open_source: false,
    github_pr_link: "",
  });

  // 🔔 Modal state (used for success + errors)
  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // "success" | "error" | "info"
  });

  const openModal = ({ title, message, type = "info" }) => {
    setModal({
      isOpen: true,
      title,
      message,
      type,
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation (now using popup instead of alert)
    if (!formData.student_email)
      return openModal({
        title: "Missing Information",
        message: "Student Email is required.",
        type: "error",
      });

    if (!formData.title)
      return openModal({
        title: "Missing Information",
        message: "Project Title is required.",
        type: "error",
      });

    if (!formData.tech_stack)
      return openModal({
        title: "Missing Information",
        message: "Technology Stack is required.",
        type: "error",
      });

    if (!formData.description)
      return openModal({
        title: "Missing Information",
        message: "Project Description is required.",
        type: "error",
      });

    if (!formData.contributions)
      return openModal({
        title: "Missing Information",
        message: "Contributions field is required.",
        type: "error",
      });

    // Token Auth
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      openModal({
        title: "Not Logged In",
        message: "You are not logged in. Please log in again to submit your project.",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        // 🔥 ADD student_id automatically
        body: JSON.stringify({
          ...formData,
          student_id: studentId,
        }),
      });

      if (response.ok) {
        // ✅ Success confirmation message in popup
        openModal({
          title: "Project Submitted",
          message: "Your project has been submitted successfully!",
          type: "success",
        });

        // Reset form
        setFormData({
          student_email: studentEmail || "",
          title: "",
          description: "",
          tech_stack: "",
          contributions: "",
          is_open_source: false,
          github_pr_link: "",
        });
      } else {
        const err = await response.json();
        openModal({
          title: "Submission Failed",
          message: `Failed to submit project: ${
            err.message || "Server error. Please try again later."
          }`,
          type: "error",
        });
      }
    } catch (error) {
      console.error(error);
      openModal({
        title: "Network Error",
        message: "Network error. Please check your connection and try again.",
        type: "error",
      });
    }
  };

  // Decide border color based on modal type
  const getModalAccentClasses = () => {
    switch (modal.type) {
      case "success":
        return "border-green-500";
      case "error":
        return "border-red-500";
      default:
        return "border-indigo-500";
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700">
          <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
            Student Project Submission
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student Email */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Student Email
              </label>
              <input
                type="email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
                placeholder="Your Student Email"
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Project Title"
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Technology Stack
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React, Node.js..."
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              />
            </div>

            {/* GitHub PR */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                GitHub PR Link
              </label>
              <input
                type="url"
                name="github_pr_link"
                value={formData.github_pr_link}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              ></textarea>
            </div>

            {/* Contributions */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Your Contributions
              </label>
              <textarea
                name="contributions"
                value={formData.contributions}
                onChange={handleChange}
                rows="3"
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-gray-800"
              ></textarea>
            </div>

            {/* Open Source */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_open_source"
                checked={formData.is_open_source}
                onChange={handleChange}
              />
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Is this project open-source?
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl"
            >
              🚀 Submit Project
            </button>
          </form>
        </div>
      </div>

      {/* Centered Popup Modal (for confirmation + errors) */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 max-w-md w-full border-t-4 ${getModalAccentClasses()}`}
          >
            <h3 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-gray-100">
              {modal.title || "Message"}
            </h3>
            <p className="text-center text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              className="block mx-auto mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default ProjectSubmissionForm;
