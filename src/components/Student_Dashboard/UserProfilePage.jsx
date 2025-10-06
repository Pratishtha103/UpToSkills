import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";

const UserProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError("");

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

  return (
    <div
      className={`flex h-screen dashboard-container${
        isDarkMode ? " dark" : ""
      }`}
    >
      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isDarkMode={isDarkMode}
        />
      )}
      <div
        className={`flex-1 flex flex-col overflow-hidden main-content${
          isOpen ? "" : " full-width"
        }`}
      >
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <div className="flex-1 overflow-y-auto pt-24 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Your Profile
            </h1>

            {loading && (
              <p className="text-gray-600 dark:text-gray-400">Loading...</p>
            )}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && userData && (
              <>
                {/* Account Information */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                    Account Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Info label="Email" value={userData.email} />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Info */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                      Personal Information
                    </h2>
                    <div className="space-y-4">
                      <Info label="Full Name" value={userData.full_name} />
                      <Info
                        label="Contact Number"
                        value={userData.contact_number}
                      />
                      <LinkInfo
                        label="LinkedIn URL"
                        url={userData.linkedin_url}
                      />
                      <LinkInfo label="GitHub URL" url={userData.github_url} />
                      <Info label="Why Hire Me" value={userData.why_hire_me} />
                      <Info
                        label="Profile Completed"
                        value={userData.profile_completed ? "Yes" : "No"}
                      />
                      <Info
                        label="AI Skill Summary"
                        value={userData.ai_skill_summary}
                      />
                    </div>
                  </div>

                  {/* Domains */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                      Domains of Interest
                    </h2>
                    <div className="space-y-3">
                      {userData.domains_of_interest?.map((domain, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-800 dark:text-white">
                            {domain}
                          </span>
                        </div>
                      ))}
                      {userData.others_domain && (
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                          <span className="text-gray-800 dark:text-white">
                            Others: {userData.others_domain}
                          </span>
                        </div>
                      )}
                    </div>
                                    {/* Edit Profile Button */}
                <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => window.location.href = '/dashboard/edit-profile'}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                  >
                    Edit Profile
                  </button>
                </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small helper components to reduce repetition
const Info = ({ label, value }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
      {value || "—"}
    </p>
  </div>
);

const LinkInfo = ({ label, url }) => (
  <div>
    <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
      {label}
    </label>
    {url ? (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        {url}
      </a>
    ) : (
      <p className="text-gray-800 dark:text-white">—</p>
    )}
  </div>
);

export default UserProfilePage;
