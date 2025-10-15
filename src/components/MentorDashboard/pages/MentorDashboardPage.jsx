// src/components/MentorDashboard/pages/MentorDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import WelcomeSection from "../components/Welcome"; 

const MentorDashboardPage = ({ isDarkMode, setIsDarkMode }) => {
  const navigate = useNavigate();

  // State for counts
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalMentors, setTotalMentors] = useState(0);

  useEffect(() => {
    // Fetch students count
    axios
      .get("http://localhost:5000/api/students/count")
      .then((res) => setTotalStudents(res.data.totalStudents))
      .catch((err) => console.error("Error fetching students:", err));

    // Fetch mentors count
    axios
      .get("http://localhost:5000/api/mentors/count")
      .then((res) => setTotalMentors(res.data.totalMentors))
      .catch((err) => console.error("Error fetching mentors:", err));
  }, []);

  return (
    <div
      className={`mt-14 flex min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Sidebar */}
      <Sidebar isDarkMode={isDarkMode} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* Dashboard Cards */}
        <div
          className={`flex-1 p-8 ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
        >
          <WelcomeSection/>

          <div className="flex flex-wrap justify-center gap-6">
          
            <DashboardCard
              icon="🧑‍🏫"
              title="Total Mentors"
              description={`${totalMentors} mentors registered`}
              onClick={() => navigate("open-source-contributions")}
              isDarkMode={isDarkMode}
            />
            {/* <DashboardCard
              icon="📝"
              title="Feedback & Approvals"
              description="Give personalized feedback and approve submitted milestones with ease."
              onClick={() => navigate("feedback")}
              isDarkMode={isDarkMode}
            /> */}
            <DashboardCard
              icon="👥"
              title="Multi-Student View"
              description="Easily toggle between multiple students to evaluate and mentor efficiently."
              onClick={() => navigate("multi-student")}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardPage;
