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
import { Sun, Moon } from "lucide-react"; // 🌗 added icons for theme toggle

const formatNumber = (n) =>
  n === null || n === undefined
    ? "-"
    : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const DashboardMain = () => {
  const [stats, setStats] = useState({
    students: null,
    mentors: null,
    companies: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); // 🌗 theme state

  // 🌗 Dark/Light mode effect
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch stats
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

  const handleDropdownChange = (e, sectionName) => {
    console.log(`Dropdown in ${sectionName} changed to:`, e.target.value);
  };

  const handleCourseItemClick = (courseName) => {
    console.log(`Course item clicked: ${courseName}`);
  };

  return (
    <main className="flex-grow p-4 sm:p-6 flex flex-col gap-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 min-h-screen">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <motion.h2
          className="text-2xl font-bold text-gray-800 dark:text-white mb-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Platform Overview
        </motion.h2>

        {/* 🌗 Theme Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
      </div>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Students */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500">
            <FaUserGraduate className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {loadingStats ? "..." : formatNumber(stats.students)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Total Students
            </div>
          </div>
        </motion.div>

        {/* Mentors */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
            <FaChalkboardTeacher className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {loadingStats ? "..." : formatNumber(stats.mentors)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Total Mentors
            </div>
          </div>
        </motion.div>

        {/* Companies */}
        <motion.div
          className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
            <FaBuilding className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {loadingStats ? "..." : formatNumber(stats.companies)}
            </div>
            <div className="text-gray-500 dark:text-gray-400">
              Total Companies
            </div>
          </div>
        </motion.div>
      </section>

      {statsError && (
        <div className="mt-3 text-sm text-red-500">
          {statsError} — make sure your backend `/api/stats` is running.
        </div>
      )}

      {/* Top Courses */}
      <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Top Courses
          </h3>
          <motion.select
            className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-sm text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
            onChange={(e) => handleDropdownChange(e, "Top Courses")}
            whileHover={{ scale: 1.02 }}
          >
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
          </motion.select>
        </div>

        <ul className="space-y-3">
          {[
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
          ].map((course, index) => (
            <motion.li
              key={index}
              className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              onClick={() => handleCourseItemClick(course.name)}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 font-medium text-gray-800 dark:text-gray-100">
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
              <span className="text-sm text-gray-500 dark:text-gray-400">
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
