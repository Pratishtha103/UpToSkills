import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
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
import ForgotPassword from "./pages/ForgotPassword";
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
function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={
              <Landing />
          } />
          <Route path="/about" element={
           
              <div>
                <Header />
                <HeroSection />
                <AboutSection />
                <Footer />
                <Chatbot />
              </div>
            
          } />

          <Route path="/programs" element={
           
              <ProgramsPage />
            
          } />

          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={["student"]}>
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
          <Route path="/mentor-dashboard/skill-badges" element={
            <ProtectedRoute>
              <SkillBadgeForm isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} toggleDarkMode={toggleDarkMode} />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/notifications" element={
            <ProtectedRoute>
              <NotificationsPage />
            </ProtectedRoute>
          } />
          <Route path="/student/skill-badges" element={
            <ProtectedRoute>
              <StudentSkillBadgesPage />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
            <ProtectedRoute>
              <Dashboard_Project />
            </ProtectedRoute>
          } />

          {/* keep login/register public so users can authenticate */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login/forgot-password" element={<ForgotPassword />} />

<Route caseSensitive path="/company" element={
  <ProtectedRoute allowedRoles={["company"]}>
    <CompanyDashboardHome />
  </ProtectedRoute>
} />

<Route caseSensitive path="/company-profile" element={
  <ProtectedRoute allowedRoles={["company"]}>
    <CompanyProfilePage />
  </ProtectedRoute>
} />

<Route caseSensitive path="/company/*" element={
  <ProtectedRoute allowedRoles={["company"]}>
    <CompanyNotFound />
  </ProtectedRoute>
} />


          <Route path="*" element={
        
            <ProtectedRoute>
              <h1>404 - Page Not Found</h1>
            </ProtectedRoute>
          } />

          <Route path="/contact" element={
          
              <ContactPage />
            
          } />

          <Route path="/projectShowcase" element={
            <ProtectedRoute>
              <ProjectShowcasePage />
            </ProtectedRoute>
          } />

          {/* Unauthorized page for role-mismatch redirects */}
          <Route path="/unauthorized" element={<h1>403 - Unauthorized</h1>} />

          <Route path="/mentor-dashboard/*" element={
            <ProtectedRoute allowedRoles={["mentor"]}>
              <MentorDashboardRoutes />
            </ProtectedRoute>
          } />
          
          <Route path ="/adminPanel" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </ProtectedRoute>
          } />

          <Route path='/programForm/:id' element={
            
              <Webdev />
            
          } />
          <Route path='/data-science' element={
           
              <Datascience />
            
          } />
          <Route path='/cloud-computing' element={
           
              <Cloudcompute />
           
          } />
          <Route path='/cybersecurity' element={
           
              <Cybersecurity />
          } />
          <Route path='/thankyou' element={
              <Thankyou />
          } />
          <Route path="/dashboard/aboutus" element={
            <ProtectedRoute>
              <AboutUs />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}
export default App;    