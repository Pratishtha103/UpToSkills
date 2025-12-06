// src/components/Company_Dashboard/Sidebar.jsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Calendar,
  LogOut,
  Building2,
  X,
  Info,
} from "lucide-react";
import { FaLinkedin, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTheme } from "../../context/ThemeContext";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "search", label: "Search Candidate", icon: Search },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "edit-profile", label: "Edit Profile", icon: Building2 },
  { id: "about-us", label: "About Us", icon: Info },
];

export default function Sidebar({ isOpen = true, setIsOpen = () => {}, onItemClick }) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  useEffect(() => {
    const checkScreen = () => {
      const desktop = typeof window !== "undefined" && window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    checkScreen();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", checkScreen);
      return () => window.removeEventListener("resize", checkScreen);
    }
  }, [setIsOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "company";
    // keep lastRole so login screen can preselect role
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } });
  };

  // IMPORTANT: this writes the desired view and navigates to /company
  const handleClick = (item) => {
    setActiveItem(item.id);

    // Save the requested view for Index.jsx to read on mount
    try {
      localStorage.setItem("company_view", item.id);
    } catch (e) {
      // ignore storage problems but log for debug
      // eslint-disable-next-line no-console
      console.warn("Could not set company_view in localStorage", e);
    }

    // Navigate to company dashboard (Index.jsx)
    navigate("/company");

    // keep compatibility with onItemClick (when already on /company)
    if (onItemClick) onItemClick(item.id);

    // close on mobile
    if (!isDesktop) setIsOpen(false);

    // small UX: if user clicked dashboard, scroll top
    if (item.id === "dashboard") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 shadow-2xl z-40 overflow-hidden border-r transition-colors duration-300 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.25 }}
      >
        {/* close button for mobile */}
        {isOpen && !isDesktop && (
          <button
            className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-300"
            onClick={toggleSidebar}
            aria-label="Close Sidebar"
          >
            <X size={22} />
          </button>
        )}

        <div className="flex flex-col h-full pt-16">
          <nav className="flex-1 pt-6 px-4">
            <div className="space-y-1">
              {sidebarItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group cursor-pointer select-none
                    ${
                      activeItem === item.id
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white dark:text-gray-900 shadow-xl" // 👈 FIXED TEXT COLOR
                        : "text-gray-700 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 dark:text-gray-300 dark:hover:from-gray-800"
                    }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03, duration: 0.25 }}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative z-10 flex items-center justify-center">
                    <item.icon
                      className={`w-6 h-6 ${
                        activeItem === item.id ? "text-white dark:text-gray-900" : "text-gray-600 dark:text-gray-300" // 👈 FIXED ICON COLOR
                      }`}
                    />
                  </div>

                  {activeItem === item.id && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}

                  <span
                    className={`font-bold relative z-10 ${
                      activeItem === item.id ? "text-white dark:text-gray-900" : "" // 👈 FIXED TEXT COLOR
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>
{/* Social Media and Logout */}
          <div className={`p-4 border-t text-center`}>
            <p className="font-semibold text-sm mb-2 text-gray-500">Connect With Us</p>
            <div className="flex justify-center gap-4 mb-3">
              <FaLinkedin
                size={22}
                className="cursor-pointer hover:text-[#0A66C2] transition"
                onClick={() =>
                  window.open("https://www.linkedin.com/company/uptoskills/posts/?feedView=all", "_blank")
                }
              />
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-[#E1306C] transition"
                onClick={() => window.open("https://www.instagram.com/uptoskills", "_blank")}
              />
              <FaYoutube
                size={22}
                className="cursor-pointer hover:text-[#FF0000] transition"
                onClick={() =>
                  window.open("https://youtube.com/@uptoskills9101?si=YvRk51dq0exU-zLv", "_blank")
                }
              />
            </div>

           <motion.button
           onClick={handleLogout}
           className={`w-full text-red-500 flex items-center justify-center gap-2 p-2 rounded-lg transition-all`}
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