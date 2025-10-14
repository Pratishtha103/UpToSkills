import { useState } from "react";
import AdminNavbar from "../components/AdminPanelDashboard/AdminNavbar";
import AdminSidebar from "../components/AdminPanelDashboard/AdminSidebar";
import DashboardMain from "../components/AdminPanelDashboard/DashboardMain";
// ... other imports

function AdminPanel() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // ✅ Add dark mode state here
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const renderActiveModule = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardMain isDarkMode={isDarkMode} />;
      case "students":
        return <Students isDarkMode={isDarkMode} />;
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

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className={`flex min-h-screen transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <AdminSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        isDarkMode={isDarkMode}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <AdminNavbar
          onMenuClick={toggleSidebar}
          onNotificationsClick={() => setActiveSection("notifications")}
          isDarkMode={isDarkMode} // ✅ pass isDarkMode
          toggleTheme={toggleTheme} // ✅ pass toggleTheme
        />

        <main className="pt-20 px-4 sm:px-6 py-6">{renderActiveModule()}</main>
      </div>
    </div>
  );
}

export default AdminPanel;
