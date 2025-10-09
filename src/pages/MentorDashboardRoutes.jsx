import React from "react";
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
  return (
    <Routes>
      <Route index element={<MentorDashboardPage />} />
      <Route path="projects-progress" element={<ProjectsProgress />} />
      <Route path="open-source-contributions" element={<OpenSourceContributions />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="multi-student" element={<MultiStudent />} />
       <Route path="profile" element={<MentorProfilePage/>} /> 
       <Route path="edit-profile" element={<MentorEditProfilePage/>} />
    </Routes>
  );
}

export default MentorDashboardRoutes;
