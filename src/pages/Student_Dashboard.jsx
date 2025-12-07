import { useState, useEffect } from "react";
import Sidebar from "../components/Student_Dashboard/dashboard/Sidebar";
import Header from "../components/Student_Dashboard/dashboard/Header";
import WelcomeSection from "../components/Student_Dashboard/dashboard/WelcomeSection";
import StatsGrid from "../components/Student_Dashboard/dashboard/StatsGrid";
import Footer from "../components/Student_Dashboard/dashboard/Footer";
import { useTheme } from "../context/ThemeContext";

const StudentDashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const { darkMode, toggleDarkMode } = useTheme();

  const studentId = localStorage.getItem("studentId");

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
      className={`flex min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-[#f8fafc] text-gray-900"
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
        <div className="pt-24 px-4 sm:px-6 py-6 space-y-6 flex-grow">
          <WelcomeSection />
          <StatsGrid studentId={studentId} />
          
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default StudentDashboard;
