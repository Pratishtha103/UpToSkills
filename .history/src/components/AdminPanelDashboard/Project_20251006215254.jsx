import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FolderOpen, User, Users, Plus, Trash2, Award } from "lucide-react";

function Project() {
  // start empty; we'll fetch from DB
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");

  // Fetch mentor projects from backend on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/mentor_projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProjects(data.data);
        }
        setLoading(false); // stop loading after fetch
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false); // stop loading even on error
      });
  }, []);

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
        // Update UI only after DB insert succeeds
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


  const updateProjectStudents = (id, newStudentCount) => {
    setProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, total_students: parseInt(newStudentCount, 10) || 0 }
          : project
      )
    );
  };

  const removeProject = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project? This action cannot be undone."
    );
    if (!confirmDelete) return; // stop if user clicks "Cancel"
    try {
      const res = await fetch(`http://localhost:5000/api/mentor_projects/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success) {
        // update UI only if DB delete successful
        setProjects((prev) => prev.filter((proj) => proj.id !== id));
      } else {
        alert("Failed to delete project: " + (data.error || data.message));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      alert("Error deleting project");
    }
  };


  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage Projects
      </motion.h2>

      {/* Add Project Form */}
      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4">Add New Project</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Project Title
            </label>
            <input
              type="text"
              value={newProjectTitle}
              onChange={(e) => setNewProjectTitle(e.target.value)}
              placeholder="Enter project title..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Mentor Name
            </label>
            <input
              type="text"
              value={newProjectMentor}
              onChange={(e) => setNewProjectMentor(e.target.value)}
              placeholder="Enter mentor name..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">
              Number of Students
            </label>
            <input
              type="number"
              value={newProjectStudents}
              onChange={(e) => setNewProjectStudents(e.target.value)}
              placeholder="Enter number..."
              min="0"
              className="input-field"
            />
          </div>
        </div>
        <motion.button
          onClick={addProject}
          className="btn-primary flex items-center gap-2"
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
              className="stat-card p-6 animate-pulse bg-gray-200 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="h-6 w-3/4 bg-gray-300 mb-4 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-300 mb-2 rounded"></div>
              <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
            </motion.div>
          ))
          : projects.map((project, index) => (
            <motion.div
              key={project.id}
              className="stat-card p-6 cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              {/* your project content stays the same */}
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gradient-accent">
                  <FolderOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {project.project_title}
                  </h3>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>Mentor: {project.mentor_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>
                    {project.total_students} {project.total_students === 1||0 ? "Student" : "Students"}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  onClick={() => removeProject(project.id)}
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </motion.button>
                <motion.button
                  onClick={() => updateProjectStudents(project.id)}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
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
