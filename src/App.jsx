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

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <Router>
          <Routes>

            {/* Landing */}
            <Route path="/" element={<Landing />} />

            {/* About */}
            <Route path="/about" element={
              <div>
                <Header />
                <HeroSection />
                <AboutSection />
                <Footer />
                <Chatbot />
              </div>
            } />

            {/* Programs */}
            <Route path="/programs" element={<ProgramsPage />} />

            {/* Student Dashboard */}
            <Route path="/dashboard" element={<Student_Dashboard />} />
            <Route path="/dashboard/profile" element={<UserProfilePage />} />
            <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
            <Route path="/dashboard/my-projects" element={<MyProjects />} />
            <Route path="/dashboard/skill-badges" element={<SkillBadgeForm />} />
            <Route path="/dashboard/notifications" element={<NotificationsPage />} />

            {/* Auth */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />

            {/* Company */}
            <Route path="/company" element={<CompanyDashboardHome />} />
            <Route path="/company/*" element={<CompanyNotFound />} />

            {/* Contact */}
            <Route path="/contact" element={<ContactPage />} />

            {/* Project Showcase */}
            <Route path="/projectShowcase" element={<ProjectShowcasePage />} />

            {/* Mentor Dashboard */}
            <Route path="/mentor-dashboard/*" element={<MentorDashboardRoutes />} />

            {/* Admin Panel */}
            <Route path="/adminPanel" element={<AdminPanel />} />

            {/* Fallback 404 */}
            <Route path="*" element={<h1 className="text-center mt-20">404 - Page Not Found</h1>} />

          </Routes>
        </Router>
      </div>
    </QueryClientProvider>
  );
}

export default App;
