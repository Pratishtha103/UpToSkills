// src/pages/ProjectsProgress.jsx

import React from "react";
import Sidebar from "../components/Sidebar"; // adjust path if needed
import Footer from "../components/Footer";
import Header from "../components/Header";

const students = [
  {
    name: "David Kim",
    email: "david.k@example.com",
    project: "New Onboarding System",
    avatar: "https://i.pravatar.cc/150?img=8",
  },
  {
    name: "Elara Vance",
    email: "elara.v@example.com",
    project: "Backend Infrastructure",
    avatar: "https://i.pravatar.cc/150?img=7",
  },
  {
    name: "Son Heung min",
    email: "Son.h@example.com",
    project: "Mobile App Refinement",
    avatar: "https://image.cnbcfm.com/api/v1/image/105763128-1551243737677gettyimages-1127662527.jpeg?v=1551245017",
  },
  {
    name: "Sophia Lee",
    email: "sophia.l@example.com",
    project: "AI Chatbot Integration",
    avatar: "https://i.pravatar.cc/150?img=9",
  },
  {
    name: "Marcus Thuram",
    email: "marcus.t@example.com",
    project: "Database Migration",
    avatar: "https://i.pravatar.cc/150?img=10",
  },
  {
    name: "Nisha Patel",
    email: "nisha.p@example.com",
    project: "Security Audit Tool",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
];

const ProjectsProgress = () => {
  return (
    <div className="mt-14 flex">

      <Header/>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        {/* Header */}
        <div className="text-center mb-10 p-8">
          <h1 className="text-3xl font-bold">Track Assigned Mentors</h1>
          <p className="text-gray-600 mt-2">
            View and manage the mentors assigned to you and the projects they oversee.
          </p>
        </div>

        {/* Card/Table */}
        <div className="bg-white shadow-lg rounded-2xl p-6 mx-8">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-4">Mentor</th>
                <th className="py-3 px-4">Project</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, index) => (
                <tr key={index} className="border-b last:border-none">
                  {/* Student */}
                  <td className="py-4 px-4 flex items-center">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-10 h-10 rounded-full mr-4"
                    />
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.email}</p>
                    </div>
                  </td>

                  {/* Project */}
                  <td className="py-4 px-4">{student.project}</td>

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