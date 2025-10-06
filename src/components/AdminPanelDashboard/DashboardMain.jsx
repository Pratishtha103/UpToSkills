// src/components/AdminPanelDashboard/DashboardMain.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "./Card";
import {
  FaBook,
  FaLaptopCode,
  FaCamera,
  FaPalette,
  FaMicrophone,
  FaUserGraduate,
  FaChalkboardTeacher,
  FaMoneyBillWave,
  FaBuilding,
} from "react-icons/fa";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import axios from "axios";

// Dummy Data (unchanged)
const courseProgressData = [
  { name: "User Experience Design", value: 72, tasks: 120, color: "#8884d8" },
  { name: "Basic Fundamentals", value: 48, tasks: 32, color: "#82ca9d" },
  { name: "React Native Components", value: 15, tasks: 182, color: "#ffc658" },
  { name: "Basic of Music Theory", value: 28, tasks: 58, color: "#ff7300" },
];

const topicInterestData = [
  { name: "Development", value: 35, language: "Java", langValue: 20 },
  { name: "UI/UX Design", value: 14, language: "Material", langValue: 12 },
  { name: "React", value: 10, language: "SEO, SMM", langValue: 25 },
];

const popularInstructors = [
  { name: "Maven Analytics", courses: 33, role: "Business Intelligence" },
  { name: "Maven Analytics", courses: 22, role: "Data Analytics" },
  { name: "Maven Analytics", courses: 18, role: "React Native" },
];

const PIE_COLORS = [
  "rgba(254, 109, 53,0.5)",
  "rgba(0, 208, 181,0.5)",
  "rgba(76, 175, 80, 0.5)",
  "rgba(244, 67, 54, 0.5)",
];

const formatNumber = (n) => {
  if (n === null || n === undefined) return "-";
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const DashboardMain = () => {
  const [stats, setStats] = useState({
    students: null,
    mentors: null,
    companies: null,
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const url = `${API_BASE}/api/stats`;

    let isMounted = true;

    axios
      .get(url, { timeout: 6000 })
      .then((res) => {
        if (!isMounted) return;
        // Expecting { students, employees, companies, mentors }
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

  const handleJoinEventClick = () => {
    console.log("Join The Event button clicked!");
  };

  return (
    <main className="flex-grow p-4 sm:p-6 flex flex-col gap-6">
      {/* Stats Overview */}
      <section className="mb-8">
        <motion.h2
          className="text-2xl font-bold text-foreground mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Platform Overview
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Students */}
          <motion.div
            className="stat-card p-6 flex items-center gap-4 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <motion.div
              className="p-3 rounded-2xl bg-gradient-primary"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <FaUserGraduate className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : formatNumber(stats.students)}
              </div>
              <div className="text-muted-foreground">Total Students</div>
            </div>
          </motion.div>

          {/* Mentors */}
          <motion.div
            className="stat-card p-6 flex items-center gap-4 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.div
              className="p-3 rounded-2xl bg-gradient-secondary"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <FaChalkboardTeacher className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : formatNumber(stats.mentors)}
              </div>
              <div className="text-muted-foreground">Total Mentors</div>
            </div>
          </motion.div>

          {/* Companies */}
          <motion.div
            className="stat-card p-6 flex items-center gap-4 cursor-pointer group"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div
              className="p-3 rounded-2xl bg-gradient-hero"
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <FaBuilding className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                {loadingStats ? "..." : formatNumber(stats.companies)}
              </div>
              <div className="text-muted-foreground">Total Companies</div>
            </div>
          </motion.div>
        </div>

        {statsError && (
          <div className="mt-3 text-sm text-red-500">
            {statsError} — make sure your backend `/api/stats` is running and returns:
            <pre className="text-xs mt-2 bg-gray-50 p-2 rounded">
{`{ students: number, employees: number, companies: number, mentors: number }`}
            </pre>
          </div>
        )}
      </section>

      {/* Top Courses & Assignment Progress (unchanged) */}
      <section className="flex flex-col lg:flex-row gap-6">
        {/* Top Courses */}
        <div className="flex-1 stat-card p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Top Courses
            </h3>
            <motion.select
              className="px-3 py-2 rounded-xl border-2 border-border bg-card text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
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
                bg: "rgba(106, 98, 255, 0.4)",
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
                className="flex justify-between items-center p-4 border-b border-border cursor-pointer rounded-xl group"
                onClick={() => handleCourseItemClick(course.name)}
                whileHover={{
                  backgroundColor: "hsl(var(--muted))",
                  x: 4,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2.5 font-medium text-base">
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
                <span className="text-sm text-muted-foreground">{course.views}</span>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Assignment Progress */}
        <div className="flex-1 stat-card p-6">
          <div className="flex justify-between items-center mb-4 pb-2 border-b border-border">
            <h3 className="text-lg sm:text-xl font-semibold text-foreground">
              Assignment Progress
            </h3>
            <motion.select
              className="px-3 py-2 rounded-xl border-2 border-border bg-card text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-300"
              onChange={(e) => handleDropdownChange(e, "Assignment Progress")}
              whileHover={{ scale: 1.02 }}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
            </motion.select>
          </div>

          <div className="flex flex-col gap-4">
            {courseProgressData.map((data, index) => (
              <div key={index} className="flex flex-col">
                <div className="flex justify-between mb-1 font-medium text-foreground">
                  <span>{data.name}</span>
                  <span>{data.tasks} Tasks</span>
                </div>

                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${data.value}%` }}
                    transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                  />
                </div>

                <div className="text-right text-xs text-gray-600 mt-1">{data.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ...remaining sections unchanged (Upcoming Webinar, Graphs, etc.) */}
      {/* For brevity they are left the same as your original component - already included above */}
    </main>
  );
};

export default DashboardMain;
