// src/components/Student_Dashboard/myProjects/ProjectSubmissionForm.jsx

import React, { useState } from "react";
import Footer from "../../Student_Dashboard/dashboard/Footer";

function ProjectSubmissionForm({ isDarkMode }) {
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

  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.student_email) return alert("Student Email is required.");
    if (!formData.title) return alert("Project Title is required.");
    if (!formData.tech_stack) return alert("Technology Stack is required.");
    if (!formData.description) return alert("Description is required.");
    if (!formData.contributions) return alert("Contributions is required.");

    // Token Auth
    const authToken = localStorage.getItem("token");
    if (!authToken) {
      alert("You are not logged in. Please log in again.");
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
        setShowModal(true);
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
        alert(`Failed to submit project: ${err.message || "Server error"}`); // ✅ Fixed: Added backticks
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Try again later.");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className={`bg-white p-8 rounded-2xl shadow-2xl w-full max-w-3xl border ${
          isDarkMode 
            ? "dark:bg-gray-900 dark:border-gray-700" 
            : "bg-white border-gray-200"
        }`}>
          
          <h2 className={`text-3xl font-extrabold text-center mb-4 ${
            isDarkMode ? "text-indigo-400" : "text-indigo-700"
          }`}>
            Student Project Submission
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Student Email */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Student Email
              </label>
              <input
                type="email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
                placeholder="Your Student Email"
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Title */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Project Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Project Title"
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Tech Stack */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Technology Stack
              </label>
              <input
                type="text"
                name="tech_stack"
                value={formData.tech_stack}
                onChange={handleChange}
                placeholder="React, Node.js..."
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* GitHub PR */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                GitHub PR Link
              </label>
              <input
                type="url"
                name="github_pr_link"
                value={formData.github_pr_link}
                onChange={handleChange}
                placeholder="https://github.com/..."
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Description */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              ></textarea>
            </div>

            {/* Contributions */}
            <div>
              <label className={`block font-semibold mb-1 ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Your Contributions
              </label>
              <textarea
                name="contributions"
                value={formData.contributions}
                onChange={handleChange}
                rows="3"
                className={`w-full border rounded-xl px-4 py-3 ${
                  isDarkMode 
                    ? "bg-gray-800 border-gray-600 text-white" 
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              ></textarea>
            </div>

            {/* Open Source */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                name="is_open_source"
                checked={formData.is_open_source}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label className={`font-medium ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}>
                Is this project open-source?
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition-colors"
            >
              🚀 Submit Project
            </button>
          </form>

          {/* Success Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className={`rounded-2xl p-8 ${
                isDarkMode ? "bg-gray-900" : "bg-white"
              }`}>
                <h3 className={`text-2xl font-bold text-center mb-4 ${
                  isDarkMode ? "text-green-400" : "text-green-600"
                }`}>
                  ✅ Project Submitted!
                </h3>
                <button
                  onClick={closeModal}
                  className="block mx-auto bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProjectSubmissionForm;