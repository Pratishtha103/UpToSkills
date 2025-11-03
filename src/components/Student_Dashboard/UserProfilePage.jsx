// import { motion } from "framer-motion";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./dashboard/Sidebar";
// import Header from "./dashboard/Header";
// import Footer from "./dashboard/Footer.jsx";

// const UserProfilePage = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isOpen, setIsOpen] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Apply dark mode immediately
//   useEffect(() => {
//     if (isDarkMode) {
//       document.documentElement.classList.add("dark");
//     } else {
//       document.documentElement.classList.remove("dark");
//     }
//   }, [isDarkMode]);

//   const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   // Fetch user profile
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
//           full_name: d.profile_full_name || d.student_name,
//           email: d.student_email,
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

//   return (
//     <div className="flex min-h-screen">
//       {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}
//       <div className=" flex-1 flex flex-col min-h-screen overflow-hidden">
//         <Header
//           onMenuClick={toggleSidebar}
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//         />
//         <motion.div
//           className=" flex-1 p-4 flex justify-center pt-24 px-6 bg-gray-50 dark:bg-gray-950"
//           animate={{ 
//             marginLeft: isOpen ? 0 : '-16rem' // 16rem = 256px sidebar width
//           }}
//           transition={{ type: "spring", stiffness: 300, damping: 30 }}
//         >
//           <div className="flex-1 flex justify-center shadow-xl items-start pt-12 px-6 bg-gray-50 dark:bg-gray-950">
//           {loading ? (
//             <p className="text-gray-700 dark:text-gray-300">Loading...</p>
//           ) : error ? (
//             <p className="text-red-600 font-semibold">{error}</p>
//           ) : (
//             <div className="bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-8 w-full max-w-2xl flex flex-col gap-4">
//               <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
//                 User Profile
//               </h2>

//               {/* Full Name */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Full Name
//                 </span>
//                 <span className="text-gray-900 dark:text-gray-100">
//                   {userData.full_name || "-"}
//                 </span>
//               </div>

//               {/* Email */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Email
//                 </span>
//                 <span className="text-gray-900 dark:text-gray-100">
//                   {userData.email || "-"}
//                 </span>
//               </div>

//               {/* Contact */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Contact Number
//                 </span>
//                 <span className="text-gray-900 dark:text-gray-100">
//                   {userData.contact_number || "-"}
//                 </span>
//               </div>

//               {/* LinkedIn */}
//               {userData.linkedin_url && (
//                 <div className="flex flex-col">
//                   <span className="font-medium text-gray-700 dark:text-gray-300">
//                     LinkedIn
//                   </span>
//                   <a
//                     href={userData.linkedin_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 dark:text-blue-400 underline"
//                   >
//                     {userData.linkedin_url}
//                   </a>
//                 </div>
//               )}

//               {/* GitHub */}
//               {userData.github_url && (
//                 <div className="flex flex-col">
//                   <span className="font-medium text-gray-700 dark:text-gray-300">
//                     GitHub
//                   </span>
//                   <a
//                     href={userData.github_url}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="text-blue-600 dark:text-blue-400 underline"
//                   >
//                     {userData.github_url}
//                   </a>
//                 </div>
//               )}

//               {/* Why hire me */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Why Hire Me
//                 </span>
//                 <p className="text-gray-900 dark:text-gray-100">
//                   {userData.why_hire_me || "-"}
//                 </p>
//               </div>

//               {/* AI Skill Summary */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   AI Skill Summary
//                 </span>
//                 <p className="text-gray-900 dark:text-gray-100">
//                   {userData.ai_skill_summary || "-"}
//                 </p>
//               </div>

//               {/* Domains of Interest */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Domains of Interest
//                 </span>
//                 <p className="text-gray-900 dark:text-gray-100">
//                   {userData.domains_of_interest.length > 0
//                     ? userData.domains_of_interest.join(", ")
//                     : "-"}
//                   {userData.others_domain ? `, ${userData.others_domain}` : ""}
//                 </p>
//               </div>

//               {/* Profile Completed */}
//               <div className="flex flex-col">
//                 <span className="font-medium text-gray-700 dark:text-gray-300">
//                   Profile Completed
//                 </span>
//                 <p className="text-gray-900 dark:text-gray-100">
//                   {userData.profile_completed ? "✅ Yes" : "❌ No"}
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//         </motion.div>
//         <Footer/>
//       </div>
//     </div>
//   );
// };

// export default UserProfilePage;
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";
// // import Sidebar from "./dashboard/Sidebar";
// // import Header from "./dashboard/Header";

// // const UserProfilePage = () => {
// //   const [isDarkMode, setIsDarkMode] = useState(false);
// //   const [isOpen, setIsOpen] = useState(true);
// //   const [userData, setUserData] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   // ✅ Apply dark mode immediately
// //   useEffect(() => {
// //     if (isDarkMode) {
// //       document.documentElement.classList.add("dark");
// //     } else {
// //       document.documentElement.classList.remove("dark");
// //     }
// //   }, [isDarkMode]);

// //   // ✅ Toggle dark mode
// //   const toggleDarkMode = () => {
// //     setIsDarkMode((prev) => !prev);
// //   };

// //   // ✅ Toggle sidebar
// //   const toggleSidebar = () => setIsOpen((prev) => !prev);

// //   // ✅ Fetch user profile
// //   useEffect(() => {
// //     const fetchProfile = async () => {
// //       try {
// //         const token = localStorage.getItem("token");
// //         if (!token) {
// //           setError("No token found. Please log in again.");
// //           setLoading(false);
// //           return;
// //         }

// //         const res = await axios.get("http://localhost:5000/api/profile", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });

// //         const d = res.data.data;
// //         setUserData({
// //           email: d.student_email,
// //           full_name: d.profile_full_name || d.student_name,
// //           contact_number: d.contact_number || d.student_phone,
// //           linkedin_url: d.linkedin_url,
// //           github_url: d.github_url,
// //           why_hire_me: d.why_hire_me,
// //           ai_skill_summary: d.ai_skill_summary,
// //           domains_of_interest: d.domains_of_interest || [],
// //           others_domain: d.others_domain,
// //           profile_completed: d.profile_completed,
// //         });
// //       } catch (err) {
// //         setError("Failed to load profile. Please try again.");
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchProfile();
// //   }, []);

// //   // ✅ Layout
// //   return (
// //     <div className="flex h-screen">
// //       {isOpen && <Sidebar isOpen={isOpen} isDarkMode={isDarkMode} />}
// //       <div className="flex-1 flex flex-col overflow-hidden">
// //         <Header
// //           onMenuClick={toggleSidebar}
// //           isDarkMode={isDarkMode}
// //           toggleDarkMode={toggleDarkMode}
// //         />
// //         {/* 👇 your profile content here */}
        
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserProfilePage;

// import { motion } from "framer-motion";
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "./dashboard/Sidebar";
// import Header from "./dashboard/Header";
// import Footer from "./dashboard/Footer.jsx";

// const UserProfilePage = () => {
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isOpen, setIsOpen] = useState(true);
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   // Apply dark mode immediately
//   useEffect(() => {
//     if (isDarkMode) document.documentElement.classList.add("dark");
//     else document.documentElement.classList.remove("dark");
//   }, [isDarkMode]);

//   const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
//   const toggleSidebar = () => setIsOpen((prev) => !prev);

//   // Fetch user profile
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
//           full_name: d.profile_full_name || d.student_name,
//           email: d.student_email,
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

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header
//         onMenuClick={toggleSidebar}
//         isDarkMode={isDarkMode}
//         toggleDarkMode={toggleDarkMode}
//       />

//       {/* Main Center Section */}
//       {/* <motion.div
//         className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gray-50 dark:bg-gray-950"
//         animate={{ marginLeft: isOpen ? 0 : "-16rem" }}
//         transition={{ type: "spring", stiffness: 300, damping: 30 }}
//       > */}
//       <motion.div
//   className="flex-1 flex items-center justify-center min-h-[80vh] bg-gray-50 dark:bg-gray-950 transition-all duration-300"
//   animate={{
//     marginLeft: isOpen ? "0rem" : "0rem",
//   }}
//   transition={{ type: "tween", duration: 0.3 }}
// >
//         <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700 transition-all duration-500">
//           <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
//             User Profile
//           </h2>
//           <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
//             View your saved profile details below.
//           </p>

//           {loading ? (
//             <p className="text-gray-700 dark:text-gray-300 text-center">
//               Loading...
//             </p>
//           ) : error ? (
//             <p className="text-red-600 dark:text-red-400 text-center font-semibold">
//               {error}
//             </p>
//           ) : (
//             <div className="space-y-4">
//               {[
//                 ["Full Name", userData.full_name],
//                 ["Email", userData.email],
//                 ["Contact Number", userData.contact_number],
//                 [
//                   "LinkedIn",
//                   userData.linkedin_url ? (
//                     <a
//                       href={userData.linkedin_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 dark:text-blue-400 underline"
//                     >
//                       {userData.linkedin_url}
//                     </a>
//                   ) : (
//                     "-"
//                   ),
//                 ],
//                 [
//                   "GitHub",
//                   userData.github_url ? (
//                     <a
//                       href={userData.github_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-blue-600 dark:text-blue-400 underline"
//                     >
//                       {userData.github_url}
//                     </a>
//                   ) : (
//                     "-"
//                   ),
//                 ],
//                 ["Why Hire Me", userData.why_hire_me || "-"],
//                 ["AI Skill Summary", userData.ai_skill_summary || "-"],
//                 [
//                   "Domains of Interest",
//                   userData.domains_of_interest.length > 0
//                     ? userData.domains_of_interest.join(", ")
//                     : "-",
//                 ],
//                 [
//                   "Profile Completed",
//                   userData.profile_completed ? "✅ Yes" : "❌ No",
//                 ],
//               ].map(([label, value]) => (
//                 <div key={label}>
//                   <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
//                     {label}
//                   </label>
//                   <p className="text-gray-900 dark:text-gray-100">{value}</p>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </motion.div>

//       <Footer />
//     </div>
//   );
// };

// export default UserProfilePage;
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

  // ✅ Load dark mode preference from localStorage on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // ✅ When dark mode changes → update document & localStorage
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
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  // ✅ Fetch user profile data
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
        console.error(err);
        setError("Failed to load profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 transition-all duration-500">
      {/* ✅ Sidebar */}
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* ✅ Profile Section */}
        <motion.div
          className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8"
          animate={{
            marginLeft: isOpen ? "16rem" : "0rem",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {loading ? (
            <p className="text-gray-700 dark:text-gray-300 text-center text-xl">
              Loading...
            </p>
          ) : error ? (
            <p className="text-red-600 dark:text-red-400 text-center font-semibold">
              {error}
            </p>
          ) : (
            <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl w-full max-w-3xl border border-gray-200 dark:border-gray-700 transition-all duration-500">
              <h2 className="text-3xl font-extrabold text-center mb-4 text-indigo-700 dark:text-indigo-400">
                User Profile
              </h2>
              <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
                View your saved profile details below.
              </p>

              <div className="space-y-4">
                {[
                  ["Full Name", userData.full_name],
                  ["Email", userData.email],
                  ["Contact Number", userData.contact_number],
                  [
                    "LinkedIn",
                    userData.linkedin_url ? (
                      <a
                        href={userData.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.linkedin_url}
                      </a>
                    ) : (
                      "-"
                    ),
                  ],
                  [
                    "GitHub",
                    userData.github_url ? (
                      <a
                        href={userData.github_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 underline"
                      >
                        {userData.github_url}
                      </a>
                    ) : (
                      "-"
                    ),
                  ],
                  ["Why Hire Me", userData.why_hire_me || "-"],
                  ["AI Skill Summary", userData.ai_skill_summary || "-"],
                  [
                    "Domains of Interest",
                    userData.domains_of_interest.length > 0
                      ? userData.domains_of_interest.join(", ")
                      : "-",
                  ],
                  [
                    "Profile Completed",
                    userData.profile_completed ? "✅ Yes" : "❌ No",
                  ],
                ].map(([label, value]) => (
                  <div key={label}>
                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-1">
                      {label}
                    </label>
                    <p className="text-gray-900 dark:text-gray-100">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        <Footer />
      </div>
    </div>
  );
};

export default UserProfilePage;
