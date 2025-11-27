import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark' || localStorage.getItem('isDarkMode') === 'true';
    } catch (e) { return false; }
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch projects from backend
  useEffect(() => {
    // 🌟 FIX 1: Use the correct and consistent key "id" 
    const studentId = localStorage.getItem("id"); 
    const token = localStorage.getItem('token'); 

    console.log("ProjectShowcase useEffect - Student ID:", studentId);
    
    // CRITICAL CHECK: Stop the fetch if the student ID or token is missing
    if (!studentId || !token) {
      console.log("ProjectShowcase: Student ID or Token is missing. Aborting fetch.");
      setLoading(false);
      return; 
    }

    setLoading(true);

    // 🌟 FIX 2: Correct the API URL and Authorization Header
    fetch(`http://localhost:5000/api/projects/assigned/${studentId}`, {
      headers: {
        'Content-Type': 'application/json',
        // ✅ FIX 2: Use the standard 'Authorization' header with 'Bearer'
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then((res) => {
        if (!res.ok) {
          // If the status is NOT okay, log the error and throw
          console.error(`Fetch failed with status: ${res.status}`);
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched projects:", data);
        if (data.success) {
          // data.data is the correct payload
          setProjects(data.data);
        } else {
          setProjects([]);
        }
        // ✅ FIX 3: setLoading(false) in success block is correct
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setProjects([]);
      })
      .finally(() => {
         // ✅ BEST PRACTICE: Ensure loading state is turned off regardless of outcome
         setLoading(false); 
      });

  }, []); // Reruns when component mounts (after login refresh)

  // ... (useEffect for dark mode remains the same)

  // ----------------------------------------------------
  // 3. Removed the redundant initial render check since the check is in useEffect now.
  // We can let the component load and show a 'Please Wait' or skeleton until the fetch resolves.
  // ----------------------------------------------------
  
  return (
    <>
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
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Projects Found</h3>
                <p className="text-gray-500 dark:text-gray-400">You don't have any projects yet. Try adding one!</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Check console for fetch errors if this should not be empty.</p>
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