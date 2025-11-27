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

  const renderActiveModule = () => {
    switch (activeSection) {
      case "dashboard": return <DashboardMain />;
      case "students": return <Students />;
      case "companies": return <Company />;
      case "projects": return <Project />;
      case "analytics": return <Analytics />;
      case "mentor": return <MentorReview />;
      case "notifications": return <AdminNotifications />;
      default: return <DashboardMain />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Sidebar */}
      <AdminSidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-64" : "ml-0"
      }`}>
        {/* Header */}
        <AdminNavbar
          onMenuClick={toggleSidebar}
          onNotificationsClick={() => setActiveSection("notifications")}
        />
        {/* Content */}
        <main className="pt-20 px-4 sm:px-6 py-6">
          <motion.section
            className="hero-gradient rounded-2xl p-8 mb-8 text-white"
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
              className="text-xl text-white/90"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Manage students, companies, projects, and analytics from one place.
            </motion.p>
          </motion.section>

          {renderActiveModule()}
        </main>

        <footer className="text-center py-8 border-t border-border mt-12">
          <p className="text-muted-foreground">
            © 2025 UptoSkills Team. All rights reserved. ✨
          </p>
        </footer>
      </div>
    </div>
  );
}

export default AdminPanel;
