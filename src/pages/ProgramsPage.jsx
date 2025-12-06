import React from 'react';
import ProgramsSection from '../components/AboutPage/ProgramsSection';
import Header from '../components/AboutPage/Header';
import Chatbot from '../components/Contact_Page/Chatbot'
import { useTheme } from '../context/ThemeContext';

const ProgramsPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <Header />
      <main className='flex-grow'>
        <ProgramsSection />
      </main>
      <footer
        className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-950 text-gray-300 border-gray-700" : "bg-gray-700 text-gray-100 border-gray-300"}`}
      >
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>
       {/* Chatbot */}
      <Chatbot />
    </div>
  );
};

export default ProgramsPage;
