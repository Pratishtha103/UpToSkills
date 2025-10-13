// src/components/AdminPanelDashboard/DashboardMain.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaBook,
  FaLaptopCode,
  FaCamera,
  FaPalette,
  FaMicrophone,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
} from "react-icons/fa";

// Helper to format numbers with commas
const formatNumber = (n) =>
  n === null || n === undefined
    ? "-"
    : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const DashboardMain = ({ isDarkMode = false }) => {
  const [stats, setStats] = useState({
    students: null,
    mentors: null,
    companies: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Fetch stats data
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const url = `${API_BASE}/api/stats`;
    let isMounted = true;

    axios
      .get(url, { timeout: 6000 })
      .then((res) => {
        if (!isMounted) return;
        const data = res.data || {};
        setStats({
          students: data.students ?? 0,
          mentors: data.mentors ?? 0,
          companies: data.companies ?? 0,
        });
        setLoadingStats(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load stats:", err?.message || err);
        setStatsError("Unable to load stats");
        setLoadingStats(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleDropdownChange = (e, sectionName) => {
    console.log(`Dropdown in ${sectionName} changed to:`, e.target.value);
  };

  const handleCourseItemClick = (courseName) => {
    console.log(`Course item clicked: ${courseName}`);
  };

  // Courses Data
  const topCourses = [
    {
      name: "Videography Basic Design Course",
      views: "1.2K Views",
      icon: <FaBook />,
      color: "rgba(106, 98, 255, 0.9)",
      bg: "rgba(106, 98, 255, 0.2)",
    },
    {
      name: "Basic Front-end Development Course",
      views: "1.5K Views",
      icon: <FaLaptopCode />,
      color: "rgba(255, 187, 40, 0.8)",
      bg: "rgba(255, 187, 40, 0.2)",
    },
    {
      name: "Basic Fundamentals of Photography",
      views: "978 Views",
      icon: <FaCamera />,
      color: "rgba(76, 175, 80, 0.8)",
      bg: "rgba(76, 175, 80, 0.2)",
    },
    {
      name: "Advance Dribble Base Visual Design",
      views: "765 Views",
      icon: <FaPalette />,
      color: "rgba(244, 67, 54, 0.8)",
      bg: "rgba(244, 67, 54, 0.2)",
    },
    {
      name: "Your First Singing Lesson",
      views: "3.4K Views",
      icon: <FaMicrophone />,
      color: "rgba(0, 255, 255, 1)",
      bg: "rgba(0, 255, 255, 0.2)",
    },
  ];

  return (
    <main
      className={`flex-grow p-4 sm:p-6 flex flex-col gap-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header */}
      <motion.h2
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Platform Overview
      </motion.h2>

      {/* Stats Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Students */}
        <motion.div
          className={`p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500">
            <FaUserGraduate className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : formatNumber(stats.students)}
            </div>
            <div
              className={`text-gray-500 ${isDarkMode ? "text-gray-400" : ""}`}
            >
              Total Students
            </div>
          </div>
        </motion.div>

        {/* Mentors */}
        <motion.div
          className={`p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
            <FaChalkboardTeacher className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : formatNumber(stats.mentors)}
            </div>
            <div
              className={`text-gray-500 ${isDarkMode ? "text-gray-400" : ""}`}
            >
              Total Mentors
            </div>
          </div>
        </motion.div>

        {/* Companies */}
        <motion.div
          className={`p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
            <FaBuilding className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {loadingStats ? "..." : formatNumber(stats.companies)}
            </div>
            <div
              className={`text-gray-500 ${isDarkMode ? "text-gray-400" : ""}`}
            >
              Total Companies
            </div>
          </div>
        </motion.div>
      </section>

      {/* Error Message */}
      {statsError && (
        <div className="mt-3 text-sm text-red-500">
          {statsError} — make sure your backend `/api/stats` is running.
        </div>
      )}

      {/* Top Courses Section */}
      <section
        className={`p-6 rounded-2xl shadow-md transition-colors duration-300 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div
          className={`flex justify-between items-center mb-4 pb-2 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <h3 className="text-lg font-semibold">Top Courses</h3>
          <motion.select
            className={`px-3 py-2 rounded-xl border text-sm bg-transparent focus:ring-2 focus:ring-indigo-500 outline-none ${
              isDarkMode
                ? "border-gray-700 text-gray-200"
                : "border-gray-300 text-gray-800"
            }`}
            onChange={(e) => handleDropdownChange(e, "Top Courses")}
            whileHover={{ scale: 1.02 }}
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </motion.select>
        </div>

        {/* Course List */}
        <ul className="space-y-3">
          {topCourses.map((course, index) => (
            <motion.li
              key={index}
              className={`flex justify-between items-center p-4 border-b rounded-xl cursor-pointer transition-colors duration-300 ${
                isDarkMode
                  ? "border-gray-700 hover:bg-gray-700 text-gray-100"
                  : "border-gray-200 hover:bg-gray-100 text-gray-800"
              }`}
              onClick={() => handleCourseItemClick(course.name)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 font-medium">
                <span
                  className="flex justify-center items-center text-xl rounded-md"
                  style={{
                    padding: "0.5rem",
                    width: "2.5rem",
                    color: course.color,
                    backgroundColor: course.bg,
                  }}
                >
                  {course.icon}
                </span>
                <span>{course.name}</span>
              </div>
              <span
                className={`${isDarkMode ? "text-gray-300" : "text-gray-500"}`}
              >
                {course.views}
              </span>
            </motion.li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default DashboardMain;
