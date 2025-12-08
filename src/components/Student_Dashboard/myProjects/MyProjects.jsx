// src/components/Student_Dashboard/myProjects/MyProjects.jsx

import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import ProjectSubmissionForm from './ProjectSubmissionForm';
import { useTheme } from '../../../context/ThemeContext';

function MyProjects() {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
    }`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isOpen ? "lg:ml-64" : "ml-0"
      }`}>
        <Header onMenuClick={toggleSidebar} />

        <div className="flex justify-center items-start px-4 py-4 w-full pt-20">
          <ProjectSubmissionForm isDarkMode={darkMode} />
        </div>
      </div>
    </div>
  );
}

export default MyProjects;