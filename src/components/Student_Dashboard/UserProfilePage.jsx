import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./dashboard/Sidebar";
import Header from "./dashboard/Header";
import Footer from "./dashboard/Footer.jsx";

const UserProfilePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Apply dark mode immediately
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // Fetch user profile
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
    <div className="flex min-h-screen">
      {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}
      <div className=" flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
        <motion.div
          className=" flex-1 p-4 flex justify-center pt-24 px-6 bg-gray-50 dark:bg-gray-950"
          animate={{ 
            marginLeft: isOpen ? 0 : '-16rem' // 16rem = 256px sidebar width
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex-1 flex justify-center shadow-xl items-start pt-12 px-6 bg-gray-50 dark:bg-gray-950">
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300">Loading...</p>
          ) : error ? (
            <p className="text-red-600 font-semibold">{error}</p>
          ) : (
            <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
                User Profile
              </h2>

              {/* Full Name */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Full Name
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {userData.full_name || "-"}
                </span>
              </div>

              {/* Email */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Email
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {userData.email || "-"}
                </span>
              </div>

              {/* Contact */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Contact Number
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {userData.contact_number || "-"}
                </span>
              </div>

              {/* LinkedIn */}
              {userData.linkedin_url && (
                <div className="flex flex-col">
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

              {/* GitHub */}
              {userData.github_url && (
                <div className="flex flex-col">
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

              {/* Why hire me */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Why Hire Me
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.why_hire_me || "-"}
                </p>
              </div>

              {/* AI Skill Summary */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  AI Skill Summary
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.ai_skill_summary || "-"}
                </p>
              </div>

              {/* Domains of Interest */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Domains of Interest
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.domains_of_interest.length > 0
                    ? userData.domains_of_interest.join(", ")
                    : "-"}
                  {userData.others_domain ? `, ${userData.others_domain}` : ""}
                </p>
              </div>

              {/* Profile Completed */}
              <div className="flex flex-col">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  Profile Completed
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {userData.profile_completed ? "✅ Yes" : "❌ No"}
                </p>
              </div>
            </div>
          )}
        </div>
        </motion.div>
        <Footer/>
      </div>
    </div>
  );
};

export default UserProfilePage;
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./dashboard/Sidebar";
// import Header from "./dashboard/Header";

// const UserProfilePage = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isOpen, setIsOpen] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // ✅ Apply dark mode immediately
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   // ✅ Toggle dark mode
//   const toggleDarkMode = () => {
//     setIsDarkMode((prev) => !prev);
//   };

//   // ✅ Toggle sidebar
//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   // ✅ Fetch user profile
//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           setError("No token found. Please log in again.");
//           setLoading(false);
//           return;
//         }

//         const res = await axios.get("http://localhost:5000/api/profile", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const d = res.data.data;
//         setUserData({
//           email: d.student_email,
//           full_name: d.profile_full_name || d.student_name,
//           contact_number: d.contact_number || d.student_phone,
//           linkedin_url: d.linkedin_url,
//           github_url: d.github_url,
//           why_hire_me: d.why_hire_me,
//           ai_skill_summary: d.ai_skill_summary,
//           domains_of_interest: d.domains_of_interest || [],
//           others_domain: d.others_domain,
//           profile_completed: d.profile_completed,
//         });
//       } catch (err) {
//         setError("Failed to load profile. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProfile();
//   }, []);

//   // ✅ Layout
//   return (
//     <div className="flex h-screen">
//       {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         <Header
//           onMenuClick={toggleSidebar}
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//         />
//         {/* 👇 your profile content here */}
        
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
