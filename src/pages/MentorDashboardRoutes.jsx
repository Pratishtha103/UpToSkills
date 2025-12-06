import React from "react";
import { Routes, Route } from "react-router-dom";

import MentorDashboardPage from "../components/MentorDashboard/pages/MentorDashboardPage";
import ProjectsProgress from "../components/MentorDashboard/pages/ProjectsProgress";
import OpenSourceContributions from "../components/MentorDashboard/pages/OpenSourceContributions";
import MultiStudent from "../components/MentorDashboard/pages/MultiStudent";
import MentorProfilePage from "../components/MentorDashboard/components/MentorProfilePage";
import MentorEditProfilePage from "../components/MentorDashboard/components/MentorEditProfilePage";
import AboutUs from "../components/MentorDashboard/pages/AboutUs";
import AssignedPrograms from "../components/MentorDashboard/pages/AssignedPrograms";
import { useTheme } from "../context/ThemeContext";

function MentorDashboardRoutes() {
  const { darkMode: isDarkMode, toggleDarkMode: setIsDarkMode } = useTheme();
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

      <Route path="AboutUs" element={<AboutUs />} />

      <Route
        path="assigned-programs"
        element={
          <AssignedPrograms
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />
    </Routes>
  );
}

export default MentorDashboardRoutes;
