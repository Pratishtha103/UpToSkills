import React, { useState, useEffect } from "react";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";

const StudentSkillBadgesPage = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Theme handling
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

  // Sidebar responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setSidebarVisible(!mobile);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch Skill Badges
  useEffect(() => {
    const fetchBadges = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/skill-badges");
        const data = await response.json();
        if (data.success) {
          setBadges(data.data);
        } else {
          console.error("Failed to fetch badges");
        }
      } catch (err) {
        console.error("Error fetching badges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBadges();
  }, []);

  return (
    <div
      className={`flex min-h-screen transition-all duration-300 ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
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

        <div className="pt-24 px-4 sm:px-6 py-6">
          <h1 className="text-3xl font-semibold mb-6">
            🎖️ Student Skill Badges
          </h1>

          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-300">
              Loading badges...
            </p>
          ) : badges.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-300">
              No skill badges found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition"
                >
                  <h2 className="text-xl font-semibold mb-2 dark:text-white">
                    {badge.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-3">
                    {badge.description}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Awarded To:{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {badge.full_name || "Unknown Student"}
                    </span>
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                    Awarded At:{" "}
                    {new Date(badge.awarded_at).toLocaleDateString("en-IN")}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default StudentSkillBadgesPage;
