import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardCard from "../components/DashboardCard";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer"
import WelcomeSection from "../components/Welcome";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";

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
      icon: "🧑‍🏫",
      title: "Projects",
      description: "Projects at a glance",
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
    // ✅ Fixed: use backticks for className interpolation
    <div
      className={`mt-14 flex min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      }`}
    >
      <Sidebar isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col">
        <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

        {/* ✅ Fixed here too */}
        <div
          className={`flex-1 p-8 ${
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
                onClick={feature.onClick}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        </div>

        <section
          id="contact-section"
          className="w-full mx-auto py-16 px-4 text-center bg-white shadow-sm"
        >
          <p className="text-orange-500 font-semibold uppercase">Our Contacts</p>
          <h2 className="text-4xl font-bold mt-2">We're here to Help You</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Got a project in mind? We’d love to hear about it. Take five minutes
            to fill out our project form so that we can get to know you and
            understand your project.
          </p>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <FaLinkedin className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Get to Know Us:</h3>
              <p className="text-gray-600">
                https://www.linkedin.com/company/uptoskills
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Phone Us 24/7:</h3>
              <p className="text-gray-600">+91 (931) 977 2294</p>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
              <FaEnvelope className="text-orange-500 mx-auto mb-4" size={40} />
              <h3 className="text-xl font-semibold mb-2">Mail Us 24/7:</h3>
              <p className="text-gray-600">info@uptoskills.com</p>
            </div>
          </div>
        </section>
        <Footer/>
      </div>
     
    </div> 
  );
};

export default MentorDashboardPage;
