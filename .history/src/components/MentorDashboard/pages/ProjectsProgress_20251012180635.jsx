// src/pages/ProjectsProgress.jsx

import React from "react";
import Sidebar from "../components/Sidebar";
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
  return (
    <div className={`mt-14 flex ${isDarkMode ? "bg-gray-900 text-white" : ""}`}>
      <Header />

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col min-h-screen ${
          isDarkMode ? "bg-gray-800" : "bg-gray-50"
        }`}
      >
        {/* Header */}
        <div className="text-center mb-10 p-8">
          <h1
            className={`text-3xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Track Assigned Students and Progress
          </h1>
          <p
            className={`mt-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            View and manage the students assigned to you with detailed profiles
            and progress logs.
          </p>
        </div>

        {/* Card/Table */}
        <div
          className={`rounded-2xl p-6 mx-8 ${
            isDarkMode ? "bg-gray-700 shadow-lg" : "bg-white shadow-lg"
          }`}
        >
          <table className="w-full text-left">
            <thead>
              <tr className={`border-b ${isDarkMode ? "border-gray-600" : ""}`}>
                <th className="py-3 px-4">Student</th>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Progress</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr
                  key={index}
                  className={`border-b last:border-none ${
                    isDarkMode ? "border-gray-600" : ""
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
                      <p
                        className={`text-sm ${
                          isDarkMode ? "text-gray-300" : "text-gray-500"
                        }`}
                      >
                        {student.email}
                      </p>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-4 px-4">{student.project}</td>

                  {/* Progress */}
                  <td className="py-4 px-4">
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div
                        className="bg-blue-500 h-3 rounded-full"
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <p
                      className={`text-sm mt-1 ${
                        isDarkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
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
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ProjectsProgress;
