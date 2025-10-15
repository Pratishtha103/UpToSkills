import React from "react";
import { FaCode, FaGithub } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const ProjectCard = ({ project, onClick, isDarkMode: propIsDarkMode }) => {
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    try {
      if (typeof propIsDarkMode !== 'undefined') return propIsDarkMode;
      if (typeof document !== 'undefined') return document.documentElement.classList.contains('dark') || localStorage.getItem('theme') === 'dark' || localStorage.getItem('isDarkMode') === 'true';
    } catch (e) {}
    return false;
  });

  React.useEffect(() => {
    if (typeof propIsDarkMode !== 'undefined') { setIsDarkMode(propIsDarkMode); return; }
    const onStorage = (e) => { if (e.key === 'theme') setIsDarkMode(e.newValue === 'dark'); if (e.key === 'isDarkMode') setIsDarkMode(e.newValue === 'true'); };
    window.addEventListener('storage', onStorage);
    const mo = new MutationObserver(() => setIsDarkMode(document.documentElement.classList.contains('dark')));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => { window.removeEventListener('storage', onStorage); mo.disconnect(); };
  }, [propIsDarkMode]);

  return (
    <div className={`border rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gradient-to-b from-white to-gray-50 border-gray-200'}`}>
      {/* Title */}
      <h2 className={`text-xl font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>
        {project.title}
      </h2>
      <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        {project.description || "No description provided."}
      </p>

      {/* Tech tags */}
      {project.tech_stack && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tech_stack.split(",").map((tech, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full ${isDarkMode ? 'bg-cyan-900 text-cyan-200' : 'bg-cyan-50 text-cyan-700'}`}
            >
              <FaCode className="text-cyan-500" />
              {tech.trim()}
            </span>
          ))}
        </div>
      )}


      {/* GitHub */}
      {project.github_pr_link && (
        <a
          href={project.github_pr_link}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 text-sm mb-4 ${isDarkMode ? 'text-cyan-300 hover:underline' : 'text-blue-600 hover:underline'}`}
        >
          <FaGithub /> GitHub Repository
        </a>
      )}

      {/* View Details */}
      <button
        onClick={onClick}
        className={`mt-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md text-white text-sm font-medium ${isDarkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700' : 'bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-orange-500 hover:to-red-400'}`}
      >
        <FiEye />
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
