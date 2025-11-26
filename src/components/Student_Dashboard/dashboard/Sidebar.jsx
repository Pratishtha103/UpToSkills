import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  LogOut,
  X,
  ViewIcon,
  Book,
  Info,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTrophy,
} from "react-icons/fa";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { id: "profile", label: "Edit Profile", icon: User, path: "/dashboard/edit-profile" },
  { id: "projects", label: "Add Project", icon: FolderOpen, path: "/dashboard/my-projects" },
  { id: "viewproject", label: "My Projects", icon: ViewIcon, path: "/projectShowcase" },
  { id: "skillBadges", label: "Skill Badges", icon: FaTrophy, path: "/student/skill-badges" },
  { id: "projectShowcase", label: "Project Showcase", icon: Book, path: "/dashboard/projects" },
  { id: "myprograms", label: "My Programs", icon: GraduationCap, path: "/dashboard/my-programs" },
  { id: "aboutUs", label: "About Us", icon: Info, path: "/dashboard/aboutus" },
];

export default function Sidebar({ isOpen = false, setIsOpen = () => {} }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState("dashboard");
const [isDesktop, setIsDesktop] = useState(false);

// ROLE CHECK — only show sidebar for students
const user = JSON.parse(localStorage.getItem("user"));
const role = user?.role?.toLowerCase();

if (role !== "student") {
  return null; // hide sidebar for others
}


  useEffect(() => {
  // remove trailing slash
  const cleanPath = location.pathname.replace(/\/+$/, "").toLowerCase();

  const currentItem = sidebarItems.find(item =>
    cleanPath === item.path.replace(/\/+$/, "").toLowerCase()
  );

  if (currentItem) setActiveItem(currentItem.id);
}, [location.pathname]);

  useEffect(() => {
    const checkScreen = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [setIsOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "student";
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } });
  };

  const handleItemClick = (item) => {
    setActiveItem(item.id); 
    navigate(item.path); 
    if (!isDesktop) setIsOpen(false);
  };

  return (
    <>
  
      <AnimatePresence>
        {!isDesktop && isOpen && (
          <motion.div
            key="overlay"
            className="fixed inset-0 bg-black/50 z-40"
            onClick={toggleSidebar}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-2xl z-50 overflow-hidden transition-colors duration-300"
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.3 }}
      >
        
        <AnimatePresence>
          {isOpen && !isDesktop && (
            <motion.button
              key="close-btn"
              className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100"
              onClick={toggleSidebar}
              aria-label="Close Sidebar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col h-full pt-16">
          {/* Navigation */}
          <nav className="flex-1 pt-6 px-4">
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleItemClick(item)} 
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden group cursor-pointer select-none ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={{ x: 8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon
                    className={`w-6 h-6 transition-all duration-200 ${
                      activeItem === item.id
                        ? "text-white"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  />
                  <span
                    className={`font-semibold transition-all ${
                      activeItem === item.id
                        ? "text-white tracking-wide"
                        : "text-gray-700 dark:text-gray-200"
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t">
            <p className="font-semibold text-sm mb-2 text-center text-gray-500">
              Connect With Us
            </p>
            <div className="flex justify-center gap-4 mb-3">
              <FaLinkedin
                size={22}
                className="cursor-pointer hover:text-[#0A66C2] transition"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/company/uptoskills/posts/?feedView=all",
                    "_blank"
                  )
                }
              />
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-[#E1306C] transition"
                onClick={() =>
                  window.open("https://www.instagram.com/uptoskills", "_blank")
                }
              />
              <FaYoutube
                size={22}
                className="cursor-pointer hover:text-[#FF0000] transition"
                onClick={() =>
                  window.open(
                    "https://youtube.com/@uptoskills9101?si=YvRk51dq0exU-zLv",
                    "_blank"
                  )
                }
              />
            </div>

            <motion.button
              onClick={handleLogout}
              className="w-full text-red-500 flex items-center justify-center gap-2 p-2 rounded-lg transition-all"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
