import React, { useState, useEffect } from "react";
import ProjectCard from "./ProjectCard";
import ProjectModal from "./ProjectModal";
import { motion } from "framer-motion";

import { ChevronDown } from "lucide-react";
import {
  Globe,
  Bot,
  Wifi,
  ShieldCheck,
  User,
  Users,
  Circle,
  CircleDot,
  CircleSlash,
  SlidersHorizontal,
} from "lucide-react";

const ProjectShowcase = () => {
  const [projects, setProjects] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark' || localStorage.getItem('isDarkMode') === 'true';
    } catch (e) { return false; }
  });
  // const [filters, setFilters] = useState({
  //   domain: "All",
  //   type: "All",
  //   difficulty: "All",
  // });
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");
  const id = localStorage.getItem("id");

  console.log("ProjectShowcase - id:", id, "studentId:", studentId);

  if (!id || !studentId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900">Authentication Required</h3>
          <p className="text-gray-500">Please log in to view your assigned projects.</p>
        </div>
      </div>
    );
  }
  // Fetch projects from backend
useEffect(() => {
  console.log("Student ID from localStorage:", localStorage.getItem("studentId"));
  const studentId = localStorage.getItem("studentId");

  if (!studentId) return;

  setLoading(true);

  fetch(`http://localhost:5000/api/projects/assigned/${studentId}`)
    .then((res) => res.json())
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
      setLoading(false);
    });
}, []);



  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'theme') setIsDarkMode(e.newValue === 'dark');
      if (e.key === 'isDarkMode') setIsDarkMode(e.newValue === 'true');
    };
    window.addEventListener('storage', onStorage);
    const mo = new MutationObserver(() => setIsDarkMode(document.documentElement.classList.contains('dark')));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { window.removeEventListener('storage', onStorage); mo.disconnect(); };
  }, []);

  // Filtering logic
  // const filtered = projects.filter((p) => {
  //   const domainMatch = filters.domain === "All" || p.domain === filters.domain;
  //   const typeMatch = filters.type === "All" || p.type === filters.type;
  //   const diffMatch =
  //     filters.difficulty === "All" || p.difficulty === filters.difficulty;
  //   return domainMatch && typeMatch && diffMatch;
  // });

  // const handleFilter = (key, value) => {
  //   setFilters((prev) => ({ ...prev, [key]: value }));
  // };

  return (
    <>
      {/* Filter Bar */}
      {/* <div className="flex flex-wrap justify-center gap-6 mb-6 px-4 py-6">
        {[
          {
            label: "All Domains",
            value: "domain",
            options: ["All", "Web", "Ai/ML", "IoT", "Cyber"],
            icons: {
              Web: <Globe className="inline-block w-4 h-4 mr-1" />,
              "Ai/ML": <Bot className="inline-block w-4 h-4 mr-1" />,
              IoT: <Wifi className="inline-block w-4 h-4 mr-1" />,
              Cyber: <ShieldCheck className="inline-block w-4 h-4 mr-1" />,
            },
            icon: <Globe className="w-4 h-4" />,
          },
          {
            label: "All Types",
            value: "type",
            options: ["All", "Individual", "Group"],
            icons: {
              Individual: <User className="inline-block w-4 h-4 mr-1" />,
              Group: <Users className="inline-block w-4 h-4 mr-1" />,
            },
            icon: <Users className="w-4 h-4" />,
          },
          {
            label: "All Difficulties",
            value: "difficulty",
            options: ["All", "Easy", "Medium", "Hard"],
            icons: {
              Easy: (
                <Circle className="inline-block w-4 h-4 text-green-500 mr-1" />
              ),
              Medium: (
                <CircleDot className="inline-block w-4 h-4 text-yellow-500 mr-1" />
              ),
              Hard: (
                <CircleSlash className="inline-block w-4 h-4 text-red-500 mr-1" />
              ),
            },
            icon: <SlidersHorizontal className="w-4 h-4" />,
          },
        ].map((filter, idx) => (
          <div key={idx} className="relative w-44">
            <select
              onChange={(e) => handleFilter(filter.value, e.target.value)}
              className="appearance-none w-full px-4 py-2 pl-10 pr-10 bg-orange-100 text-gray-800 font-semibold text-sm rounded-xl border border-orange-300 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all duration-200"
            >
              {filter.options.map((opt, i) => (
                <option key={i} value={opt}>
                  {opt === "All" ? filter.label : opt}
                </option>
              ))}
            </select>

            {/* Left icon *
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-600 pointer-events-none">
              {filter.icon}
            </div>

            {/* Dropdown arrow on right *
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-600 pointer-events-none">
              <ChevronDown className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div> */}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6 py-10">
        {loading
          ? // Skeleton loaders
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
          ? // Empty state
            <div className="col-span-full flex items-center justify-center min-h-[300px]">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Assigned Projects</h3>
                <p className="text-gray-500">You don't have any projects assigned to you yet.</p>
                <p className="text-gray-400 text-sm mt-2">Check back later or contact your instructor.</p>
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
