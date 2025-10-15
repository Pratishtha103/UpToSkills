// src/components/AdminPanelDashboard/DashboardMain.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
} from "react-icons/fa";

const DashboardMain = ({ isDarkMode, onNavigateSection }) => {
  const [stats, setStats] = useState({ students: null, mentors: null, companies: null });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch platform statistics
  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const url = `${API_BASE}/api/stats`;
    let isMounted = true;

    axios
      .get(url)
      .then((res) => {
        if (!isMounted) return;
        const data = res.data || {};
        setStats({
          students: data.students ?? 0,
          mentors: data.mentors ?? 0,
          companies: data.companies ?? 0,
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error("Failed to load stats:", err);
        setStatsError("Unable to load stats");
      })
      .finally(() => setLoadingStats(false));

    return () => (isMounted = false);
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const formatNumber = (num) => num?.toLocaleString("en-IN") ?? "0";

  return (
    <main
      className={`flex-grow p-4 sm:p-6 flex flex-col gap-8 transition-colors duration-300 ${
        isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900"
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
        {[
          {
            title: "Total Students",
            value: stats.students,
            icon: <FaUserGraduate className="w-6 h-6 text-white" />,
            gradient: "from-blue-500 to-indigo-500",
            onClick: () => onNavigateSection?.("students_table"),
          },
          {
            title: "Total Mentors",
            value: stats.mentors,
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
        ].map((card, index) => (
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
                {loadingStats ? "..." : formatNumber(card.value)}
              </div>
              <div
                className={`text-sm ${
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
          {statsError} — ensure your backend `/api/stats` is running.
        </div>
      )}

      {/* Top Programs */}
      <section
        className={`p-6 rounded-2xl shadow-md transition ${
          isDarkMode
            ? "bg-gray-900 border border-gray-800"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-300 dark:border-gray-700">
          <h3
            className={`text-lg font-semibold ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Top Programs
          </h3>
        </div>

        {/* Courses grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading
            ? Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-6 animate-pulse ${
                    isDarkMode ? "bg-gray-800" : "bg-gray-200"
                  }`}
                >
                  <div
                    className={`h-6 w-3/4 mb-3 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-full mb-2 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                  <div
                    className={`h-4 w-2/3 rounded ${
                      isDarkMode ? "bg-gray-700" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              ))
            : courses.map((program, index) => (
                <div
                  key={index}
                  className={`p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-lg ${
                    isDarkMode
                      ? "bg-gray-800 border border-gray-700 text-gray-100"
                      : "bg-white border border-gray-200 text-gray-800"
                  }`}
                >
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-gray-400 dark:text-gray-300 text-[15px] leading-snug">
                    {program.description}
                  </p>
                </div>
              ))}
        </div>
      </section>
    </main>
  );
};

export default DashboardMain;
