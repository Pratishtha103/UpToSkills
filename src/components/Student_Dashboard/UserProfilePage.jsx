import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import Footer from "./dashboard/Footer";

const UserProfilePage = () => {
  // ✅ Load dark mode from localStorage on first render
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Apply theme globally whenever it changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  // ✅ Toggle dark mode
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // ✅ Toggle sidebar
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // ✅ Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data;
        setUserData({
          full_name: d.profile_full_name || d.student_name,
          email: d.student_email,
          contact_number: d.contact_number || d.student_phone,
          linkedin_url: d.linkedin_url,
          github_url: d.github_url,
          why_hire_me: d.why_hire_me,
          ai_skill_summary: d.ai_skill_summary,
          domains_of_interest: d.domains_of_interest || [],
          others_domain: d.others_domain,
          profile_completed: d.profile_completed,
        });
      } catch (err) {
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-500">
      {/* ✅ Sidebar */}
      {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* ✅ Header */}
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* ✅ Page Content */}
        <motion.div
          className="flex-1 p-4 flex justify-center items-start pt-24 px-6"
          animate={{
            marginLeft: isOpen ? 0 : "-16rem", // 256px sidebar width
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 transition-colors duration-300">
            {loading ? (
              <p className="text-gray-700 dark:text-gray-300">Loading...</p>
            ) : error ? (
              <p className="text-red-600 font-semibold">{error}</p>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
                  User Profile
                </h2>

                {/* Profile Info */}
                <div className="flex flex-col gap-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Full Name
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.full_name || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Email
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.email || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Contact Number
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.contact_number || "-"}
                    </p>
                  </div>

                  {userData.linkedin_url && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        LinkedIn
                      </span>
                      <a
                        href={userData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.linkedin_url}
                      </a>
                    </div>
                  )}

                  {userData.github_url && (
                    <div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        GitHub
                      </span>
                      <a
                        href={userData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.github_url}
                      </a>
                    </div>
                  )}

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Why Hire Me
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.why_hire_me || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      AI Skill Summary
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.ai_skill_summary || "-"}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Domains of Interest
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.domains_of_interest?.length
                        ? userData.domains_of_interest.join(", ")
                        : "-"}
                      {userData.others_domain
                        ? `, ${userData.others_domain}`
                        : ""}
                    </p>
                  </div>

                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Profile Completed
                    </span>
                    <p className="text-gray-900 dark:text-gray-100">
                      {userData.profile_completed ? "✅ Yes" : "❌ No"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* ✅ Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default UserProfilePage;
