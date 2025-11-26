import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Landing from './pages/Landing';
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from './components/Student_Dashboard/EditProfile/EditProfilePage';
import UserProfilePage from './components/Student_Dashboard/UserProfilePage';
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects';
import MyPrograms from './components/Student_Dashboard/myPrograms/MyPrograms';
import SkillBadgeForm from './components/MentorDashboard/components/SkillBadges/SkillBadgeForm';
import NotificationsPage from './components/Student_Dashboard/NotificationsPage/NotificationsPage';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/Register';
import CompanyDashboardHome from "./pages/Index";
import CompanyNotFound from "./pages/NotFound";
import ContactPage from './pages/ContactPage';
import ProjectShowcasePage from './pages/ProjectShowcasePage';
import MentorDashboardRoutes from './pages/MentorDashboardRoutes';
import AdminPanel from './pages/AdminPanel';
import ProgramsPage from './pages/ProgramsPage';
import Chatbot from './components/Contact_Page/Chatbot';
import CompanyProfilePage from './components/Company_Dashboard/companyProfilePage';
import StudentSkillBadgesPage from "./components/Student_Dashboard/Skilledpage/StudentSkillBadgesPage";
import Dashboard_Project from './components/Student_Dashboard/dashboard/Dashboard_Project';

// About Page components
import Header from './components/AboutPage/Header';
import HeroSection from './components/AboutPage/HeroSection';
import AboutSection from './components/AboutPage/AboutSection';
import Footer from './components/AboutPage/Footer';

import Webdev from './components/Programs/Webdev';
import Datascience from './components/Programs/Datascience';
import Cloudcompute from './components/Programs/Cloudcompute';
import Cybersecurity from './components/Programs/Cybersecurity';
import Thankyou from './components/Programs/Thankyou';
import AboutUs from "./components/Student_Dashboard/dashboard/AboutUs";

const queryClient = new QueryClient();

// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const location = useLocation();

  if (!token) {
    return <LoginForm />;
  }
  return children;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <QueryClientProvider client={queryClient}>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />

      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />

          <Route path="/about" element={
            <>
              <Header />
              <HeroSection />
              <AboutSection />
              <Footer />
              <Chatbot />
            </>
          }/>

          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* PROGRAM ROUTES */}
          <Route path="/programForm/:id" element={<Webdev />} />
          <Route path="/data-science" element={<Datascience />} />
          <Route path="/cloud-computing" element={<Cloudcompute />} />
          <Route path="/cybersecurity" element={<Cybersecurity />} />
          <Route path="/thankyou" element={<Thankyou />} />

          {/* STUDENT PROTECTED ROUTES */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}><Student_Dashboard /></ProtectedRoute>
          }/>

          <Route path="/dashboard/profile" element={
            <ProtectedRoute allowedRoles={["student"]}><UserProfilePage /></ProtectedRoute>
          }/>

          <Route path="/dashboard/edit-profile" element={
            <ProtectedRoute allowedRoles={["student"]}><EditProfilePage /></ProtectedRoute>
          }/>

          <Route path="/dashboard/my-projects" element={
            <ProtectedRoute allowedRoles={["student"]}><MyProjects /></ProtectedRoute>
          }/>

          <Route path="/dashboard/my-programs" element={
            <ProtectedRoute allowedRoles={["student"]}><MyPrograms /></ProtectedRoute>
          }/>

          <Route path="/dashboard/notifications" element={
            <ProtectedRoute allowedRoles={["student"]}><NotificationsPage /></ProtectedRoute>
          }/>

          <Route path="/student/skill-badges" element={
            <ProtectedRoute allowedRoles={["student"]}><StudentSkillBadgesPage /></ProtectedRoute>
          }/>

          <Route path="/dashboard/projects" element={
            <ProtectedRoute allowedRoles={["student"]}><Dashboard_Project /></ProtectedRoute>
          }/>

          <Route path="/dashboard/aboutus" element={
            <ProtectedRoute allowedRoles={["student"]}><AboutUs /></ProtectedRoute>
          }/>

          {/* COMPANY PROTECTED ROUTES */}
          <Route path="/company" element={
            <ProtectedRoute allowedRoles={["company"]}><CompanyDashboardHome /></ProtectedRoute>
          }/>

          <Route path="/company-profile" element={
            <ProtectedRoute allowedRoles={["company"]}><CompanyProfilePage /></ProtectedRoute>
          }/>

          <Route path="/company/*" element={
            <ProtectedRoute allowedRoles={["company"]}><CompanyNotFound /></ProtectedRoute>
          }/>

          {/* MENTOR PROTECTED ROUTES */}
          <Route path="/mentor-dashboard/skill-badges" element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <SkillBadgeForm isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          }/>

          <Route path="/mentor-dashboard/*" element={
            <ProtectedRoute allowedRoles={["mentor"]}><MentorDashboardRoutes /></ProtectedRoute>
          }/>

          {/* ADMIN PROTECTED ROUTES */}
          <Route path="/adminPanel" element={
            <ProtectedRoute allowedRoles={["admin"]}><AdminPanel /></ProtectedRoute>
          }/>

          {/* GENERAL */}
          <Route path="/projectShowcase" element={
            <ProtectedRoute><ProjectShowcasePage /></ProtectedRoute>
          }/>

          <Route path="/unauthorized" element={<h1>403 - Unauthorized</h1>} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        </Routes>
      </Router>

    </QueryClientProvider>
  );
}

export default App;
