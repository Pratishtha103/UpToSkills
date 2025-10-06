import React, { useState } from 'react';
import "../student_dashboard.css";
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import ProjectSubmissionForm from './ProjectSubmissionForm';

function MyProjects({ isDarkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`dashboard-container${isDarkMode ? ' dark' : ''}`}>
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
      <div className={`main-content${isOpen ? '' : ' full-width'}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
        <ProjectSubmissionForm />
      </div>
    </div>
  );
}

export default MyProjects;
