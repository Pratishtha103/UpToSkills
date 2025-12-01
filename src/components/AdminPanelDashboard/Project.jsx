import React, { useState, useEffect } from "react";
import { FolderOpen, User, Users, Plus, Trash2, Award, Search, Loader2 } from "lucide-react";

export default function Project({ isDarkMode }) {
<<<<<<< HEAD
  const [projects, setProjects] = useState([]);          
  const [newProjects, setNewProjects] = useState([]);     
=======
  const [projects, setProjects] = useState([]);
  const [newProjects, setNewProjects] = useState([]);
>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)
  const [loading, setLoading] = useState(true);
  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectMentor, setNewProjectMentor] = useState("");
  const [newProjectStudents, setNewProjectStudents] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const root = document.documentElement;
    isDarkMode ? root.classList.add("dark") : root.classList.remove("dark");
  }, [isDarkMode]);

  // Load projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
<<<<<<< HEAD
        const res = await fetch("http://localhost:5000/api/mentor_projects");
=======
        let url = "http://localhost:5000/api/student-projects";
        if (searchTerm.trim()) {
          url = `http://localhost:5000/api/student-projects?search=${encodeURIComponent(searchTerm.trim())}`;
          setSearching(true);
        }
        const res = await fetch(url);
>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)
        const data = await res.json();

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
      }
    };

    fetchProjects();
  }, []);

  // ⭐ LOCAL SEARCH FILTER
  const filteredProjects = projects.filter((proj) =>
    proj.project_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        const newProj = data.project;
        setProjects((prev) => [...prev, newProj]);
        setNewProjects((prev) => [...prev, newProj]);

        setNewProjectTitle("");
        setNewProjectMentor("");
        setNewProjectStudents("");
        // Notify admins and the mentor about the new project (best-effort)
        try {
          // Admin notification
          await fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "admin",
              type: "creation",
              title: "Project added",
              message: `${newProj.project_title} was added by admin (mentor: ${newProj.mentor_name}).`,
              metadata: { entity: "project", id: newProj.id },
            }),
          });

          // Mentor notification (if mentor_id available)
          if (newProj.mentor_id) {
            await fetch("http://localhost:5000/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                role: "mentor",
                recipientId: newProj.mentor_id,
                type: "creation",
                title: "New project assigned",
                message: `A new project \"${newProj.project_title}\" was assigned to you.`,
                metadata: { entity: "project", id: newProj.id },
              }),
            });
          }
        } catch (notifErr) {
          console.error("Failed to create project notifications:", notifErr);
        }
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
<<<<<<< HEAD
      const res = await fetch(`http://localhost:5000/api/mentor_projects/${id}`, {
        method: "DELETE",
      });

=======
      const res = await fetch(`http://localhost:5000/api/student-projects/${id}`, { method: "DELETE" });
>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)
      const data = await res.json();

      if (data.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        setNewProjects((prev) => prev.filter((p) => p.id !== id));
        // Notify admins (and mentor) about deletion
        try {
          // Admin notification
          await fetch("http://localhost:5000/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              role: "admin",
              type: "deletion",
              title: "Project deleted",
              message: `Project with id ${id} was deleted.`,
              metadata: { entity: "project", id },
            }),
          });

          // If API returned deleted project with mentor_id, notify mentor
          const deleted = data.deleted || data.deleted_project || null;
          const mentorId = deleted?.mentor_id || deleted?.mentorId || null;
          if (mentorId) {
            await fetch("http://localhost:5000/api/notifications", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                role: "mentor",
                recipientId: mentorId,
                type: "deletion",
                title: "Project removed",
                message: `A project assigned to you was removed (id: ${id}).`,
                metadata: { entity: "project", id },
              }),
            });
          }
        } catch (notifErr) {
          console.error("Failed to create project deletion notifications:", notifErr);
        }
      } else {
        alert(data.message || "Failed to delete project");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting project");
    }
  };

<<<<<<< HEAD
=======
  const handleAddStudent = (id) => {
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, total_students: (project.total_students || 0) + 1 } : project
      )
    );
    setNewProjects((prev) =>
      prev.map((project) =>
        project.id === id ? { ...project, total_students: (project.total_students || 0) + 1 } : project
      )
    );
  };

>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)
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
            placeholder="Search projects or students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none ${
              isDarkMode ? "bg-gray-700 text-gray-100 border-gray-600" : "bg-white text-gray-900 border-gray-300"
            }`}
            autoFocus
          />
        </div>
      </div>

      {/* ALL PROJECTS SECTION */}
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-2">
        <FolderOpen className="w-6 h-6 text-indigo-500" /> All Projects
      </h2>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className={`p-6 rounded-lg animate-pulse ${isDarkMode ? "bg-gray-800" : "bg-white"}`} />
          ))
        ) : filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isDarkMode={isDarkMode}
              removeProject={removeProject}
            />
          ))
        ) : (
          <p>No projects found.</p>
        )}
      </div>

<<<<<<< HEAD
      {/* ADD NEW PROJECT
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
            className={`rounded-md p-2 border w-full ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="text"
            placeholder="Mentor Name"
            value={newProjectMentor}
            onChange={(e) => setNewProjectMentor(e.target.value)}
            className={`rounded-md p-2 border w-full ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          />
          <input
            type="number"
            placeholder="Students"
            value={newProjectStudents}
            min="1"
            max="20"
            onChange={(e) => setNewProjectStudents(e.target.value)}
            className={`rounded-md p-2 border w-full ${
              isDarkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-gray-900"
            }`}
          />
        </div>

        <button
          onClick={addProject}
          className="flex items-center gap-2 rounded-md px-4 py-2 font-medium bg-indigo-600 hover:bg-indigo-500 text-white"
        >
          <Plus className="w-4 h-4" /> Add Project
        </button>
      </div> */}

      {/* NEW PROJECTS SECTION */}
      {newProjects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-3">New Projects</h2>
=======
      {/* NEWLY ADDED PROJECTS SECTION */}
      {newProjects.length > 0 && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold flex items-center gap-2 mb-3">
            New Projects
          </h2>
>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {newProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isDarkMode={isDarkMode}
                removeProject={removeProject}
              />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}

function ProjectCard({ project, removeProject, isDarkMode }) {
  return (
    <div
      className={`p-6 rounded-lg shadow-md transition-colors duration-300 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-600">
          <FolderOpen className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-bold break-words">{project.project_title || project.title}</h3>
      </div>

      <div className="text-sm mb-4 space-y-1">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" /> 
          Student: {project.student_name}
        </div>
        {project.total_students && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" /> {project.total_students} Students
          </div>
        )}
      </div>

<<<<<<< HEAD
      <button
        onClick={() => removeProject(project.id)}
        className="w-full flex items-center gap-2 justify-center rounded-md px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </button>
=======
      <div className="flex gap-2">
        <button
          onClick={() => removeProject(project.id)}
          className="flex-1 flex items-center gap-2 justify-center rounded-md px-4 py-2 bg-red-500 hover:bg-red-600 text-white"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </div>
>>>>>>> 5444f89 (feat: student projects + mentor/webdev/login updates)
    </div>
  );
}
