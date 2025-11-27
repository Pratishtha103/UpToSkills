import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, User, Users, Plus, Trash2, Award } from "lucide-react";

function Project({ isDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");

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
    if (!newProjectTitle || !newProjectMentor || !newProjectStudents) return;

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
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/mentor_projects/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) setProjects((prev) => prev.filter((p) => p.id !== id));
      else alert(data.message || "Failed to delete project");
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

  return (
    <main
      className={`p-4 sm:p-6 flex flex-col gap-6 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Add Project Form */}
      <div
        className={`stat-card p-6 rounded-2xl shadow-md transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Title now inherits color from parent div (text-white/text-gray-900) */}
        <h3 className="text-xl font-bold mb-4 transition-colors duration-300">
          Add New Project
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {[
            {
              value: newProjectTitle,
              onChange: (e) => setNewProjectTitle(e.target.value),
              placeholder: "Project Title",
            },
            {
              value: newProjectMentor,
              onChange: (e) => setNewProjectMentor(e.target.value),
              placeholder: "Mentor Name",
            },
            {
              value: newProjectStudents,
              onChange: (e) => setNewProjectStudents(e.target.value),
              placeholder: "Number of Students",
              type: "number",
            },
          ].map((input, idx) => (
            <input
              key={idx}
              type={input.type || "text"}
              placeholder={input.placeholder}
              value={input.value}
              onChange={input.onChange}
              className={`rounded-md p-2 border w-full transition-colors duration-300 ${
                isDarkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          ))}
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

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => (
              <div // Skeleton loader
                key={idx}
                className={`stat-card p-6 animate-pulse rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              />
            ))
          : projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={`p-6 flex flex-col gap-4 rounded-2xl transition-colors duration-300
      ${isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"}`}
                >
                  {/* Header */}
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-3 rounded-2xl flex-shrink-0 transition-colors duration-300
          ${
            isDarkMode
              ? "bg-gradient-to-r from-gray-700 to-gray-600"
              : "bg-gradient-to-r from-blue-500 to-blue-600"
          }`}
                    >
                      <FolderOpen className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="text-lg font-bold">
                      {project.project_title}
                    </h3>
                  </div>

                  {/* Mentor & Students */}
                  <div className="flex flex-col gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 fill-current" />
                      Mentor: {project.mentor_name}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 fill-current" />
                      {project.total_students}{" "}
                      {project.total_students === 1 ? "Student" : "Students"}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      className={`flex-1 flex items-center justify-center gap-2
          ${
            isDarkMode
              ? "bg-red-600 hover:bg-red-500 text-white"
              : "bg-red-500 hover:bg-red-600 text-white"
          }`}
                    >
                      <Trash2 className="w-4 h-4 fill-current" /> Delete
                    </Button>

                    <Button
                      className={`flex-1 flex items-center justify-center gap-2
          ${
            isDarkMode
              ? "bg-green-600 hover:bg-green-500 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
                    >
                      <Award className="w-4 h-4 fill-current" /> Add Student
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
      </div>
    </main>
  );
}

export default Project;
