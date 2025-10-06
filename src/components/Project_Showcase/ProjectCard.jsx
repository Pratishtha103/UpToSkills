import React from "react";
import { FaCode, FaGithub } from "react-icons/fa";
import { FiEye } from "react-icons/fi";

const ProjectCard = ({ project, onClick }) => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 border border-gray-200 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 p-6 flex flex-col">
      {/* Title */}
      <h2 className="text-xl font-bold text-gray-800 mb-1">
        {project.title}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        {project.description || "No description provided."}
      </p>

      {/* Tech tags */}
      {project.tech_stack && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.tech_stack.split(",").map((tech, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-cyan-50 text-cyan-700"
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
          className="flex items-center gap-2 text-sm text-blue-600 hover:underline mb-4"
        >
          <FaGithub /> GitHub Repository
        </a>
      )}

      {/* View Details */}
      <button
        onClick={onClick}
        className="mt-auto inline-flex items-center justify-center gap-2 px-5 py-2 rounded-md bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-orange-500 hover:to-red-400 text-white text-sm font-medium"
      >
        <FiEye />
        View Details
      </button>
    </div>
  );
};

export default ProjectCard;
