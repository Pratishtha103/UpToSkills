import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

// Correct default import (no curly braces)
import MentorDashboardPage from "../components/MentorDashboard/pages/MentorDashboardPage";
import ProjectsProgress from "../components/MentorDashboard/pages/ProjectsProgress";
import OpenSourceContributions from "../components/MentorDashboard/pages/OpenSourceContributions";
import Feedback from "../components/MentorDashboard/pages/Feedback";
import MultiStudent from "../components/MentorDashboard/pages/MultiStudent";
import MentorProfilePage from "../components/MentorDashboard/components/MentorProfilePage";
import MentorEditProfilePage from "../components/MentorDashboard/components/MentorEditProfilePage";

function MentorDashboardRoutes() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
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
          <Feedback isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        }
      />
      <Route
        path="multi-student"
        element={
          <MultiStudent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
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

export default MentorDashboardRoutes;
