import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import MentorDashboardPage from "../pages/MentorDashboardPage";
import ProjectsProgress from "../pages/ProjectsProgress";
import OpenSourceContributions from "../pages/OpenSourceContributions";
import Feedback from "../pages/Feedback";
import MultiStudent from "../pages/MultiStudent";
import MentorProfilePage from "../components/MentorProfilePage";
import MentorEditProfilePage from "./MentorEditProfilePage";

export default function MentorDashboardRoutes() {

  /* ---------------------------------------------------------
     🌙 DARK MODE STATE  
     - Stored at the route/layout level
     - Passed to all pages so theme stays consistent
  --------------------------------------------------------- */
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  return (
    <Routes>
      {/* -----------------------------------------------
          🏠 Main Mentor Dashboard (Default Landing Page)
      ----------------------------------------------- */}
      <Route
        index
        element={
          <MentorDashboardPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          📊 Projects Progress Page
      ----------------------------------------------- */}
      <Route
        path="projects-progress"
        element={
          <ProjectsProgress
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          🌐 Open Source Contributions Page
      ----------------------------------------------- */}
      <Route
        path="open-source-contributions"
        element={
          <OpenSourceContributions
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          📝 Feedback Page
      ----------------------------------------------- */}
      <Route
        path="feedback"
        element={
          <Feedback
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          👥 Multi-Student Management Page
      ----------------------------------------------- */}
      <Route
        path="multi-student"
        element={
          <MultiStudent
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          👤 Mentor Profile Page
      ----------------------------------------------- */}
      <Route
        path="profile"
        element={
          <MentorProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      {/* -----------------------------------------------
          ✏️ Edit Mentor Profile Page
      ----------------------------------------------- */}
      <Route
        path="edit-profile"
        element={
          <MentorEditProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />
    </Routes>
  );
}
