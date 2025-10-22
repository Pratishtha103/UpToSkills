// src/pages/Index.jsx
import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Company_Dashboard/Sidebar";
import Navbar from "../components/Company_Dashboard/Navbar";
import StatCard from "../components/Company_Dashboard/StatCard";
import StudentCard from "../components/Company_Dashboard/StudentCard";
import SearchFilters from "../components/Company_Dashboard/SearchFilters";
import InterviewsSection from "../components/Company_Dashboard/InterviewsSection";
import CompanyNotificationsPage from "../components/Company_Dashboard/CompanyNotificationsPage";
import SearchStudents from "../components/Company_Dashboard/SearchStudents";
import EditProfile from "../components/Company_Dashboard/EditProfile";
import AboutCompanyPage from "../components/Company_Dashboard/AboutCompanyPage";
import { Button } from "../components/Company_Dashboard/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  Calendar as CalIcon,
  Award,
  TrendingUp,
  UserCheck,
  Target,
} from "lucide-react";
import boy from "../assets/boy2.png";
import StudentProfileModal from "../components/Company_Dashboard/StudentProfileModal";

const VALID_VIEWS = new Set([
  "dashboard",
  "search",
  "interviews",
  "edit-profile",
  "about-us",
  "notifications",
]);

export default function Index() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState("dashboard");

  const [filters, setFilters] = useState({
    domain: "All Domains",
    projectExperience: "All Levels",
    skillLevel: "All Skills",
  });

  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- read current user name from localStorage (fallbacks) ---
  const rawUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  let currentUserName = "Account";
  try {
    if (rawUser) {
      const u = JSON.parse(rawUser);
      currentUserName = u.full_name || u.name || u.username || currentUserName;
    }
  } catch (e) {
    currentUserName = "Account";
  }

  // --- dark mode state & effect ---
  const [isDarkMode, setIsDarkMode] = useState(() => {
      // load from localStorage initially
      return localStorage.getItem("theme") === "dark";
    });
   useEffect(() => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }, [isDarkMode]);
  
    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  // ---------- Fetch students (CRA-safe) ----------
  useEffect(() => {
    const fetchStudents = async () => {
      setLoadingStudents(true);
      try {
        const API_BASE =
          process.env.REACT_APP_API_URL || "http://localhost:5000";
        // eslint-disable-next-line no-console
        console.info("[Index.jsx] Using API_BASE =", API_BASE);

        const res = await fetch(`${API_BASE}/api/students`);
        if (!res.ok)
          throw new Error(`Failed to fetch students (status ${res.status})`);

        const json = await res.json();
        const rows = Array.isArray(json.data) ? json.data : [];

        const formatted = rows.map((r) => {
          let domains = [];
          try {
            if (Array.isArray(r.domains_of_interest)) {
              domains = r.domains_of_interest;
            } else if (typeof r.domains_of_interest === "string") {
              const trimmed = r.domains_of_interest.trim();
              if (trimmed.startsWith("[")) {
                domains = JSON.parse(trimmed) || [];
              } else if (trimmed.includes(",")) {
                domains = trimmed.split(",").map((s) => s.trim());
              } else if (trimmed.length > 0) {
                domains = [trimmed];
              }
            }
          } catch (e) {
            domains = r.domains_of_interest
              ? [String(r.domains_of_interest)]
              : [];
          }

          return {
            id:
              r.id ??
              r.student_id ??
              r._id ??
              `student-${Math.random().toString(36).slice(2, 9)}`,
            full_name:
              r.full_name || r.name || r.student_name || "Unknown Student",
            domain: domains[0] || r.ai_skill_summary || "Web Development",
            skillLevel: r.skill_level || "Intermediate",
            badges: domains.slice(0, 4).length
              ? domains.slice(0, 4)
              : ["Profile"],
            location: r.location || "Unknown",
            experience: r.experience || "1 year",
            rating: r.rating ?? Math.round((4 + Math.random()) * 10) / 10,
            lastActive: r.last_active || "Recently active",
            ai_skill_summary: r.ai_skill_summary || r.ai_skills || "",
            created_at:
              r.created_at || r.profile_created_at || new Date().toISOString(),
            // preserve original raw data for debug if needed
            __raw: r,
          };
        });

        setStudents(formatted);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Error fetching students:", err);
        setStudents([]);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, []);

  // ---------- NEW: read requested view from localStorage on mount ----------
  // If Sidebar wrote localStorage.setItem('company_view', someView) then we'll
  // switch to that view after landing on /company.
  // --- IMPORTANT: if requestedView === 'interviews' we show dashboard and scroll.
  const interviewRef = useRef(null);

  useEffect(() => {
    try {
      const requestedView = localStorage.getItem("company_view");
      if (requestedView && VALID_VIEWS.has(requestedView)) {
        // If the request is 'interviews' we want to show the dashboard and scroll to interviews.
        if (requestedView === "interviews") {
          setCurrentView("dashboard");
          // small delay so DOM/layout is ready before scrolling
          setTimeout(() => {
            interviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 80);
        } else {
          setCurrentView(requestedView);
        }
      }
      // remove the flag so it doesn't persist
      localStorage.removeItem("company_view");
    } catch (e) {
      // ignore localStorage issues
      // eslint-disable-next-line no-console
      console.warn("Could not read/clear company_view from localStorage", e);
    }
    // run only once on mount
  }, []);

  // ---------- Handlers ----------
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // handleSidebarClick used when Sidebar calls onItemClick while staying on same page
  // or for compatibility; clicking in Sidebar from other pages sets localStorage + navigates
  const handleSidebarClick = (viewId) => {
    if (!viewId) return;

    // Special case: if interviews clicked, show dashboard and scroll down to interviews
    if (viewId === "interviews") {
      setCurrentView("dashboard");
      // small delay to ensure DOM updated, then scroll
      setTimeout(() => {
        interviewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 60);
      return;
    }

    if (VALID_VIEWS.has(viewId)) {
      setCurrentView(viewId);
      // scroll to top for dashboard-like views
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));
  const clearFilters = () =>
    setFilters({
      domain: "All Domains",
      projectExperience: "All Levels",
      skillLevel: "All Skills",
    });

  const handleViewProfile = (student) => {
    // Accept either the whole student object or an id
    const s =
      student && (typeof student === "object" ? student : { id: student });
    setSelectedStudent(s);
    setIsModalOpen(true);
    // eslint-disable-next-line no-console
    console.log("View profile for student:", s);
  };
  const handleContact = (studentId) =>
    // eslint-disable-next-line no-console
    console.log("Contact student:", studentId);

  // ================= VIEWS =================
  if (currentView === "notifications") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <CompanyNotificationsPage />
          </main>
        </div>
      </div>
    );
  }

  if (currentView === "search") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <SearchStudents />
          </main>
        </div>
      </div>
    );
  }

  if (currentView === "edit-profile") {
    return (
      <div className="flex min-h-screen dark:bg-gray-900 dark:text-white">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <div className="pt-20 px-2 sm:px-4 pb-6 max-w-[1400px] mx-auto">
            <EditProfile />
          </div>
        </div>
      </div>
    );
  }

  // <-- PLACE ABOUT-US VIEW RIGHT HERE (after edit-profile, before dashboard) -->
  if (currentView === "about-us") {
    return (
      <div className="flex min-h-screen darg:bg-gray-900">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex flex-col transition-all duration-300 ${isDarkMode ? "-[#0f172a] text-white" : "-[#f8fafc] text-gray-900"} ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          }`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex flex-grow">
            <AboutCompanyPage/>
          </main>
        </div>
      </div>
    );
  }
  

  // ================= DASHBOARD =================
  return (
    <div className={`flex min-h-screen transition-all duration-300 dark:bg-gray-900`}>
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onItemClick={handleSidebarClick}
      />

      <div
        className={`flex-1 flex flex-col  transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />

        {/* note: reduced horizontal padding (px-2 sm:px-4) and centered with max width */}
        <div className="pt-20 px-2 sm:px-4 py-6 max-w-[1400px] mx-auto w-full">
          {/* Hero Section */}
          <motion.section
            className={`hero-gradient rounded-2xl p-6 sm:p-6 mb-8 text-white ${
        isDarkMode ? "-[#0f172a] text-white" : "-[#f8fafc] text-gray-900"
      }`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className={`grid grid-cols-1 lg:grid-cols-3 gap-1 items-center ${
        isDarkMode ? "-[#0f172a] text-white" : "-[#f8fafc] text-gray-900"
      }`}>
              <div>
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold mb-8 select-none 
               text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#01BDA5] via-[#43cea2] to-[#FF824C] bg-clip-text text-transparent font-extrabold drop-shadow-lg">
                    UptoSkill
                  </span>{" "}
                  Hiring Dashboard
                </motion.h1>

                <motion.p
                  className="text-base sm:text-xl mb-4 select-none 
               text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Discover talented students, schedule interviews, and build
                  your dream team with our comprehensive hiring platform.
                </motion.p>

                <motion.div
                  className="flex flex-wrap gap-4"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {/* optional CTA buttons */}
                </motion.div>
              </div>

              <div className="mt-6 lg:mt-0">
                <motion.img
                  src={boy}
                  alt="Programmer"
                  className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-[340px] h-auto mx-auto drop-shadow-2xl"
                  style={{ borderRadius: "2rem" }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                />
              </div>
            </div>
          </motion.section>

          {/* Stats Section */}
          <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Hiring Overview
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 dark:text-foreground-white ">
              <StatCard
                title="Total Students Available"
                value={students.length}
                subtitle="+12% from last month"
                icon={Users}
                color="primary"
                delay={0.1}
              />
              <StatCard
                title="Interviews Scheduled"
                value="24"
                subtitle="This week"
                icon={CalIcon}
                color="secondary"
                delay={0.2}
              />
              <StatCard
                title="Mentored Students"
                value="156"
                subtitle="Active mentorships"
                icon={UserCheck}
                color="success"
                delay={0.3}
              />
              <StatCard
                title="Verified Badges"
                value="1,923"
                subtitle="Across all students"
                icon={Award}
                color="warning"
                delay={0.4}
              />
            </div>
          </section>

          {/* Student Section */}
          <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              Find the Perfect Candidate
            </motion.h2>

            <SearchFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearFilters}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {loadingStudents ? (
                <div className="col-span-full text-center py-12">
                  Loading students…
                </div>
              ) : students.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  No students found.
                </div>
              ) : (
                students.map((student, index) => (
                  <StudentCard
                    key={student.id}
                    student={student}
                    onViewProfile={handleViewProfile}
                    onContact={handleContact}
                    delay={index * 0.06}
                  />
                ))
              )}
            </div>
          </section>

          {/* Interviews Section (this is the scroll target) */}
          <section ref={interviewRef} className="mb-8">
            <InterviewsSection />
          </section>
        </div>

        {/* Student Profile Modal */}
        <StudentProfileModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          fetchFresh={true}
        />
      </div>
    </div>
  );
}
