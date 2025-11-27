import React from "react";
import { Routes, Route } from "react-router-dom";

// Pages
import MentorDashboardPage from "../pages/MentorDashboardPage";
import ProjectsProgress from "../pages/ProjectsProgress";
import OpenSourceContributions from "../pages/OpenSourceContributions";
import Feedback from "../pages/Feedback";
import MultiStudent from "../pages/MultiStudent";
import MentorProfilePage from "../components/MentorProfilePage";
import MentorEditProfilePage from "./MentorEditProfilePage";


export default function MentorDashboardRoutes() {
  return (
    <Routes>
      <Route index element={<MentorDashboardPage />} />
      <Route path="projects-progress" element={<ProjectsProgress />} />
      <Route path="open-source-contributions" element={<OpenSourceContributions />} />
      <Route path="feedback" element={<Feedback />} />
      <Route path="multi-student" element={<MultiStudent />} />
      <Route path="profile" element={<MentorProfilePage />} />
      <Route path="edit-profile" element={<MentorEditProfilePage/>} />
    </Routes>
  );
}
