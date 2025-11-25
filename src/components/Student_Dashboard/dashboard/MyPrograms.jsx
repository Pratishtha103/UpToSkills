import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header"; 

const MyPrograms = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      
      <div className="flex flex-col flex-1 lg:ml-64 transition-all duration-300">

        <Header />
        <main className="flex-1 p-8 mt-24"> 
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Programs</h1>
            <div className="flex gap-4">
             
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Filter
              </button>
            </div>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Web Development</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn HTML, CSS, JavaScript, and React to build responsive and modern web applications.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Program
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Python for Beginners</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A beginner-friendly course to learn Python programming fundamentals.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Program
              </button>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition">
              <h2 className="text-xl font-semibold mb-2">Cyber Security Basics</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn the essentials of protecting systems, networks, and data from cyber threats.
              </p>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                View Program
              </button>
            </div>
          </div>
        </main>
        <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 py-4 text-center">
          <p className="text-sm">© 2025 UpToSkills. Built by learners.</p>
        </footer>
      </div>
    </div>
  );
};

export default MyPrograms;
