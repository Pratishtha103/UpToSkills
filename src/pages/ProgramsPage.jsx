import React from 'react';
import ProgramsSection from '../components/AboutPage/ProgramsSection';
import Header from '../components/AboutPage/Header';
import Footer from '../components/AboutPage/Footer';

const ProgramsPage = () => {
  return (
    <div>
      <Header />
      <main>
        <ProgramsSection />
      </main>
      <Footer />
    </div>
  );
};

export default ProgramsPage;
