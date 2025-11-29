import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages & Components
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
import ForgotPassword from './pages/ForgotPassword';
import Chatbot from './components/Contact_Page/Chatbot';
import CompanyProfilePage from './components/Company_Dashboard/companyProfilePage';
import StudentSkillBadgesPage from "./components/Student_Dashboard/Skilledpage/StudentSkillBadgesPage";
import Dashboard_Project from './components/Student_Dashboard/dashboard/Dashboard_Project';
// About Page components
import Header from './components/AboutPage/Header';
import HeroSection from './components/AboutPage/HeroSection';
import AboutSection from './components/AboutPage/AboutSection';


// Program Components
import Webdev from './components/Programs/Webdev';
import Datascience from './components/Programs/Datascience';
import Cloudcompute from './components/Programs/Cloudcompute';
import Cybersecurity from './components/Programs/Cybersecurity';
import Thankyou from './components/Programs/Thankyou';

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

      {/* 🔥 Toast Container (you must add this!) */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        pauseOnHover
        theme="light"
      />
      <Router>
        <Routes>

          {/* ===== Public Routes ===== */}
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={
            <>
              <Header />
              <HeroSection />
              <AboutSection />
              <footer
                className="w-full  text-gray-100 bg-gray-700 border-t border-gray-300 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300 "
              >
                <p>© 2025 Uptoskills. Built by learners.</p>

              </footer>
              <Chatbot />
            </>
          } />
          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/forgot-password" element={<ForgotPassword/>}/>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/contact" element={<ContactPage />} />


          {/* PROGRAM ROUTES */}
          <Route path="/programForm/:id" element={<Webdev />} />
          {/* <Route path="/data-science" element={<Datascience />} /> */}
          <Route path="/cloud-computing" element={<Cloudcompute />} />
          <Route path="/cybersecurity" element={<Cybersecurity />} />
          <Route path="/thankyou" element={<Thankyou />} />

          {/* ===== 404 ===== */}
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
