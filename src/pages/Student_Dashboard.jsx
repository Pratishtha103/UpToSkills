import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, BookOpen, Award, TrendingUp, Calendar, Target } from 'lucide-react';
import Sidebar from '../components/Student_Dashboard/dashboard/Sidebar';
import Header from '../components/Student_Dashboard/dashboard/Header';
import WelcomeSection from '../components/Student_Dashboard/dashboard/WelcomeSection';
import StatsGrid from '../components/Student_Dashboard/dashboard/StatsGrid';
import NoticeBoard from '../components/Student_Dashboard/dashboard/NoticeBoard';
import ChartSection from '../components/Student_Dashboard/dashboard/ChartSection';
import AssignmentsSection from '../components/Student_Dashboard/dashboard/AssignmentsSection';
import BottomProfileMessages from '../components/Student_Dashboard/dashboard/BottomProfileMessages';

const StudentDashboard = () => {
  const [isSidebarVisible, setSidebarVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      setSidebarVisible(!mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => setSidebarVisible(!isSidebarVisible);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarVisible ? "lg:ml-64" : "ml-0"
      }`}>
        <Header onMenuClick={toggleSidebar} />
        
        <div className="pt-24 px-4 sm:px-6 py-6">
          <WelcomeSection />
          <StatsGrid />
          <NoticeBoard />
          <ChartSection />
          <AssignmentsSection />
          <BottomProfileMessages />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
