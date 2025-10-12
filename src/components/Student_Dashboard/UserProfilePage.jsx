import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";

const UserProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Apply dark mode immediately
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // ✅ Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

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
          email: d.student_email,
          full_name: d.profile_full_name || d.student_name,
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

  // ✅ Layout
  return (
    <div className="flex h-screen">
      {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        {/* 👇 your profile content here */}
      </div>
    </div>
  );
};

export default UserProfilePage;
