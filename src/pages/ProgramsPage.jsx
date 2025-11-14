import React from 'react';
import ProgramsSection from '../components/AboutPage/ProgramsSection';
import Header from '../components/AboutPage/Header';
import Chatbot from "../components/Contact_Page/Chatbot";

const ProgramsPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <ProgramsSection />
      </main>
       <footer
      className="w-full text-gray-100 bg-gray-700 border-t border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300 "
    >
      <p>© 2025 Uptoskills. Built by learners.</p>
    </footer>
      <Chatbot />
    </div>
  );
};

export default ProgramsPage;
