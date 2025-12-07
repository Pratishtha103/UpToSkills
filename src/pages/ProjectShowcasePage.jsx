import { useState } from 'react';
import Sidebar from '../components/Student_Dashboard/dashboard/Sidebar';
import ProjectShowcase from '../components/Project_Showcase/ProjectShowcase';
import Footer from '../components/Project_Showcase/Footer';
import Header from '../components/Student_Dashboard/dashboard/Header';
import { useTheme } from '../context/ThemeContext';

function ProjectShowcasePage() {
  const [isOpen, setIsOpen] = useState(true);
  const { darkMode } = useTheme();

  return (
    <div className={`flex min-h-screen transition-all duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "lg:ml-64" : "ml-0"}`}>
        {/* Header from student dashboard */}
        <Header onMenuClick={() => setIsOpen(!isOpen)} />

        {/* Project Showcase Heading */}
        <header className={`text-3xl sm:text-4xl md:text-5xl font-extrabold text-center py-6 sm:py-8 tracking-wide border-b-4 flex items-center justify-center mt-16 ${darkMode ? "border-gray-700" : "border-[#00b2a9]"}`}>
          <span className="text-[#f26c3d]">My</span>
          &nbsp;
          <span className="text-[#00b2a9]">Projects</span>
        </header>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto">
          <ProjectShowcase isDarkMode={darkMode} />
        </div>

        <Footer isDarkMode={darkMode} />
      </div>
    </div>
  );
}

export default ProjectShowcasePage;

