// src/components/AdminPanelDashboard/DashboardMain.jsx

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FaTrash,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
  FaBookOpen,
} from "react-icons/fa";
import axios from "axios";

const DashboardMain = ({ isDarkMode = false, onNavigateSection }) => {
  const [stats, setStats] = useState({
    students: null,
    mentors: null,
    companies: null,
    courses: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  // Fetch stats
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    let isMounted = true;

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/stats`);
        const data = res.data || {};

        const courseRes = await axios.get(`${API_BASE}/api/courses`);
        const courses = Array.isArray(courseRes.data)
          ? courseRes.data
          : Array.isArray(courseRes.data.courses)
          ? courseRes.data.courses
          : [];

        if (!isMounted) return;

        setStats({
          students: data.students ?? 0,
          mentors: data.mentors ?? 0,
          companies: data.companies ?? 0,
          courses: courses.length ?? 0,
        });
      } catch (err) {
        console.error("Failed to load stats:", err);
        if (isMounted) setStatsError("Unable to load stats");
      } finally {
        if (isMounted) setLoadingStats(false);
      }
    };

    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  const formatNumber = (num) => {
    if (num === null || num === undefined) return "...";
    const n = typeof num === "number" ? num : Number(num);
    return n.toLocaleString("en-IN");
  };

  // Cards data
  const cards = [
    {
      title: "Total Students",
      value: stats.students,
      loading: loadingStats,
      icon: <FaUserGraduate className="w-6 h-6 text-white" />,
      gradient: "from-blue-500 to-indigo-500",
      onClick: () => onNavigateSection?.("students_table"),
    },
    {
      title: "Total Mentors",
      value: stats.mentors,
      loading: loadingStats,
      icon: <FaChalkboardTeacher className="w-6 h-6 text-white" />,
      gradient: "from-green-500 to-emerald-500",
      onClick: () => onNavigateSection?.("mentors_table"),
    },
    {
      title: "Total Companies",
      value: stats.companies,
      icon: <FaBuilding className="w-6 h-6 text-white" />,
      gradient: "from-orange-500 to-red-500",
      onClick: () => onNavigateSection?.("companies_table"),
    },
    {
      title: "Total Programs",
      value: stats.courses,
      loading: loadingStats,
      icon: <FaBookOpen className="w-6 h-6 text-white" />,
      gradient: "from-purple-500 to-pink-500",
      onClick: () => onNavigateSection?.("courses_table"),
    },
  ];

  return (
    <main
      className={`flex-grow p-4 sm:p-6 flex flex-col gap-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h2
        className={`text-2xl font-bold mb-4 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Platform Overview
      </motion.h2>

      {/* === Stat Cards (FIXED: 4 cards in one row) === */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            onClick={card.onClick}
            className={`p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-xl transition cursor-pointer ${
              isDarkMode
                ? "bg-gray-900 hover:bg-gray-800 border border-gray-700"
                : "bg-white hover:bg-gray-100 border border-gray-200"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`p-3 rounded-2xl bg-gradient-to-r ${card.gradient}`}>
              {card.icon}
            </div>

            <div>
              <div
                className={`text-2xl font-bold ${
                  isDarkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {card.loading ? "..." : formatNumber(card.value)}
              </div>

              <div
                className={`${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {card.title}
              </div>
            </div>
          </motion.div>
        ))}
      </section>

      {statsError && (
        <div className="mt-3 text-sm text-red-500">
          {statsError} — ensure your backend `/api/stats` and `/api/courses` are running.
        </div>
      )}
    </main>
  );
};

export default DashboardMain;
