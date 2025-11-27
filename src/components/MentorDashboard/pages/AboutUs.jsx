import React, { useState, useEffect } from "react";
import { BriefcaseIcon, Users, Target } from "lucide-react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope } from "react-icons/fa";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

export default function AboutUs() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");

    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  return (
    <div
      className={`mt-14 flex min-h-screen ${
        isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Sidebar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <div className="pt-20 px-2 sm:px-4 py-6 mx-auto w-full dark:text-white dark:bg-gray-900">

        {/* MAIN ABOUT CARD */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-[#01BDA5] to-[#43cea2] text-white shadow-md">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
                  About UptoSkill
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  Empowering mentors to guide, inspire, and nurture the next
                  generation of skilled professionals.
                </p>
              </div>
            </div>
            <BriefcaseIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>

          {/* Content Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Mission */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-blue-500 pl-3">
                Our Mission
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                UptoSkill connects passionate mentors with aspiring learners,
                enabling knowledge sharing, personalized guidance, and impactful
                project-based learning experiences.
              </p>

              <h3 className="mt-4 text-md font-semibold text-gray-700 dark:text-gray-200">
                What mentors can do
              </h3>
              <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
                <li>Host mentorship sessions and guide students through projects.</li>
                <li>Provide feedback on student progress and skill development.</li>
                <li>
                  Collaborate with industry professionals and enhance your mentoring profile.
                </li>
              </ul>
            </section>

            {/* Values */}
            <section>
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-green-400 pl-3">
                Values & Approach
              </h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                We value mentorship that inspires growth. UptoSkill is designed to make mentoring structured, rewarding, and effective—both for mentors and mentees.
              </p>

              <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
                <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
                  <Target className="w-4 h-4" /> Why mentors choose UptoSkill
                </h4>
                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  UptoSkill provides mentors with the tools to track student growth, host learning sessions, and make a measurable impact in shaping future professionals.
                </p>
              </div>
            </section>
          </div>

          {/* Bottom Text */}
          <div className="mt-6 border-t pt-6 text-sm text-gray-600 dark:text-gray-400">
            <p>
              At UptoSkill, we believe mentorship transforms learning. By connecting mentors and students meaningfully, we’re building a culture of continuous growth and shared success.
            </p>
          </div>

        </motion.div>

        {/* 🔥 BORDER BETWEEN ABOUT & CONTACT SECTION */}
        <div className="mt-16 border-t border-gray-300 dark:border-gray-700 pt-14"></div>

        {/* CONTACT SECTION */}
        <section className="w-full mx-auto text-center">
          <p className="text-orange-500 text-4xl font-semibold uppercase">Our Contacts</p>
          <h2 className="text-xl mt-2 dark:text-white">
            We're here to Help You
          </h2>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* Phone */}
            <a href="tel:+919319772294">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition h-full">
                <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Phone Us 24/7:</h3>
                <p className="text-gray-700 dark:text-gray-300">+91 (931) 977 2294</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:info@uptoskills.com">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition h-full">
                <FaEnvelope className="text-orange-500 mx-auto mb-4" size={40} />
                <h3 className="text-xl font-semibold mb-2 dark:text-white">Mail Us 24/7:</h3>
                <p className="text-gray-700 dark:text-gray-300">info@uptoskills.com</p>
              </div>
            </a>

          </div>
        </section>

        {/* Footer */}
        <footer className="text-center pt-12 border-t border-gray-200 dark:border-gray-800">
          <p className="text-gray-600 dark:text-gray-400">© 2024 UptoSkill. Transforming lives through mentorship.</p>
        </footer>
git
      </div>
    </div>
  );
}
