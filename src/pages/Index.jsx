import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Company_Dashboard/Sidebar";
import Navbar from "../components/Company_Dashboard/Navbar";
import StatCard from "../components/Company_Dashboard/StatCard";
import StudentCard from "../components/Company_Dashboard/StudentCard";
import SearchFilters from "../components/Company_Dashboard/SearchFilters";
import InterviewsSection from "../components/Company_Dashboard/InterviewsSection";
import InterviewGallery from "../components/Company_Dashboard/InterviewGallery";
import CompanyNotificationsPage from "../components/Company_Dashboard/CompanyNotificationsPage";
import SearchStudents from "../components/Company_Dashboard/SearchStudents";
import EditProfile from "../components/Company_Dashboard/EditProfile";
import AboutCompanyPage from "../components/Company_Dashboard/AboutCompanyPage";
import { motion } from "framer-motion";
import { Users, Calendar as CalIcon, Award, UserCheck } from "lucide-react";
import buisness from "../assets/buisness.jpeg";
import StudentProfileModal from "../components/Company_Dashboard/StudentProfileModal";
import ContactModal from "../components/Company_Dashboard/ContactModal";
import StatsGrid from "../components/Student_Dashboard/dashboard/StatsGrid";
import Footer from "../components/AboutPage/Footer";

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
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [totalMentors, setTotalMentors] = useState(0);
  const [totalBadges, setTotalBadges] = useState(0);
  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [showNameSuggestions, setShowNameSuggestions] = useState(false);
  const [allStudentNames, setAllStudentNames] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    name: "",
    domain: "All Domains",
    projectExperience: "All Levels",
    skillLevel: "All Skills",
  });

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactStudentId, setContactStudentId] = useState(null);
  // Interview count
  const [interviewCount, setInterviewCount] = useState(0);

  // Current user
  const rawUser =
    typeof window !== "undefined" ? localStorage.getItem("user") : null;
  let currentUserName = "Account";
  try {
    if (rawUser) {
      const u = JSON.parse(rawUser);
      currentUserName = u.full_name || u.name || u.username || currentUserName;
    }
  } catch {
    currentUserName = "Account";
  }

  // Dark mode
  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);
  const toggleDarkMode = () => setIsDarkMode((p) => !p);

  
  const suggestionPool = useMemo(() => {
    const dedupe = (items) => {
      const seen = new Set();
      const result = [];
      items.forEach((value) => {
        const name = value?.toString().trim();
        if (!name) return;
        const key = name.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          result.push(name);
        }
      });
      return result;
    };

    if (allStudentNames.length) {
      return dedupe(allStudentNames);
    }

    return dedupe(students.map((student) => student.full_name));
  }, [students, allStudentNames]);

  // ---------- Fetch Students + Mentor count ----------
  useEffect(() => {
    const fetchData = async () => {
      setLoadingStudents(true);
      try {
        const API_BASE =
          process.env.REACT_APP_API_URL || "http://localhost:5000";

        const [studentsRes, mentorRes] = await Promise.all([
          axios.get(`${API_BASE}/api/students`),
          axios.get(`${API_BASE}/api/mentors/count`),
        ]);

        const rows = Array.isArray(studentsRes.data.data)
          ? studentsRes.data.data
          : [];

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
          } catch {
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
            rating: r.rating ?? null,
            lastActive: r.last_active || "Recently active",
            ai_skill_summary: r.ai_skill_summary || r.ai_skills || "",
            created_at:
              r.created_at || r.profile_created_at || new Date().toISOString(),
            __raw: r,
          };
        });

        setStudents(formatted);
        setFilteredStudents(formatted);
        setTotalMentors(mentorRes.data.totalMentors || 0);

        // Calculate total badges
        const totalBadgesCount = formatted.reduce(
          (sum, s) => sum + (s.badges?.length || 0),
          0
        );
        setTotalBadges(totalBadgesCount);
      } catch (err) {
        console.error("Error fetching data:", err);
        setStudents([]);
        setFilteredStudents([]);
        setTotalMentors(0);
        setTotalBadges(0);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchData();
  }, []);

  // ---------- Filtering ----------
  useEffect(() => {
    let filtered = students;

    if (filters.name.trim()) {
      const q = filters.name.toLowerCase();
      filtered = filtered.filter((s) =>
        (s.full_name || "").toLowerCase().includes(q)
      );
    }

    if (filters.domain !== "All Domains") {
      filtered = filtered.filter((s) =>
        (s.domain || "").toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
  }, [filters, students]);

  useEffect(() => {
    const fetchAllStudentNames = async () => {
      try {
        const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
        const res = await axios.get(`${API_BASE}/api/students/all-students`);
        const rows = Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        const names = rows.map(
          (r) =>
            (r.full_name || r.name || r.student_name || r.profile_full_name || "")
              .toString()
              .trim()
        );
        setAllStudentNames(names.filter(Boolean));
      } catch (err) {
        console.warn("Unable to fetch student names for suggestions", err);
      }
    };

    fetchAllStudentNames();
  }, []);

  useEffect(() => {
    const query = filters.name.trim().toLowerCase();
    if (!query) {
      setNameSuggestions(suggestionPool.slice(0, 8));
      return;
    }
    setNameSuggestions(
      suggestionPool.filter((name) => name.toLowerCase().includes(query)).slice(0, 8)
    );
  }, [filters.name, suggestionPool]);

  // ---------- LocalStorage view handling ----------
  useEffect(() => {
    try {
      const view = localStorage.getItem("company_view");
      if (view && VALID_VIEWS.has(view)) {
        // Open the view directly; interviews should show the dedicated interviews page
        setCurrentView(view === "interviews" ? "interviews" : view);
      }
      localStorage.removeItem("company_view");
    } catch { }
  }, 
  
  []);
// ---------- Fetch Interviews (For Both Count + Upcoming Section) ----------
const [interviews, setInterviews] = useState([]);

const fetchInterviews = async () => {
  try {
    const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const res = await axios.get(`${API_BASE}/api/interviews`);

    if (Array.isArray(res.data)) {
      setInterviews(res.data);
      setInterviewCount(res.data.length);
    } else {
      setInterviews([]);
      setInterviewCount(0);
    }
  } catch (err) {
    console.error("Error fetching interviews:", err);
    setInterviews([]);
    setInterviewCount(0);
  }
};

useEffect(() => {
  fetchInterviews();

  // Listen for newly created interviews to refresh the list and optionally notify
  const normalizeInterview = (r) => ({
    id: r.id ?? r._id ?? r.interview_id ?? r.interviewId ?? null,
    candidate_name: r.candidate_name ?? r.candidateName ?? r.name ?? "",
    role: r.role ?? r.position ?? r.job ?? "",
    date: r.date ?? r.scheduled_date ?? r.slot_date ?? null,
    time: r.time ?? r.scheduled_time ?? r.slot_time ?? null,
    status: r.status ?? (r.state || "Scheduled"),
    raw: r.raw ?? r,
  });

  const onCreated = (e) => {
    try {
      const created = e?.detail;
      if (created) {
        const normalized = normalizeInterview(created);
        // Append only if not already present
        setInterviews((prev) => {
          if (!normalized.id) return [normalized, ...prev];
          if (prev.some((p) => p.id === normalized.id)) return prev;
          return [normalized, ...prev];
        });
        setInterviewCount((c) => c + 1);
        return;
      }
    } catch (err) {
      // fallback to refetch
    }
    // Fallback: refresh from server
    fetchInterviews();
  };

  window.addEventListener("interview:created", onCreated);
  return () => window.removeEventListener("interview:created", onCreated);
}, []);

    

  // ---------- Handlers ----------
  const toggleSidebar = () => setIsSidebarOpen((p) => !p);
  const handleSidebarClick = (v) => {
    if (!v) return;
    if (v === "interviews") {
      setCurrentView("interviews");
      return;
    }
    if (VALID_VIEWS.has(v)) {
      setCurrentView(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFilterChange = (key, value) =>
    setFilters((p) => ({ ...p, [key]: value }));
  const clearFilters = () =>
    setFilters({
      name: "",
      domain: "All Domains",
      projectExperience: "All Levels",
      skillLevel: "All Skills",
    });
  const handleNameSuggestionSelect = (value) => {
    setFilters((prev) => ({ ...prev, name: value }));
    setShowNameSuggestions(false);
  };

  const handleViewProfile = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };
  const handleContact = (id) => {
    setContactStudentId(id);
    setIsContactModalOpen(true);
  };

  // ---------- VIEWS ----------
  if (currentView === "notifications") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex-1 flex flex-col ${
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
          className={`flex-1 flex flex-col ${
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
          className={`flex-1 flex flex-col ${
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

  if (currentView === "interviews") {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div className={`flex-1 flex flex-col ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex-1 pt-16">
            <InterviewGallery />
          </main>
        </div>
      </div>
    );
  }

  if (currentView === "about-us") {
    return (
      <div className="flex min-h-screen dark:bg-gray-900">
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          onItemClick={handleSidebarClick}
        />
        <div
          className={`flex flex-col ${
            isSidebarOpen ? "lg:ml-64" : "ml-0"
          } text-gray-900 dark:text-white`}
        >
          <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
          <main className="flex flex-grow">
            <AboutCompanyPage />
          </main>
        </div>
      </div>
    );
  }

  // ---------- DASHBOARD ----------
  return (
    <div className="flex min-h-screen dark:bg-gray-900">
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        onItemClick={handleSidebarClick}
      />
      <div
        className={`flex-1 flex flex-col ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        <Navbar onMenuClick={toggleSidebar} userName={currentUserName} />
        <div className="pt-20 px-2 sm:px-4 py-6 max-w-[1400px] mx-auto w-full">
          {/* Hero */}
          {/* <motion.section
            className="hero-gradient rounded-2xl p-6 sm:p-6 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-1 items-center">
    
              <div>
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#01BDA5] via-[#43cea2] to-[#FF824C] bg-clip-text text-transparent font-extrabold">
                    UptoSkill
                  </span>{" "}
                  Hiring Dashboard
                </motion.h1>
                <motion.p
                  className="text-base sm:text-xl mb-4 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Discover talented students, schedule interviews, and build
                  your dream team with our comprehensive hiring platform.
                </motion.p>
              </div> */}
          <motion.section
            className="mb-8 p-0" 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            
            <div className="grid grid-cols-1 lg:grid-cols-3 lg:grid-flow-col-dense gap-6 items-center">
              {/* (Right Side) */}

              <div className="mt-6 lg:mt-0 lg:order-2 flex justify-center lg:justify-end self-center">
                <div className="overflow-hidden">
                  <motion.img
                    src={buisness} 
                    alt="Business Meeting & Analytics"
                    className="w-full max-w-xs sm:max-w-sm lg:max-w-[400px] object-cover rounded-xl"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  />
                </div>
              </div>

              {/* (Left Side) */}
              
              <div className="lg:col-span-2 lg:order-1 self-center">
                <motion.h1
                  className="text-3xl sm:text-4xl font-bold mb-8 text-gray-800 dark:text-white"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-[#01BDA5] via-[#43cea2] to-[#FF824C] bg-clip-text text-transparent font-extrabold">
                    UptoSkill
                  </span>{" "}
                  Hiring Dashboard
                </motion.h1>
                <motion.p
                  className="text-base sm:text-xl mb-4 text-gray-600 dark:text-gray-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Discover talented students, schedule interviews, and build
                  your dream team with our comprehensive hiring platform.
                </motion.p>
              </div>
            </div>
          </motion.section>


           <section className="mb-8">
            <motion.h2
              className="text-2xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Hiring Overview
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
              <StatCard
                title="Total Students Available"
                value={students.length}
                icon={Users}
                color="primary"
                delay={0.1}
              />
              <StatCard
                title="Interviews Scheduled"
                value={interviewCount}
                icon={CalIcon}
                color="secondary"
                delay={0.3}
              />
              <StatCard
                title="Total Mentors"
                value={totalMentors}
                icon={UserCheck}
                color="success"
                delay={0.2}
              />
              <StatCard
                title="Verified Skill Badges"
                value={totalBadges}
                icon={Award}
                color="warning"
                delay={0.4}
              />
            </div>
          </section>

          {/* Students moved to the dedicated Search page */}

          {/* Upcoming Interviews removed from dashboard - use dedicated Interviews view from sidebar */}
        </div>

        <StudentProfileModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          student={selectedStudent}
          fetchFresh
        />
        <ContactModal
          open={isContactModalOpen}
          studentId={contactStudentId}
          onClose={() => setIsContactModalOpen(false)}
        />
     
      <Footer/>
       </div>
    </div>
  );
}
