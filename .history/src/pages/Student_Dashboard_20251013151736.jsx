import React, { useState, useEffect } from "react";
import Sidebar from "../components/Student_Dashboard/dashboard/Sidebar";
import Header from "../components/Student_Dashboard/dashboard/Header";
import WelcomeSection from "../components/Student_Dashboard/dashboard/WelcomeSection";
import StatsGrid from "../components/Student_Dashboard/dashboard/StatsGrid";
import NoticeBoard from "../components/Student_Dashboard/dashboard/NoticeBoard";
import ChartSection from "../components/Student_Dashboard/dashboard/ChartSection";
// import AssignmentsSection from "../components/Student_Dashboard/dashboard/AssignmentsSection";
// import BottomProfileMessages from "../components/Student_Dashboard/dashboard/BottomProfileMessages";
import Footer from "../components/Student_Dashboard/dashboard/Footer";

const StudentDashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // load from localStorage initially
    return localStorage.getItem("theme") === "dark";
  });

  // 🔥 Whenever isDarkMode changes, update <html> class instantly
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 dark:bg-gray-800  ${
        isDarkMode ? "-[#0f172a] text-white" : "-[#f8fafc] text-gray-900"
      }`}
    >
      <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarVisible ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Header
          onMenuClick={() => setSidebarVisible(!isSidebarVisible)}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="pt-24 px-4 sm:px-6 py-6 space-y-6">
          <WelcomeSection />
          <StatsGrid />
          {/* <NoticeBoard />
          <ChartSection />
          <AssignmentsSection />
          <BottomProfileMessages /> */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default StudentDashboard;
