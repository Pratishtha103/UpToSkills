import React from 'react';
import ProgramsSection from '../components/AboutPage/ProgramsSection';
import Header from '../components/AboutPage/Header';
import Footer from '../components/AboutPage/Footer';
import Chatbot from "../components/Contact_Page/Chatbot";

const ProgramsPage = () => {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-grow'>
        <ProgramsSection />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
};

export default ProgramsPage;
