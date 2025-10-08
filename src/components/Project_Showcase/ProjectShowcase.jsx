import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";

// ... (other imports remain the same)

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark' || localStorage.getItem('isDarkMode') === 'true';
    } catch (e) { return false; }
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // ----------------------------------------------------
  // 1. REMOVED: Initial ID check that was causing premature errors.
  // The check is now inside the useEffect for safer execution.
  // ----------------------------------------------------

  // Fetch projects from backend
  useEffect(() => {
    // Get necessary data inside useEffect for controlled execution
    const studentId = localStorage.getItem("studentId");
    const token = localStorage.getItem('token'); // Get the authentication token

    console.log("ProjectShowcase useEffect - Student ID:", studentId);
    
    // CRITICAL CHECK: Stop the fetch if the student ID or token is missing
    if (!studentId || !token) {
      console.log("ProjectShowcase: Student ID or Token is missing. Aborting fetch.");
      setLoading(false);
      return; // Prevents the fetch from running before successful login
    }

    setLoading(true);

    // 2. MODIFIED: Added Authorization Header
    fetch(`http://localhost:5000/api/projects/assigned/${studentId}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // <--- CRITICAL: Sending the JWT
      },
    })
      .then((res) => {
        if (!res.ok) {
          // Handle non-200 responses (like 401 Unauthorized) gracefully
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched projects:", data);
        if (data.success) {
          setProjects(data.data);
        } else {
          setProjects([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        // If fetch fails due to auth error, show no projects but stop loading
        setProjects([]);
        setLoading(false);
      });
  }, []); // Reruns when component mounts (after login refresh)

  // ... (useEffect for dark mode remains the same)

  // ----------------------------------------------------
  // 3. MODIFIED: Added a graceful loading/error state if authentication data is missing
  // ----------------------------------------------------
  if (!localStorage.getItem("id") || !localStorage.getItem("token")) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-xl font-bold text-red-600">Please Wait...</h3>
          <p className="text-gray-600">Authenticating session. If this persists, please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Filter Bar (commented out) */}
      
      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {loading
          ? // Skeleton loaders
            Array.from({ length: 6 }).map((_, idx) => (
              <motion.div
                key={idx}
                className="stat-card p-6 animate-pulse bg-gray-200 rounded-lg dark:bg-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="h-6 w-3/4 bg-gray-300 mb-4 rounded dark:bg-gray-600"></div>
                <div className="h-4 w-1/2 bg-gray-300 mb-2 rounded dark:bg-gray-600"></div>
                <div className="h-4 w-1/3 bg-gray-300 rounded dark:bg-gray-600"></div>
              </motion.div>
            ))
          : projects.length === 0
          ? // Empty state
            <div className="col-span-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Assigned Projects</h3>
                <p className="text-gray-500 dark:text-gray-400">You don't have any projects assigned to you yet.</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check back later or contact your instructor.</p>
              </div>
            </div>
          : projects.map((proj, idx) => (
              <ProjectCard
                  key={idx}
                  project={proj}
                  onClick={() => setSelectedProject(proj)}
                  isDarkMode={isDarkMode}
                />
            ))}
      </div>

      {/* Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
          isDarkMode={isDarkMode}
        />
      )}
    </>
  );
};

export default ProjectShowcase;