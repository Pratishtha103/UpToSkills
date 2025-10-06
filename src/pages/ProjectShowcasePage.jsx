import React, { useState } from 'react';
import Sidebar from '../components/Student_Dashboard/dashboard/Sidebar';
import ProjectShowcase from '../components/Project_Showcase/ProjectShowcase';
import Footer from '../components/Project_Showcase/Footer';
import Header from '../components/Student_Dashboard/dashboard/Header';

function ProjectShowcasePage() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Header from student dashboard */}
      <Header onMenuClick={() => setIsOpen(!isOpen)} />

      {/* Main Content */}
      <div className={`${isOpen ? "ml-[240px]" : "ml-0"} flex flex-col min-h-screen transition-all duration-300 pt-[72px]`}>
        {/* Project Showcase Heading */}
        <header className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center py-6 sm:py-8 tracking-wide border-b-4 border-[#00b2a9] flex items-center justify-center">
          <span className="text-[#f26c3d]">Project</span>
          &nbsp;
          <span className="text-[#00b2a9]">ShowCase</span>
        </header>

        {/* Scrollable Section */}
        <div className="flex-1 overflow-y-auto">
          <ProjectShowcase />
        </div>

        <Footer />
      </div>
    </>
  );
}

export default ProjectShowcasePage;

