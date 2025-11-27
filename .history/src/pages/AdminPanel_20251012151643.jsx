import { useState } from "react";
import { motion } from "framer-motion";

import AdminNavbar from "../components/AdminPanelDashboard/AdminNavbar";
import AdminSidebar from "../components/AdminPanelDashboard/AdminSidebar";
import DashboardMain from "../components/AdminPanelDashboard/DashboardMain";
import Students from "../components/AdminPanelDashboard/Students";
import Company from "../components/AdminPanelDashboard/Company";
import Project from "../components/AdminPanelDashboard/Project";
import Analytics from "../components/AdminPanelDashboard/Analytics";
import MentorReview from "../components/AdminPanelDashboard/MentorReview";
import AdminNotifications from "../components/AdminPanelDashboard/AdminNotifications";

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // local theme state

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode); // toggle dark/light mode

  const renderActiveModule = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain isDarkMode={isDarkMode} />;
      case "students":
        return <Students isDarkMode={isDarkMode} />;
      case "companies":
        return <Company isDarkMode={isDarkMode} />;
      case "projects":
        return <Project isDarkMode={isDarkMode} />;
      case "analytics":
        return <Analytics isDarkMode={isDarkMode} />;
      case "mentor":
        return <MentorReview isDarkMode={isDarkMode} />;
      case "notifications":
        return <AdminNotifications isDarkMode={isDarkMode} />;
      default:
        return <DashboardMain isDarkMode={isDarkMode} />;
    }
  };

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100"
          : "bg-gradient-to-br from-gray-50 via-gray-100 to-white text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar with theme toggle */}
        <AdminNavbar
          onMenuClick={toggleSidebar}
          onNotificationsClick={() => setActiveSection("notifications")}
          onThemeToggle={toggleTheme} // pass toggle function
          isDarkMode={isDarkMode} // pass current mode
        />

        {/* Page Header */}
        <main className="pt-20 px-4 sm:px-6 py-6">
          <motion.section
            className={`rounded-2xl p-8 mb-8 transition-all duration-500 ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 text-white"
                : "bg-gradient-to-br from-white to-gray-100 text-gray-900"
            }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              UptoSkills Admin Dashboard
            </motion.h1>
            <motion.p
              className={`text-xl ${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage students, companies, projects, and analytics from one
              place.
            </motion.p>
          </motion.section>

          {renderActiveModule()}
        </main>

        <footer
          className={`text-center py-8 border-t mt-12 transition-all duration-500 ${
            isDarkMode
              ? "border-gray-700 text-gray-400"
              : "border-gray-300 text-gray-600"
          }`}
        >
          <p>© 2025 UptoSkills Team. All rights reserved. ✨</p>
        </footer>
      </div>
    </div>
  );
}

export default AdminPanel;
