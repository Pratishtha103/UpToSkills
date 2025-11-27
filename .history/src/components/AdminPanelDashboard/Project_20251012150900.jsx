import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FolderOpen,
  User,
  Users,
  Plus,
  Trash2,
  Award,
  Sun,
  Moon,
} from "lucide-react";

function Project() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 🌓 Load & Apply Theme on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const root = document.documentElement;
    if (savedTheme === "dark") {
      root.classList.add("dark");
      setIsDarkMode(true);
    } else {
      root.classList.remove("dark");
      setIsDarkMode(false);
    }
  }, []);

  // 🌓 Handle Theme Toggle
  const toggleTheme = () => {
    const root = document.documentElement;
    const newTheme = !isDarkMode ? "dark" : "light";
    setIsDarkMode(!isDarkMode);
    if (newTheme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", newTheme);
  };

  // 🧠 Fetch mentor projects
  useEffect(() => {
    fetch("http://localhost:5000/api/mentor_projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setProjects(data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, []);

  // ➕ Add new project
  const addProject = async () => {
    if (
      newProjectTitle.trim() &&
      newProjectMentor.trim() &&
      newProjectStudents.trim()
    ) {
      try {
        const res = await fetch("http://localhost:5000/api/mentor_projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_title: newProjectTitle,
            mentor_name: newProjectMentor,
            total_students: parseInt(newProjectStudents, 10) || 0,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setProjects((prev) => [...prev, data.project]);
          setNewProjectTitle("");
          setNewProjectMentor("");
          setNewProjectStudents("");
        } else {
          alert("Failed to add project: " + (data.error || data.message));
        }
      } catch (err) {
        console.error("Error adding project:", err);
        alert("Error adding project");
      }
    }
  };

  // 🧾 Update project students
  const updateProjectStudents = (id, newStudentCount) => {
    setProjects((projects) =>
      projects.map((p) =>
        p.id === id
          ? { ...p, total_students: parseInt(newStudentCount, 10) || 0 }
          : p
      )
    );
  };

  // ❌ Delete project
  const removeProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/mentor_projects/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete project: " + (data.error || data.message));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6 transition-all duration-300 bg-white dark:bg-gray-900 min-h-screen">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <motion.h2
          className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Manage Projects
        </motion.h2>

        {/* 🌙 Theme Toggle */}
        <motion.button
          onClick={toggleTheme}
          className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-yellow-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-700" />
          )}
        </motion.button>
      </div>

      {/* Add Project Form */}
      <motion.div
        className="p-6 rounded-2xl shadow-md bg-gray-50 dark:bg-gray-800 transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Add New Project
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Enter project title..."
              className="w-full p-2 rounded-md border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Mentor Name
            </label>
            <input
              type="text"
              value={newProjectMentor}
              onChange={(e) => setNewProjectMentor(e.target.value)}
              placeholder="Enter mentor name..."
              className="w-full p-2 rounded-md border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              Number of Students
            </label>
            <input
              type="number"
              value={newProjectStudents}
              onChange={(e) => setNewProjectStudents(e.target.value)}
              placeholder="Enter number..."
              min="0"
              className="w-full p-2 rounded-md border bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </div>
        </div>
        <motion.button
          onClick={addProject}
          className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-4 h-4" />
          Add Project
        </motion.button>
      </motion.div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={index}
                className="p-6 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg"
              >
                <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-600 mb-4 rounded"></div>
                <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 mb-2 rounded"></div>
                <div className="h-4 w-1/3 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </motion.div>
            ))
          : projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="p-6 rounded-2xl shadow-lg bg-gray-100 dark:bg-gray-800 cursor-pointer transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-blue-500">
                    <FolderOpen className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                    {project.project_title}
                  </h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <User className="w-4 h-4" />
                    <span>Mentor: {project.mentor_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Users className="w-4 h-4" />
                    <span>
                      {project.total_students}{" "}
                      {project.total_students === 1 ? "Student" : "Students"}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <motion.button
                    onClick={() => removeProject(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 py-2 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </motion.button>
                  <motion.button
                    onClick={() => updateProjectStudents(project.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Award className="w-4 h-4" />
                    Add Student
                  </motion.button>
                </div>
              </motion.div>
            ))}
      </div>
    </main>
  );
}

export default Project;
