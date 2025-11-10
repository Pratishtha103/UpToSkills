import React, { useState, useEffect } from "react";
import { FolderOpen, User, Users, Plus, Trash2, Award, Search, Loader2 } from "lucide-react";

export default function Project({ isDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDarkMode]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        let url = "http://localhost:5000/api/mentor_projects";
        if (searchTerm.trim()) {
          url = `http://localhost:5000/api/mentor_projects/search/${encodeURIComponent(searchTerm.trim())}`;
          setSearching(true);
        }
        const res = await fetch(url);
        const data = await res.json();

        // Backend returns plain array, so check for array
        if (Array.isArray(data)) {
          setProjects(data);
        } else if (data.success && data.data) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
        setSearching(false);
      }
    };

    const debounceTimeout = setTimeout(fetchProjects, 500);
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

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
      } else {
        alert(data.message || "Failed to add project");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding project");
    }
  };

  const removeProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/mentor_projects/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  const handleAddStudent = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, total_students: project.total_students + 1 } : project
      )
    );
  };

  return (
    <main
      className={`p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="text-4xl font-extrabold flex items-center gap-3">
        <Users className="w-8 h-8 text-indigo-500" />
        Manage Projects
      </div>

      {/* Search Bar */}
      <div
        className={`p-4 shadow-md rounded-lg border transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
        }`}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none ${
              isDarkMode
                ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
            }`}
            autoFocus
          />
          {searching && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
            </div>
          )}
        </div>
      </div>

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
            isDarkMode ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-indigo-500 hover:bg-indigo-600 text-white"
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
                className={`p-6 rounded-lg animate-pulse ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
              />
            ))
          : projects.length > 0 ? (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
                    isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`p-3 rounded-2xl flex-shrink-0 ${
                        isDarkMode ? "bg-gradient-to-r from-gray-700 to-gray-600" : "bg-gradient-to-r from-blue-500 to-blue-600"
                      }`}
                    >
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold">{project.project_title}</h3>
                  </div>

                  <div className={`flex flex-col gap-2 mb-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Mentor: {project.mentor_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {project.total_students} {project.total_students === 1 ? "Student" : "Students"}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => removeProject(project.id)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors duration-300 ${
                        isDarkMode ? "bg-red-600 hover:bg-red-500 text-white" : "bg-red-500 hover:bg-red-600 text-white"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>

                    <button
                      onClick={() => handleAddStudent(project.id)}
                      className={`flex-1 flex items-center justify-center gap-2 rounded-md px-4 py-2 transition-colors duration-300 ${
                        isDarkMode ? "bg-green-600 hover:bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                    >
                      <Award className="w-4 h-4" /> Add Student
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No projects found.</p>
            )}
      </div>
    </main>
  );
}