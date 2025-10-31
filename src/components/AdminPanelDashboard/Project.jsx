import React, { useState, useEffect } from "react";
import { FolderOpen, User, Users, Plus, Trash2, Award } from "lucide-react";

export default function Project({ isDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(() => {
    fetch("http://localhost:5000/api/mentor_projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const addProject = async () => {
    if (!newProjectTitle || !newProjectMentor || !newProjectStudents) {
      alert("Please fill out all fields before adding a project.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/mentor_projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          project_title: newProjectTitle,
          mentor_name: newProjectMentor,
          total_students: parseInt(newProjectStudents, 10),
        }),
      });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => [...prev, data.project]);
        setNewProjectTitle("");
        setNewProjectMentor("");
        setNewProjectStudents("");
      } else alert(data.message || "Failed to add project");
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  };

  const removeProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/mentor_projects/${id}`,
        { method: "DELETE" }
      );
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else alert(data.message || "Failed to delete project");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  // 🟢 Add Student (Frontend Only)
  const handleAddStudent = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { ...project, total_students: project.total_students + 1 }
          : project
      )
    );
  };

  return (
    <main
      className={`p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Add New Project Form */}
      <div
        className={`p-6 rounded-2xl shadow-md transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        <h3 className="text-xl font-bold mb-4">Add New Project</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Project Title"
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            className={`rounded-md p-2 border w-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <input
            type="text"
            placeholder="Mentor Name"
            value={newProjectMentor}
            onChange={(e) => setNewProjectMentor(e.target.value)}
            className={`rounded-md p-2 border w-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
          <input
            type="number"
            placeholder="Number of Students"
            value={newProjectStudents}
            min="1"
            max="20"
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value >= 1 && value <= 20) {
                setNewProjectStudents(value);
              } else if (e.target.value === "") {
                setNewProjectStudents("");
              }
            }}
            className={`rounded-md p-2 border w-full transition-colors duration-300 ${
              isDarkMode
                ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
            }`}
          />
        </div>

        <button
          onClick={addProject}
          className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors duration-300 w-fit ${
            isDarkMode
              ? "bg-indigo-600 hover:bg-indigo-500 text-white"
              : "bg-indigo-500 hover:bg-indigo-600 text-white"
          }`}
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-lg animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              />
            ))
          : projects.map((project) => (
              <div
                key={project.id}
                className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
                  isDarkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`p-3 rounded-2xl flex-shrink-0 ${
                      isDarkMode
                        ? "bg-gradient-to-r from-gray-700 to-gray-600"
                        : "bg-gradient-to-r from-blue-500 to-blue-600"
                    }`}
                  >
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">
                    {project.project_title}
                  </h3>
                </div>

                <div
                  className={`flex flex-col gap-2 mb-4 text-sm ${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Mentor: {project.mentor_name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {project.total_students}{" "}
                    {project.total_students === 1 ? "Student" : "Students"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => removeProject(project.id)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-red-600 hover:bg-red-500 text-white"
                        : "bg-red-500 hover:bg-red-600 text-white"
                    }`}
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>

                  {/* 🟢 Add Student Button */}
                  <button
                    onClick={() => handleAddStudent(project.id)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors duration-300 ${
                      isDarkMode
                        ? "bg-green-600 hover:bg-green-500 text-white"
                        : "bg-green-500 hover:bg-green-600 text-white"
                    }`}
                  >
                    <Award className="w-4 h-4" /> Add Student
                  </button>
                </div>
              </div>
            ))}
      </div>
    </main>
  );
}
