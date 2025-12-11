// Importing  modules and components
import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Importing all pages used inside Mentor Dashboard routes
import MentorDashboardPage from "../pages/MentorDashboardPage";
import ProjectsProgress from "../pages/ProjectsProgress";
import OpenSourceContributions from "../pages/OpenSourceContributions";
import Feedback from "../pages/Feedback";
import MultiStudent from "../pages/MultiStudent";
import MentorProfilePage from "../components/MentorProfilePage";
import MentorEditProfilePage from "./MentorEditProfilePage";

// Main component that handles all mentor dashboard routes
export default function MentorDashboardRoutes() {

<<<<<<< Updated upstream
  /* ---------------------------------------------------------
     🌙 DARK MODE STATE  
     - Stored at the route/layout level
     - Passed to all pages so theme stays consistent
  --------------------------------------------------------- */
=======
  //  Creating a dark mode state at the top level of the dashboard.
  // It first checks localStorage to keep the theme consistent even after refresh
>>>>>>> Stashed changes
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  
  return (
     // All mentor dashboard routes are wrapped inside <Routes>
    <Routes>
<<<<<<< Updated upstream
      {/* -----------------------------------------------
          🏠 Main Mentor Dashboard (Default Landing Page)
      ----------------------------------------------- */}
=======

       {/* Default route — loads when visiting mentor dashboard */}
>>>>>>> Stashed changes
      <Route
        index
        element={
          <MentorDashboardPage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          📊 Projects Progress Page
      ----------------------------------------------- */}
=======
 {/* Route for Projects Progress page */}
>>>>>>> Stashed changes
      <Route
        path="projects-progress"
        element={
          <ProjectsProgress
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          🌐 Open Source Contributions Page
      ----------------------------------------------- */}
=======
{/* Route for Open Source Contributions page */}
>>>>>>> Stashed changes
      <Route
        path="open-source-contributions"
        element={
          <OpenSourceContributions
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          📝 Feedback Page
      ----------------------------------------------- */}
=======
   {/* Route for mentor feedback page */}
>>>>>>> Stashed changes
      <Route
        path="feedback"
        element={
          <Feedback
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          👥 Multi-Student Management Page
      ----------------------------------------------- */}
=======
{/* Route for Multi-student view */}
>>>>>>> Stashed changes
      <Route
        path="multi-student"
        element={
          <MultiStudent
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          👤 Mentor Profile Page
      ----------------------------------------------- */}
=======
     {/* Route for mentor profile page */}
>>>>>>> Stashed changes
      <Route
        path="profile"
        element={
          <MentorProfilePage
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
          />
        }
      />

<<<<<<< Updated upstream
      {/* -----------------------------------------------
          ✏️ Edit Mentor Profile Page
      ----------------------------------------------- */}
=======
{/* Route for editing mentor profile */}
>>>>>>> Stashed changes
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
