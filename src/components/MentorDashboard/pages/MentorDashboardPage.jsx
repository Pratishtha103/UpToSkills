import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WelcomeSection from "../components/Welcome";
import { useTheme } from "../../../context/ThemeContext";

const MentorDashboardPage = () => {
  const { darkMode: isDarkMode } = useTheme();
  const navigate = useNavigate();

  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);
  const [assignedProgramsCount, setAssignedProgramsCount] = useState(0);

  useEffect(() => {
    // Fetch students and mentors counts
    const token = localStorage.getItem('token');
    const headers = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

    axios
      .get("http://localhost:5000/api/students/count", headers)
      .then((res) => setTotalStudents(res.data.totalStudents))
      .catch((err) => console.error("Error fetching students:", err));

    axios
      .get("http://localhost:5000/api/mentors/count", headers)
      .then((res) => setTotalMentors(res.data.totalMentors))
      .catch((err) => console.error("Error fetching mentors:", err));

    // Fetch assigned programs for current mentor
    const currentUser = localStorage.getItem("user");
    if (currentUser) {
      try {
        const user = JSON.parse(currentUser);
        const mentorId = user.id;
        
        axios
          .get(`http://localhost:5000/api/assigned-programs/mentor/${mentorId}`)
          .then((res) => {
            if (res.data.success && Array.isArray(res.data.data)) {
              setAssignedProgramsCount(res.data.data.length);
            }
          })
          .catch((err) => console.error("Error fetching assigned programs:", err));
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  const dashboardFeatures = [
    {
      icon: "📋",
      title: "My Programs",
      description: "Programs assigned to me",
      count: assignedProgramsCount,
      color: "primary",
      onClick: () => navigate("assigned-programs"),
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
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Header />

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

        <Footer />
      </div>
    </div>
  );
};

export default MentorDashboardPage;
