import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

// Pages / Components
import Landing from './pages/Landing';
import LoginForm from './pages/Login';
import RegistrationForm from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ContactPage from './pages/ContactPage';
import ProgramsPage from './pages/ProgramsPage';
import ProjectShowcasePage from './pages/ProjectShowcasePage';

// Student Dashboard
import Student_Dashboard from "./pages/Student_Dashboard";
import EditProfilePage from './components/Student_Dashboard/EditProfile/EditProfilePage';
import UserProfilePage from './components/Student_Dashboard/UserProfilePage';
import MyProjects from './components/Student_Dashboard/myProjects/MyProjects';
import MyPrograms from './components/Student_Dashboard/dashboard/MyPrograms';
import NotificationsPage from './components/Student_Dashboard/NotificationsPage/NotificationsPage';
import Dashboard_Project from './components/Student_Dashboard/dashboard/Dashboard_Project';
import AboutUs from "./components/Student_Dashboard/dashboard/AboutUs";
import StudentSkillBadgesPage from "./components/Student_Dashboard/Skilledpage/StudentSkillBadgesPage";

// Mentor Dashboard
import MentorDashboardRoutes from './pages/MentorDashboardRoutes';
import SkillBadgeForm from './components/MentorDashboard/components/SkillBadges/SkillBadgeForm';

// Company Dashboard
import CompanyDashboardHome from "./pages/Index";
import CompanyProfilePage from "./components/Company_Dashboard/companyProfilePage";
import CompanyNotFound from "./pages/NotFound";

// Admin
import AdminPanel from './pages/AdminPanel';

// Programs
import Webdev from './components/Programs/Webdev';
import Cloudcompute from './components/Programs/Cloudcompute';
import Cybersecurity from './components/Programs/Cybersecurity';
import Thankyou from './components/Programs/Thankyou';

// About Page
import Header from './components/AboutPage/Header';
import HeroSection from './components/AboutPage/HeroSection';
import AboutSection from './components/AboutPage/AboutSection';
import Footer from './components/AboutPage/Footer';
import Chatbot from './components/Contact_Page/Chatbot';

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
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer position="top-right" autoClose={3000} pauseOnHover theme="light" />
      <Router>
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<Landing />} />

          <Route
            path="/about"
            element={
              <>
                <Header />
                <HeroSection />
                <AboutSection />
                <Footer />
                <Chatbot />
              </>
            }
          />

          <Route path="/programs" element={<ProgramsPage />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/contact" element={<ContactPage />} />

<<<<<<< HEAD
          {/* Program Routes */}
=======
          {/* ===== Dashboard Routes ===== */}
          <Route path="/dashboard" element={<ProtectedRoute><Student_Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/edit-profile" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
          <Route path="/dashboard/my-programs" element={<ProtectedRoute><MyPrograms /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
          <Route path="/dashboard/aboutus" element={<ProtectedRoute><AboutUs /></ProtectedRoute>} />
{/* ===== Add Project (Project Submission Form) ===== */}
<Route path="/dashboard/add-project" element={<ProtectedRoute><MyProjects /></ProtectedRoute>} />

{/* ===== My Projects (Student’s submitted projects) ===== */}
<Route path="/dashboard/my-projects" element={<ProtectedRoute><ProjectShowcasePage /></ProtectedRoute>} />



          {/* ===== Skill Badges ===== */}
          <Route path="/mentor-dashboard/skill-badges" element={<ProtectedRoute><SkillBadgeForm /></ProtectedRoute>} />
          <Route path="/student/skill-badges" element={<ProtectedRoute><StudentSkillBadgesPage /></ProtectedRoute>} />

          {/* ===== Company Routes ===== */}
          <Route path="/company" element={<ProtectedRoute><CompanyDashboardHome /></ProtectedRoute>} />
          <Route path="/company-profile" element={<ProtectedRoute><CompanyProfilePage /></ProtectedRoute>} />
          <Route path="/company/*" element={<ProtectedRoute><CompanyNotFound /></ProtectedRoute>} />

          {/* ===== Misc Routes ===== */}
          
           <Route path="/project-showcase" element={<ProtectedRoute><Dashboard_Project view = "student" /></ProtectedRoute>} />
          <Route path="/mentor-dashboard/project-showcase" element={<ProtectedRoute><Dashboard_Project view = "mentor" /></ProtectedRoute>} />
          <Route path="/mentor-dashboard/*" element={<ProtectedRoute><MentorDashboardRoutes /></ProtectedRoute>} />
          <Route path="/adminPanel" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
          <Route path="/adminPanel/testimonials" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* ===== Program Forms ===== */}
>>>>>>> 7bbe882 (updation of student-dashbord)
          <Route path="/programForm/:id" element={<Webdev />} />
          <Route path="/cloud-computing" element={<Cloudcompute />} />
          <Route path="/cybersecurity" element={<Cybersecurity />} />
          <Route path="/thankyou" element={<Thankyou />} />

          {/* -------------------- STUDENT ROUTES -------------------- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Student_Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/edit-profile"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <EditProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-projects"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyProjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-programs"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyPrograms />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/student/skill-badges"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentSkillBadgesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/projects"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <Dashboard_Project />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/aboutus"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AboutUs />
              </ProtectedRoute>
            }
          />

          {/* -------------------- MENTOR ROUTES -------------------- */}
          <Route
            path="/mentor-dashboard/skill-badges"
            element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <SkillBadgeForm isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mentor-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["mentor"]}>
                <MentorDashboardRoutes />
              </ProtectedRoute>
            }
          />

          {/* -------------------- COMPANY ROUTES -------------------- */}
          <Route
            path="/company"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyDashboardHome />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company-profile"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/company/*"
            element={
              <ProtectedRoute allowedRoles={["company"]}>
                <CompanyNotFound />
              </ProtectedRoute>
            }
          />

          {/* -------------------- ADMIN ROUTES -------------------- */}
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* -------------------- GENERAL PROTECTED -------------------- */}
          <Route
            path="/projectShowcase"
            element={
              <ProtectedRoute>
                <ProjectShowcasePage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="/unauthorized" element={<h1>403 - Unauthorized</h1>} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
