import React from 'react'
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "../../Project_Showcase/Footer";
import ProjectModal from "../../Project_Showcase/ProjectModal";
import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import ProjectCard from '../../Project_Showcase/ProjectCard';
const Dashboard_Project = () => {
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [projects, setProjects] = useState([]);
      const [isSidebarVisible, setSidebarVisible] = useState(true);
      const [isMobile, setIsMobile] = useState(false);
      const [isDarkMode, setIsDarkMode] = useState(() => {
        // load from localStorage initially
        return localStorage.getItem("theme") === "dark";
      });
    
      // 🔥 Whenever isDarkMode changes, update <html> class instantly
      useEffect(() => {
        if (isDarkMode) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }, [isDarkMode]);
    
      const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
    
      useEffect(() => {
        const checkScreenSize = () => {
          const mobile = window.innerWidth <= 1024;
          setIsMobile(mobile);
          setSidebarVisible(!mobile);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
      }, []);
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const projects = await fetch("http://localhost:5000/api/projects")
                    .then((res) => {
                        setLoading(false);
                        return res.json().then((data) => {
                            if (data.success) {
                                setProjects(data.data);
                            } else {
                                setProjects([]);
                            }
                        })
                    })
                const data = await projects.json();
                console.log(data);
            } catch (err) {
                console.error("Failed to fetch projects:", err);
            }
        };
        fetchProjects();
    }, [])
    return (
        <div
            className={`min-h-screen transition-all duration-300 dark:bg-gray-800  ${isDarkMode ? "-[#0f172a] text-white" : "-[#f8fafc] text-gray-900"
                }`}
        >
            <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarVisible ? "lg:ml-64" : "ml-0"
                    }`}
            >
                <Header
                    onMenuClick={() => setSidebarVisible(!isSidebarVisible)}
                    toggleDarkMode={toggleDarkMode}
                />
                <div className='flex flex-col justify-center pt-24 px-4 sm:px-6 py-2 space-y-6 flex-grow'>
                    <header className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center py-6 sm:py-8 tracking-wide border-b-4 border-[#00b2a9] flex items-center justify-center">
                        <span className="text-[#f26c3d]">All</span>
                            &nbsp;
                        <span className="text-[#00b2a9]">Projects</span>
                    </header>
                    
                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10'>
                        {loading
                            ?
                            Array.from({ length: 6 }).map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className="stat-card p-6 animate-pulse bg-gray-200 rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <div className="h-6 w-3/4 bg-gray-300 mb-4 rounded"></div>
                                    <div className="h-4 w-1/2 bg-gray-300 mb-2 rounded"></div>
                                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                                </motion.div>
                            ))
                            : projects.length === 0
                                ?
                                <div className="col-span-full flex items-center justify-center min-h-[300px]">
                                    <div className="text-center">
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects</h3>
                                    </div>
                                </div>
                                : projects.map((proj, idx) => (
                                    <ProjectCard
                                        key={idx}
                                        project={proj}
                                        onClick={() => setSelectedProject(proj)}
                                    />
                                ))}
                    </div>
                    {selectedProject && (
                        <ProjectModal
                            project={selectedProject}
                            onClose={() => setSelectedProject(null)}
                        />
                    )}
                </div>
                <Footer />
            </div>
        </div>
    )
}

export default Dashboard_Project