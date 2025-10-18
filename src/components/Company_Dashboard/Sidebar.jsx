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
  Users,
  X,
  Linkedin,
  Instagram,
  Globe,
} from "lucide-react";

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "search", label: "Search Students", icon: Search },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "edit-profile", label: "Edit Profile", icon: Building2 },
  { id: "about-us", label: "About Us", icon: Users },
];

export default function Sidebar({ isOpen = true, setIsOpen = () => {}, onItemClick }) {
  const [activeItem, setActiveItem] = useState("dashboard");
  const [isDesktop, setIsDesktop] = useState(false);
  const navigate = useNavigate();

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
        className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-2xl z-40 overflow-hidden border-r border-gray-200 dark:border-gray-700"
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
                        ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-xl"
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
                        activeItem === item.id ? "text-white" : "text-gray-600 dark:text-gray-300"
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
                      activeItem === item.id ? "text-white" : ""
                    }`}
                  >
                    {item.label}
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* socials + logout */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="mb-3 flex items-center justify-center gap-3">
              <a
                href="https://www.linkedin.com/company/uptoskills"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://www.instagram.com/uptoskills"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://uptoskills.com"
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800"
                aria-label="Website"
              >
                <Globe size={18} />
              </a>
            </div>

            <button
              onClick={handleLogout}
              className="w-full text-red-500 hover:bg-red-100 flex items-center gap-3 p-2 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
