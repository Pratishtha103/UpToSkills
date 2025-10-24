import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";

const SkillBadgeForm = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    student_name: "",
    badge_name: "",
    badge_description: "",
    verified: false,
  });

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/skill-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Badge added successfully!");
        setFormData({
          student_name: "",
          badge_name: "",
          badge_description: "",
          verified: false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      {isOpen && (
        <div className="w-64">
          <Sidebar
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            isDarkMode={isDarkMode}
          />
        </div>
      )}

      {/* Main content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isOpen ? "ml-0 md:ml-0" : "ml-0"
        }`}
      >
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <main className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="pt-20 p-6 bg-white dark:bg-gray-800 rounded-lg w-full max-w-xl shadow-md transition-colors duration-300">
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">
              Add New Skill Badge
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block dark:text-white">
                Student Name:
                <input
                  type="text"
                  name="student_name"
                  placeholder="Student Name"
                  value={formData.student_name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md 
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </label>

              <label className="block dark:text-white">
                Badge Name:
                <input
                  type="text"
                  name="badge_name"
                  placeholder="Badge Name"
                  value={formData.badge_name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md 
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </label>

              <label className="block dark:text-white">
                Badge Description:
                <textarea
                  name="badge_description"
                  placeholder="Badge Description"
                  value={formData.badge_description}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md 
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </label>

              <label className="inline-flex items-center space-x-2 dark:text-white">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Verified</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default SkillBadgeForm;
