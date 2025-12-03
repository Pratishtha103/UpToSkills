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

  // ✅ Dark Mode State kept at the layout level
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  return (
    <Routes>
      <Route
        index
        element={
          <MentorDashboardPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      <Route
        path="projects-progress"
        element={
          <ProjectsProgress
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      <Route
        path="open-source-contributions"
        element={
          <OpenSourceContributions
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      <Route
        path="feedback"
        element={
          <Feedback
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      <Route
        path="multi-student"
        element={
          <MultiStudent
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

      <Route
        path="profile"
        element={
          <MentorProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

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
