import React, { useState } from "react";

function ProjectSubmissionForm() {
  const [formData, setFormData] = useState({
    student_id: "",
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

    try {
      const response = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowModal(true);
        setFormData({
          student_id: "",
          title: "",
          description: "",
          tech_stack: "",
          contributions: "",
          is_open_source: false,
          github_pr_link: "",
        });
      } else {
        alert("Failed to submit project");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 to-indigo-200 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10 transition-colors duration-500">
      <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-xl border border-gray-200 dark:border-gray-700 relative transition-all duration-500">
        <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
          Student Project Submission
        </h2>
        <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
          Submit your project details below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            {
              label: "Student ID",
              name: "student_id",
              type: "number",
              placeholder: "Your Student ID",
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
                value={formData[field.name]}
                onChange={handleChange}
                placeholder={field.placeholder}
                className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition shadow-sm"
                required={field.name !== "github_pr_link"}
              />
            </div>
          ))}

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

          <div className="flex items-center space-x-3">
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition duration-300 shadow-lg hover:shadow-indigo-400 dark:hover:shadow-indigo-800"
          >
            🚀 Submit Project
          </button>
        </form>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-xl w-full max-w-md transform scale-100 transition-all border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-bold text-center text-green-600 dark:text-green-400 mb-4">
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
  );
}

export default ProjectSubmissionForm;
