// src/components/Student_Dashboard/myProjects/ProjectSubmissionForm.jsx

import React, { useState } from "react";
import Footer from "../../Student_Dashboard/dashboard/Footer";

function ProjectSubmissionForm() {
  const [formData, setFormData] = useState({
    // ✅ CHANGED: student_mail_id → student_email (to match backend)
    student_email: "",
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

    // ✅ VALIDATION BLOCK - Updated field name
    if (!formData.student_email || formData.student_email.trim() === '') {
      alert("Student Email is required.");
      return;
    }

    if (!formData.title || formData.title.trim() === '') {
      alert("Project Title is required.");
      return;
    }

    if (!formData.tech_stack || formData.tech_stack.trim() === '') {
      alert("Technology Stack is required.");
      return;
    }

    if (!formData.description || formData.description.trim() === '') {
      alert("Project Description is required.");
      return;
    }

    if (!formData.contributions || formData.contributions.trim() === '') {
      alert("Your Contributions is required.");
      return;
    }

    // 🌟 FIX: Retrieve the Auth Token 🌟
    const authToken = localStorage.getItem("token");
    
    if (!authToken) {
      alert("You are not logged in. Please log in and try again.");
      console.error("Authentication token not found.");
      return; 
    }

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`, 
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true);
        // Clear the form data upon successful submission
        setFormData({
          student_email: "",
          title: "",
          description: "",
          tech_stack: "",
          contributions: "",
          is_open_source: false,
          github_pr_link: "",
        });
      } else if (response.status === 401) {
         alert(`Failed to submit project: Session expired or invalid token. Please log in again.`);
      } else {
        const errorData = await response.json();
        const message = errorData.message || errorData.error || 'Server error';
        alert(`Failed to submit project: ${message}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An unexpected error occurred. Please check your network connection.");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    // Outer flex container that handles the entire layout (content + footer)
    <div className="flex flex-col min-h-screen">
      
      {/* Main Content Wrapper - Use flex-grow to take up available space */}
      <div className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
        
        {/* Card Container - max-w-3xl for wider card and mx-auto for centering */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700 relative transition-all duration-500">
          
          {/* Header */}
          <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
            Student Project Submission
          </h2>
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Submit your project details below.
          </p>

          {/* Form - Use space-y-4 for slightly better spacing on a large form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {[
              {
                label: "Student Mail ID",
                name: "student_email", // ✅ CHANGED: student_mail_id → student_email
                type: "email",
                placeholder: "Your Student Mail ID (e.g., student@mail.com)",
              },
              {
                label: "Project Title",
                name: "title",
                type: "text",
                placeholder: "Project Title",
              },
              {
                label: "Technology Stack",
                name: "tech_stack",
                type: "text",
                placeholder: "React, Node.js...",
              },
              {
                label: "GitHub PR Link",
                name: "github_pr_link",
                type: "url",
                placeholder: "https://github.com/...",
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                  required={field.name !== "github_pr_link"}
                />
              </div>
            ))}

            {/* Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                Project Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief project description..."
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                rows="4"
                required
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
                placeholder="E.g., frontend, backend..."
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Open Source */}
            <div className="flex items-center pt-2 space-x-3">
              <input
                type="checkbox"
                name="is_open_source"
                checked={formData.is_open_source}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700"
              />
              <label className="text-gray-700 dark:text-gray-300 font-medium">
                Is this project open-source?
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-400 dark:hover:shadow-indigo-800 mt-6"
            >
              🚀 Submit Project
            </button>
          </form>

          {/* Success Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md transform scale-100 transition-all border border-gray-200 dark:border-gray-700">
                <h3 className="text-2xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
                  ✅ Project Submitted!
                </h3>
                <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
                  Your project has been submitted successfully.
                </p>
                <button
                  onClick={closeModal}
                  className="block mx-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-5 rounded-lg transition duration-300"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer is now a sibling of the main content wrapper */}
      <Footer />
    </div>
  );
}

export default ProjectSubmissionForm;