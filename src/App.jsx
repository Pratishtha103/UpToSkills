import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Landing from './pages/Landing';
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from './components/Student_Dashboard/EditProfile/EditProfilePage';
import UserProfilePage from './components/Student_Dashboard/UserProfilePage';
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects';
import SkillBadgeForm from './components/Student_Dashboard/SkillBadges/SkillBadgeForm';
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

// About Page components
import Header from './components/AboutPage/Header';
import HeroSection from './components/AboutPage/HeroSection';
import AboutSection from './components/AboutPage/AboutSection';
import Footer from './components/AboutPage/Footer';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* ===== Landing Page ===== */}
          <Route path="/" element={<Landing />} />

          {/* =====About Page Routes ===== */}
          <Route path="/about" element={
            <div>
              <Header />
              <HeroSection />
              <AboutSection />
              <Footer />
              <Chatbot />
            </div>
          } />

          {/* ===== Programs Page Routes ===== */}
          <Route path="/programs" element={<ProgramsPage />} />

          {/* =====  Student Dashboard Routes  ===== */}
          <Route path="/dashboard" element={<Student_Dashboard />} />
          <Route path="/dashboard/profile" element={<UserProfilePage />} />
          <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
          <Route path="/dashboard/my-projects" element={<MyProjects />} />
          <Route path="/dashboard/skill-badges" element={<SkillBadgeForm />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />

          {/* ===== Company Dashboard Routes ===== */}
          <Route path="/company" element={<CompanyDashboardHome />} />

          {/* ===== Catch-All Routes ===== */}
          <Route path="/company/*" element={<CompanyNotFound />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

          {/* ===== Contact Page Routes ===== */}
          <Route path="/contact" element={<ContactPage />} />

          {/* ===== Project Showcase Page Routes ===== */}
          <Route path="/projectShowcase" element={<ProjectShowcasePage/>} />

          {/* ===== Mentor Dashboard Page routes ===== */}
          <Route path="/mentor-dashboard/*" element={<MentorDashboardRoutes />} />

          {/* ===== Admin Panel page routes ===== */}
          <Route path ="/adminPanel" element={<AdminPanel />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
