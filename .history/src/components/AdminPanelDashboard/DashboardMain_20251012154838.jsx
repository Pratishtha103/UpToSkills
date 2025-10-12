import React from "react";
import { motion } from "framer-motion";
import { Users, FolderOpen, Briefcase, BarChart2, Award } from "lucide-react";

import Card from "./Card"; // Assuming you already have the Card component

function DashboardMain({ isDarkMode }) {
  // Dummy stats data
  const stats = [
    {
      title: "Total Students",
      value: 124,
      percentage: "+5%",
      textIcon: <Users />,
      color: "#4f46e5",
      bg: isDarkMode ? "#1e1b4b" : "#ede9fe",
    },
    {
      title: "Total Projects",
      value: 37,
      percentage: "+2%",
      textIcon: <FolderOpen />,
      color: "#16a34a",
      bg: isDarkMode ? "#14532d" : "#d1fae5",
    },
    {
      title: "Total Companies",
      value: 22,
      percentage: "-1%",
      textIcon: <Project />,
      color: "#dc2626",
      bg: isDarkMode ? "#7f1d1d" : "#fee2e2",
    },
    {
      title: "Analytics Score",
      value: "87%",
      percentage: "+3%",
      textIcon: <BarChart2 />,
      color: "#f59e0b",
      bg: isDarkMode ? "#78350f" : "#fef3c7",
    },
    {
      title: "Top Mentor",
      value: "John Doe",
      textIcon: <Award />,
      color: "#8b5cf6",
      bg: isDarkMode ? "#4c1d95" : "#ede9fe",
    },
  ];

  return (
    <main
      className={`p-4 sm:p-6 flex flex-col gap-6 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Admin Dashboard Overview
      </motion.h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card
              title={stat.title}
              value={stat.value}
              percentage={stat.percentage}
              textIcon={stat.textIcon}
              color={stat.color}
              bg={stat.bg}
            />
          </motion.div>
        ))}
      </div>

      {/* Placeholder sections */}
      <motion.div
        className={`stat-card p-6 rounded-lg ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        } mt-6`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold mb-4">Recent Activities</h2>
        <p className="text-sm text-gray-400">
          Placeholder for recent activities or charts. You can integrate charts
          or tables here for analytics.
        </p>
      </motion.div>
    </main>
  );
}

export default DashboardMain;
