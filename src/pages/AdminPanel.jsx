import { useState } from "react";
import { motion } from "framer-motion";

import AdminNavbar from "../components/AdminPanelDashboard/AdminNavbar";
import AdminSidebar from "../components/AdminPanelDashboard/AdminSidebar";
import DashboardMain from "../components/AdminPanelDashboard/DashboardMain";
import Students from "../components/AdminPanelDashboard/Students";
import Company from "../components/AdminPanelDashboard/Company";
import StudentsTable from "../components/AdminPanelDashboard/StudentsTable";
import CompaniesTable from "../components/AdminPanelDashboard/CompaniesTable";
import MentorsTable from "../components/AdminPanelDashboard/MentorsTable";
import Mentors from "../components/AdminPanelDashboard/Mentors";
import Project from "../components/AdminPanelDashboard/Project";
import Analytics from "../components/AdminPanelDashboard/Analytics";
import MentorReview from "../components/AdminPanelDashboard/MentorReview";
import AdminNotifications from "../components/AdminPanelDashboard/AdminNotifications";
import ProgramsAdmin from "../components/AdminPanelDashboard/ProgramsAdmin";
import Programs from "../components/AdminPanelDashboard/Programs";
import CoursesTable from "../components/AdminPanelDashboard/CoursesTable";
function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Dark/Light mode state
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const renderActiveModule = () => {
    switch (activeSection) {
      case "dashboard":
        return (
          <DashboardMain
            isDarkMode={isDarkMode}
            onNavigateSection={(section) => setActiveSection(section)}
          />
        );
      case "students":
        return <Students isDarkMode={isDarkMode} />;
      case "students_table":
        return <StudentsTable isDarkMode={isDarkMode} onNavigateSection={(s) => setActiveSection(s)} />;
      case "mentors":
        return <Mentors isDarkMode={isDarkMode} />;
      case "companies":
        return <Company isDarkMode={isDarkMode} />;
      case "companies_table":
        return <CompaniesTable isDarkMode={isDarkMode} onNavigateSection={(s) => setActiveSection(s)} />;
      case "projects":
        return <Project isDarkMode={isDarkMode} />;
      case "analytics":
        return <Analytics isDarkMode={isDarkMode} />;
      case "mentor":
        return <MentorReview isDarkMode={isDarkMode} />;
      case "programs":
        return <ProgramsAdmin isDarkMode={isDarkMode} onNavigateSection={(s) => setActiveSection(s)} />;
      case "mentors_table":
        return <MentorsTable isDarkMode={isDarkMode} onNavigateSection={(s) => setActiveSection(s)} />;
      case "notifications":
        return <AdminNotifications isDarkMode={isDarkMode} />;
      case "courses":
        return <Programs isDarkMode={isDarkMode} />
      case "courses_table":
        return <CoursesTable isDarkMode={isDarkMode} onNavigateSection={(s) => setActiveSection(s)} />;
      default:
        return <DashboardMain isDarkMode={isDarkMode} />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
      />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
      >
        {/* Navbar */}
        <AdminNavbar
          onMenuClick={toggleSidebar}
          onNotificationsClick={() => setActiveSection("notifications")}
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
        />

        {/* Content */}
        <main className="pt-20 px-4 sm:px-6 py-6">
          <motion.section
            className={`rounded-2xl p-8 mb-8 transition-all duration-500 ${isDarkMode
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
              className={`text-xl ${isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage students, companies, projects, and analytics from one
              place.
            </motion.p>
          </motion.section>

          {/* Active Module */}
          {renderActiveModule()}
        </main>

        {/* Footer */}
        <footer
          className="w-full bg-gray-100 text-gray-700 border-t border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300 "
        >
          <p>© 2025 Uptoskills. Built by learners.</p>
        </footer>
      </div>
    </div>
  );
}

export default AdminPanel;
