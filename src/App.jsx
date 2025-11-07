import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from './pages/Landing';
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from './components/Student_Dashboard/EditProfile/EditProfilePage';
import UserProfilePage from './components/Student_Dashboard/UserProfilePage';
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects';
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
import Thankyou from './components/Programs/Thankyou';
import AboutUs from "./components/Student_Dashboard/dashboard/AboutUs";
import MyCourses from "./components/Student_Dashboard/dashboard/MyCourses";

const queryClient = new QueryClient();

function ProtectedRoute({ children }) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const location = useLocation();
  return children; 
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>

          {/* ======= Public Routes ======= */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={
            <div>
              <Header />
              <HeroSection />
              <AboutSection />
              <Footer />
              <Chatbot />
            </div>
          } />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* ======= Dashboard Routes ======= */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Student_Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/profile" element={
            <ProtectedRoute>
              <UserProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/edit-profile" element={
            <ProtectedRoute>
              <EditProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/my-projects" element={
            <ProtectedRoute>
              <MyProjects />
            </ProtectedRoute>
          } />
    <Route
  path="/dashboard/my-courses"
  element={
    <ProtectedRoute>
      <MyCourses />
    </ProtectedRoute>
  }
/>



          <Route path="/dashboard/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
            <ProtectedRoute>
              <Dashboard_Project />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/aboutus" element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } />

          {/* ======= Skill Badges ======= */}
          <Route path="/mentor-dashboard/skill-badges" element={
            <ProtectedRoute>
              <SkillBadgeForm isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/student/skill-badges" element={
            <ProtectedRoute>
              <StudentSkillBadgesPage />
            </ProtectedRoute>
          } />

          {/* ======= Company Routes ======= */}
          <Route path="/company" element={
            <ProtectedRoute>
              <CompanyDashboardHome />
            </ProtectedRoute>
          } />
          <Route path="/company-profile" element={
            <ProtectedRoute>
              <CompanyProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/company/*" element={
            <ProtectedRoute>
              <CompanyNotFound />
            </ProtectedRoute>
          } />

          {/* ======= Misc ======= */}
          <Route path="/projectShowcase" element={
            <ProtectedRoute>
              <ProjectShowcasePage />
            </ProtectedRoute>
          } />
          <Route path="/mentor-dashboard/*" element={
            <ProtectedRoute>
              <MentorDashboardRoutes />
            </ProtectedRoute>
          } />
          <Route path="/adminPanel" element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          } />
          <Route path="/programForm/:id" element={<Webdev />} />
          <Route path="/thankyou" element={<Thankyou />} />

          {/* ======= 404 ======= */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
