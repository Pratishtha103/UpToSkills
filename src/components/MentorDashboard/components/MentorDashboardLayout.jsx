// src/components/MentorDashboard/components/MentorDashboardLayouts.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Correct default import (no curly braces)
import MentorDashboardPage from "../pages/MentorDashboardPage";
import ProjectsProgress from "../pages/ProjectsProgress";
import OpenSourceContributions from "../pages/OpenSourceContributions";
import Feedback from "../pages/Feedback";
import MultiStudent from "../pages/MultiStudent";

function MentorDashboardRoutes() {
  return (
    <Routes>
      <Route index element={<MentorDashboardPage />} />
      <Route path="projects-progress" element={<ProjectsProgress />} />
      <Route path="open-source-contributions" element={<OpenSourceContributions />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="multi-student" element={<MultiStudent />} />
    </Routes>
  );
}

export default MentorDashboardRoutes;
