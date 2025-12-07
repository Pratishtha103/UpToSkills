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

<<<<<<< Updated upstream
export default function Sidebar({ isOpen = true, setIsOpen = () => {}, onItemClick, isDarkMode }) {
=======
export default function Sidebar({ isOpen = true, setIsOpen = () => {}, onItemClick ,isDarkMode}) {
>>>>>>> Stashed changes
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  // Detect screen size
  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop) setIsOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [setIsOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "company";
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } });
  };

  const handleClick = (item) => {
    setActiveItem(item.id);
    localStorage.setItem("company_view", item.id);
    navigate("/company");
    if (onItemClick) onItemClick(item.id);
    if (!isDesktop) setIsOpen(false);
    if (item.id === "dashboard") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 🎨 Dynamic theme styles
  const bgColor = isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";

  const itemTextColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"; // gray hover like mentor
  const activeItemBg = isDarkMode ? "bg-gray-700 text-white" : "bg-gray-700 text-white"; // dark gray like mentor
  const iconInactive = isDarkMode ? "text-gray-300" : "text-gray-600";

  return (
    <>
      {/* Overlay for mobile */}
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

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 shadow-2xl z-40 overflow-hidden border-r transition-colors duration-300 ${darkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}`}
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.25 }}
      >
        {/* Close button on mobile */}
        {isOpen && !isDesktop && (
          <button
            className="absolute top-4 right-4 z-50 p-2 text-gray-300 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={22} />
          </button>
        )}

        <div className="flex flex-col h-full pt-16">
          {/* Menu */}
          <nav className="flex-1 pt-6 px-4">
<<<<<<< Updated upstream
            <div className="space-y-2">
 {sidebarItems.map((item) => {
  const active = activeItem === item.id;

  return (
    <button
      key={item.id}
      onClick={() => handleClick(item)}
      className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all duration-200
        ${
          active
            ? darkMode
              ? "bg-gray-700 text-white"
              : "bg-blue-600 text-white shadow-sm" 
            : darkMode
            ? "text-white hover:bg-gray-800"
            : "text-gray-800 hover:bg-gray-100"
        }`}
    >
      <item.icon
        className={`w-5 h-5 ${
          active ? "text-white" : darkMode ? "text-white" : "text-gray-600"
        }`}
      />

      <span
        className={`font-medium ${
          active ? "text-white" : darkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {item.label}
      </span>
    </button>
  );
})}

=======
            <div className="space-y-1">
              {sidebarItems.map((item, idx) => (
                <motion.button
                  key={item.id}
                  onClick={() => handleClick(item)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden group cursor-pointer select-none ${
                    activeItem === item.id
                      ? "bg-blue-600 text-white shadow-lg"
                      : "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                        activeItem === item.id ? "text-white" : "dark:text-black hover:bg-gray-100 dark:hover:bg-gray-800" // 👈 FIXED ICON COLOR
                      }`}
                    />
                  </div>

                  {/* {activeItem === item.id && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )} */}

                  <span
                    className={`font-bold relative z-10 ${
                      activeItem === item.id ? "text-white" : "text-black " // 👈 FIXED TEXT COLOR
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
>>>>>>> Stashed changes
            </div>
          </nav>

          {/* Footer */}
          <div className={`p-4 border-t ${borderColor} text-center`}>
            <p className="font-semibold text-sm mb-2 text-gray-400">Connect With Us</p>

            <div className="flex justify-center gap-4 mb-3">
              <FaLinkedin
                size={22}
                className="cursor-pointer hover:text-[#0A66C2]"
                onClick={() =>
                  window.open("https://www.linkedin.com/company/uptoskills/posts/?feedView=all", "_blank")
                }
              />
              <FaInstagram
                size={22}
                className="cursor-pointer hover:text-[#E1306C]"
                onClick={() => window.open("https://www.instagram.com/uptoskills", "_blank")}
              />
              <FaYoutube
                size={22}
                className="cursor-pointer hover:text-[#FF0000]"
                onClick={() =>
                  window.open("https://youtube.com/@uptoskills9101?si=YvRk51dq0exU-zLv", "_blank")
                }
              />
            </div>

            <motion.button
              onClick={handleLogout}
              className={`w-full text-red-500 flex items-center justify-center gap-2 p-2 rounded-lg ${
                isDarkMode ? "hover:bg-gray-800" : "hover:bg-red-50"
              }`}
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
