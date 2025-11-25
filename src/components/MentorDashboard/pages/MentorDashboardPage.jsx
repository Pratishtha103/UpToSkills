import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomeSection from "../components/Welcome";

const MentorDashboardPage = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/students/count")
      .then((res) => setTotalStudents(res.data.totalStudents))
      .catch((err) => console.error("Error fetching students:", err));

    axios
      .get("http://localhost:5000/api/mentors/count")
      .then((res) => setTotalMentors(res.data.totalMentors))
      .catch((err) => console.error("Error fetching mentors:", err));
  }, []);

  const dashboardFeatures = [
    {
      icon: "📋",
      title: "Glance",
      description: "Programs assigned to me",
      count: 0, // static total number of programs assigned
      color: "primary",   // ⭐ add this
      onClick: () => navigate("open-source-contributions"),
    },
    {
      icon: "👥",
      title: "Multi-Student View",
      description:
        "Easily toggle between multiple students to evaluate and mentor efficiently.",
      onClick: () => navigate("multi-student"),
    },
  ];

  return (
    <div
      className={`mt-14 flex min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* ✅ Pass both isDarkMode and setIsDarkMode to Sidebar */}
      <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="flex-1 flex flex-col">
        {/* ✅ Header toggle controls global theme */}
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        <div
          className={`flex-1 p-8 transition-colors duration-300 ${
            isDarkMode ? "bg-gray-900" : "bg-gray-50"
          }`}
        >
          <WelcomeSection />
          <div className="flex flex-wrap justify-center gap-6">
            {dashboardFeatures.map((feature, index) => (
              <DashboardCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                count={feature.count}   // <-- ⭐ added
                color={feature.color}     // ⭐ added
                onClick={feature.onClick}
                isDarkMode={isDarkMode}
              />

            ))}
          </div>
        </div>

        {/* ✅ Footer adapts automatically */}
        <Footer isDarkMode={isDarkMode} />
      </div>
    </div>
  );
};

export default MentorDashboardPage;
