// src/components/MentorDashboard/pages/MentorDashboardPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Components
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

const MentorDashboardPage = () => {
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
    <div className="mt-4 flex ">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Dashboard Cards */}
        <div className="flex-1 p-8 bg-gray-50 pt-20">
          <h1 className="text-4xl font-bold mb-8 text-center">Mentor Dashboard</h1>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          <DashboardCard
            icon=""
            title="Total Students"
            description=" "
            onClick={() => navigate("projects-progress")}
          />
          <DashboardCard
            icon=""
            title="Total Mentors"
            description=" "
            onClick={() => navigate("open-source-contributions")}
          />
          
        </div>
      </div>
    </div>
  );
};

export default MentorDashboardPage;
