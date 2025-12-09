// src/components/Student_Dashboard/myProjects/ProjectSubmissionForm.jsx

import React, { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";

function ProjectSubmissionForm({ onProjectAdded }) {
  const { darkMode } = useTheme();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.id;
  const studentEmail = user?.email;

  const [formData, setFormData] = useState({
    student_email: studentEmail || "",
    title: "",
    description: "",
    tech_stack: "",
    contributions: "",
    is_open_source: false,
    github_pr_link: "",
  });

  const [modal, setModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
  });

  const openModal = ({ title, message, type = "info" }) => {
    setModal({ isOpen: true, title, message, type });
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

    // Validation
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
        body: JSON.stringify({
          ...formData,
          student_id: studentId,
        }),
      });

      if (response.ok) {
        const newProject = await response.json();
        
        openModal({
          title: "Success!",
          message: "Your project has been submitted successfully! 🎉",
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

        // Call callback to update parent
        if (onProjectAdded) {
          setTimeout(() => {
            onProjectAdded(newProject.project || newProject);
          }, 1000);
        }
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
    <div className={`p-6 sm:p-8 rounded-2xl shadow-lg border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
      <h2 className={`text-2xl sm:text-3xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
        Submit Your Project
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Student Email */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Student Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="student_email"
            value={formData.student_email}
            onChange={handleChange}
            placeholder="Your Student Email"
            className={`w-full border rounded-lg px-4 py-3 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* Title */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Project Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., E-Commerce Platform"
            className={`w-full border rounded-lg px-4 py-3 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* Tech Stack */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Technology Stack <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tech_stack"
            value={formData.tech_stack}
            onChange={handleChange}
            placeholder="React, Node.js, MongoDB, etc."
            className={`w-full border rounded-lg px-4 py-3 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* GitHub PR Link */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            GitHub PR/Repository Link
          </label>
          <input
            type="url"
            name="github_pr_link"
            value={formData.github_pr_link}
            onChange={handleChange}
            placeholder="https://github.com/username/project"
            className={`w-full border rounded-lg px-4 py-3 transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* Description */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Project Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            placeholder="Describe your project in detail..."
            className={`w-full border rounded-lg px-4 py-3 transition-all resize-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* Contributions */}
        <div>
          <label className={`block font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            Your Contributions <span className="text-red-500">*</span>
          </label>
          <textarea
            name="contributions"
            value={formData.contributions}
            onChange={handleChange}
            rows="3"
            placeholder="What did you contribute to this project?"
            className={`w-full border rounded-lg px-4 py-3 transition-all resize-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-white border-gray-300 text-gray-900 focus:border-blue-500"}`}
          />
        </div>

        {/* Open Source */}
        <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: darkMode ? '#374151' : '#f3f4f6' }}>
          <input
            type="checkbox"
            name="is_open_source"
            checked={formData.is_open_source}
            onChange={handleChange}
            className="w-4 h-4 cursor-pointer"
          />
          <label className={`font-medium cursor-pointer ${darkMode ? "text-gray-200" : "text-gray-700"}`}>
            Is this project open-source?
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
        >
          🚀 Submit Project
        </button>
      </form>

      {/* Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-2xl p-6 sm:p-8 max-w-md w-full border-t-4 ${getModalAccentClasses()} ${darkMode ? "bg-gray-900" : "bg-white"}`}
          >
            <h3 className={`text-2xl font-bold mb-3 ${darkMode ? "text-gray-100" : "text-gray-900"}`}>
              {modal.title}
            </h3>
            <p className={`mb-6 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {modal.message}
            </p>
            <button
              onClick={closeModal}
              className={`w-full py-2 rounded-lg font-semibold text-white transition-all ${darkMode ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-500 hover:bg-blue-600"}`}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectSubmissionForm;