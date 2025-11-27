// src/pages/ProjectsProgress.jsx

import React from "react";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import Footer from "../components/Footer";
import Header from "../components/Header";

const students = [
  {
    name: "Angat Mali",
    email: "angat.mali@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=1",
    progress: 80,
  },
  {
    name: "Pragya Jha",
    email: "pragya.jha@example.com",
    project: "Portfolio Website",
    avatar: "https://i.pravatar.cc/150?img=2",
    progress: 60,
  },
  {
    name: "Freddy Fernandes",
    email: "freddy.fernandes@example.com",
    project: "Mobile App",
    avatar: "https://i.pravatar.cc/150?img=3",
    progress: 75,
  },
  {
    name: "Pravin Goswami",
    email: "pravin.goswami@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=4",
    progress: 20,
  },
  {
    name: "Shruti Biradar",
    email: "shruti.biradar@example.com",
    project: "Learning Platform",
    avatar: "https://i.pravatar.cc/150?img=5",
    progress: 50,
  },
];

const ProjectsProgress = ({ isDarkMode, setIsDarkMode }) => {
  // Utility function to conditionally apply dark mode classes
  const getDarkModeClass = (lightClass, darkClass) => {
    return isDarkMode ? darkClass : lightClass;
  };

  // Main container and background
  const mainContentClasses = getDarkModeClass(
    "bg-gray-50",
    "bg-gray-900 text-white"
  );

  // Card/Table container
  const cardClasses = getDarkModeClass(
    "bg-white shadow-lg",
    "bg-gray-800 shadow-2xl shadow-gray-700/50"
  );

  // Table header/row border
  const borderClass = getDarkModeClass("border-b", "border-b border-gray-700");

  // Secondary text (email, progress percentage, description paragraph)
  const secondaryTextClasses = getDarkModeClass(
    "text-gray-500",
    "text-gray-400"
  );
  const descriptionTextClasses = getDarkModeClass(
    "text-gray-600",
    "text-gray-400"
  );

  // Progress bar background
  const progressBarBgClass = getDarkModeClass("bg-gray-200", "bg-gray-700");

  return (
    <div className={`mt-14 flex ${isDarkMode ? "dark" : ""}`}>
      {/* Pass down isDarkMode to child components */}
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Sidebar isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${mainContentClasses}`}
      >
        {/* Header Section */}
        <div className="text-center mb-10 p-8">
          <h1 className="text-3xl font-bold">
            Track Assigned Students and Progress
          </h1>
          <p className={`mt-2 ${descriptionTextClasses}`}>
            View and manage the students assigned to you with detailed profiles
            and progress logs.
          </p>
        </div>

        {/* Card/Table */}
        <div className={`rounded-2xl p-6 mx-8 ${cardClasses}`}>
          <table className="w-full text-left">
            <thead>
              <tr className={borderClass}>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className={`last:border-none ${borderClass} hover:bg-opacity-50 ${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}
                >
                  {/* Student */}
                  <td className="py-4 px-4 flex items-center">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className={`text-sm ${secondaryTextClasses}`}>
                        {student.email}
                      </p>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-4 px-4">{student.project}</td>

                  {/* Progress */}
                  <td className="py-4 px-4">
                    <div
                      className={`w-full rounded-full h-3 ${progressBarBgClass}`}
                    >
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <p className={`text-sm mt-1 ${secondaryTextClasses}`}>
                      {student.progress}%
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-auto">
          <Footer isDarkMode={isDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default ProjectsProgress;
