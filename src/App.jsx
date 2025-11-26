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
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects';;
import MyPrograms from './components/Student_Dashboard/dashboard/MyPrograms';

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

<<<<<<< HEAD
// Programs
=======
>>>>>>> 311c96466f0b04f47a6d8de732c3128a3678ac8a
import Webdev from './components/Programs/Webdev';
import Cloudcompute from './components/Programs/Cloudcompute';
import Cybersecurity from './components/Programs/Cybersecurity';
import Thankyou from './components/Programs/Thankyou';
import AboutUs from "./components/Student_Dashboard/dashboard/AboutUs";

const queryClient = new QueryClient();

<<<<<<< HEAD
// Protected Route Wrapper
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <LoginForm />;
  return children;
}

=======
>>>>>>> 311c96466f0b04f47a6d8de732c3128a3678ac8a
function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  return (
    <QueryClientProvider client={queryClient}>

      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />

      <Router>
        <Routes>

<<<<<<< HEAD
          {/* Public */}
          <Route path="/" element={<Landing />} />

          {/* Mentor Dashboard */}
          <Route
            path="/mentor-dashboard/*"
            element={
              <ProtectedRoute>
                <MentorDashboardRoutes
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              </ProtectedRoute>
            }
          />

          {/* Skill Badge Form */}
          <Route
            path="/mentor-dashboard/skill-badges"
            element={
              <ProtectedRoute>
                <SkillBadgeForm
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard */}
          <Route path="/dashboard" element={<ProtectedRoute><Student_Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/my-projects" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />
          <Route path="/dashboard/my-programs" element={<ProtectedRoute><MyPrograms /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/dashboard/projects" element={<ProtectedRoute><Dashboard_Project /></ProtectedRoute>} />
          <Route path="/dashboard/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />

          {/* Company */}
          <Route path="/company" element={<ProtectedRoute><CompanyDashboardHome /></ProtectedRoute>} />
          <Route path="/company-profile" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
          <Route path="/company/*" element={<ProtectedRoute><CompanyNotFound /></ProtectedRoute>} />

          {/* Misc */}
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/projectShowcase" element={<ProtectedRoute><ProjectShowcasePage /></ProtectedRoute>} />
          <Route path="/adminPanel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/adminPanel/testimonials" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* Programs */}
          <Route path="/programForm/:id" element={<Webdev />} />
=======
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
>>>>>>> 311c96466f0b04f47a6d8de732c3128a3678ac8a
          <Route path="/cloud-computing" element={<Cloudcompute />} />
          <Route path="/cybersecurity" element={<Cybersecurity />} />
          <Route path="/thankyou" element={<Thankyou />} />

<<<<<<< HEAD
=======
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
>>>>>>> 311c96466f0b04f47a6d8de732c3128a3678ac8a
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        </Routes>
      </Router>

    </QueryClientProvider>
  );
}

export default App;
