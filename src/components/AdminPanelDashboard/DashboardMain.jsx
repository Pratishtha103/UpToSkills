// src/components/AdminPanelDashboard/DashboardMain.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaTrash } from "react-icons/fa";
import axios from "axios";
import {
  FaUserGraduate,
  FaChalkboardTeacher,
  FaBuilding,
} from "react-icons/fa";

<<<<<<< HEAD
// Helper to format numbers with commas
const formatNumber = (n) =>
  n === null || n === undefined
    ? "-"
    : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

const DashboardMain = ({ isDarkMode = false, onNavigateSection }) => {
  const [stats, setStats] = useState({
    students: null,
    mentors: null,
    companies: null,
  });
=======
const DashboardMain = ({ isDarkMode, onNavigateSection }) => {
  const [stats, setStats] = useState({ students: null, mentors: null, companies: null });
>>>>>>> ba97d89bdf1c2191ef72cfb322ac649f56591cdb
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
<<<<<<< HEAD
  {/* Students */}
        <motion.div
          className={`p-6 rounded-2xl shadow-md flex items-center gap-4 hover:shadow-lg transition ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onNavigateSection && onNavigateSection('students_table')}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500">
            <FaUserGraduate className="w-6 h-6 text-white" />
          </div>
          <div>
            <div
              className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
            >
              {loadingStats ? "..." : formatNumber(stats.students)}
=======
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
>>>>>>> ba97d89bdf1c2191ef72cfb322ac649f56591cdb
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
<<<<<<< HEAD
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
          onClick={() => onNavigateSection && onNavigateSection('mentors_table')}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500">
            <FaChalkboardTeacher className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {loadingStats ? "..." : formatNumber(stats.mentors)}
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
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
          onClick={() => onNavigateSection && onNavigateSection('companies_table')}
          style={{ cursor: 'pointer' }}
        >
          <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500">
            <FaBuilding className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              {loadingStats ? "..." : formatNumber(stats.companies)}
            </div>
            <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              Total Companies
            </div>
          </div>
        </motion.div>
=======
          </motion.div>
        ))}
>>>>>>> ba97d89bdf1c2191ef72cfb322ac649f56591cdb
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 w-full max-w-6xl mx-auto px-6">
        {/* <h1 className="col-span-full text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Courses</h1> */}
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden"
          >
            {/* {course.image_path && (
              <img
                src={`http://localhost:5000${course.image_path}`}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
            )} */}
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4"> {course.description}</p>
              <button
                onClick={() => removeCourse(course.id)}
               className="text-xl flex items-center border border-gray-100 px-2 py-1 bg-red-600 text-white rounded-full">
                <FaTrash className="size-4 pr-1"/>Delete
              </button>
            </div>
          </div>
        ))}
        {
          courses.length === 0 && (
            <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
              No courses available. Please add a course.
            </p>
          )
        }
      </div>
      </section>
    </main>
  );
};

export default DashboardMain;
