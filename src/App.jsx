import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

const queryClient = new QueryClient();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
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

          <Route path="/dashboard" element={<Student_Dashboard />} />
          <Route path="/dashboard/profile" element={<UserProfilePage />} />
          <Route path="/dashboard/edit-profile" element={<EditProfilePage />} />
          <Route path="/dashboard/my-projects" element={<MyProjects />} />
          <Route path="/mentor-dashboard/skill-badges" element={<SkillBadgeForm isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
          <Route path="/dashboard/notifications" element={<NotificationsPage />} />

          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegistrationForm />} />

          <Route path="/company" element={<CompanyDashboardHome />} />
          <Route path="/company-profile" element={<CompanyProfilePage />} />

          <Route path="/company/*" element={<CompanyNotFound />} />
          <Route path="*" element={<h1>404 - Page Not Found</h1>} />

          <Route path="/contact" element={<ContactPage />} />

          <Route path="/projectShowcase" element={<ProjectShowcasePage/>} />

          <Route path="/mentor-dashboard/*" element={<MentorDashboardRoutes />} />
          
          <Route path ="/adminPanel" element={<AdminPanel />} />

          <Route path='/web-dev' element={<Webdev/>}/>
          <Route path='/data-science' element={<Datascience/>}/>
          <Route path='/cloud-computing' element={<Cloudcompute/>}/>
          <Route path='/cybersecurity' element={<Cybersecurity/>}/>
          <Route path='/thankyou' element={<Thankyou/>}/>

        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
