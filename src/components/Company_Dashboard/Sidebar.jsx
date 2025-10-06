// Sidebar.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  Calendar,
  Bell,
  LogOut,
  Building2,
  Users,
  Award,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

function scrollToSection(sectionId, headerSelector, offset = 0) {
  const section = document.getElementById(sectionId);
  const header = document.querySelector(headerSelector);
  if (section) {
    const headerHeight = header ? header.offsetHeight : 0;
    const yOffset = headerHeight + offset;
    const y = section.getBoundingClientRect().top + window.pageYOffset - yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  } else {
    console.warn(`Section with id '${sectionId}' not found.`);
  }
}

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "search", label: "Search Students", icon: Search },
  { id: "interviews", label: "Interviews", icon: Calendar },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "edit-profile", label: "Edit Profile", icon: Building2 },
];

export default function Sidebar({ isOpen, setIsOpen, onItemClick }) {
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

  // helper to scroll to section id with optional header offset
  const scrollToSection = (id, offsetSelector = ".site-header", fallback = 80) => {
    if (typeof window === "undefined") return;
    const el = document.getElementById(id);
    if (!el) return;

    // compute header offset if present
    const headerEl = document.querySelector(offsetSelector);
    const headerOffset = headerEl ? headerEl.offsetHeight : fallback;

    const elementPosition = el.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };


  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "company"; 
    localStorage.clear(); 
    navigate("/login", { state: { role: lastRole } }); 
  };


  return (
    <>
      {/* Background overlay for mobile */}
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

      {/* Sidebar Panel */}
      <motion.aside
        className="fixed top-0 left-0 h-full w-64 bg-sidebar shadow-2xl z-40 overflow-hidden"
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button (Mobile only) */}
        <AnimatePresence>
          {isOpen && !isDesktop && (
            <motion.button
              key="close-btn"
              className="absolute top-4 right-4 z-50 p-2 text-gray-500 hover:text-gray-700"
              onClick={toggleSidebar}
              aria-label="Close Sidebar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut size={24} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col h-full pt-16">
          {/* Navigation Items */}
          <nav className="flex-1 pt-6 px-4">
            <div className="space-y-1">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  className={`
                    sidebar-item w-full flex items-center gap-4 p-4 rounded-2xl 
                    transition-all duration-200 ease-out relative overflow-hidden
                    group cursor-pointer select-none
                    ${activeItem === item.id
                      ? "bg-gradient-to-r from-primary to-primary/90 text-white shadow-xl shadow-primary/30"
                      : "hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 text-gray-700 hover:text-gray-900"
                    }
                  `}
                  onClick={() => {
                    setActiveItem(item.id);
                    if (onItemClick) onItemClick(item.id);

                    // Handle notifications click
                    if (item.id === "notifications") {
                      if (onItemClick) {
                        onItemClick(item.id);
                      }
                      // Close on mobile
                      if (!isDesktop) setIsOpen(false);
                      return;
                    }
                    if (item.id === "edit-profile") {
                      if (onItemClick) onItemClick(item.id);
                      if (!isDesktop) setIsOpen(false);
                      return;
                    }

                    // Dashboard -> scroll to top
                    if (item.id === "dashboard") {
                      if (typeof window !== "undefined") {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }

                    // Interviews -> scroll to section with header offset
                    if (item.id === "interviews") {
                      // Change '.site-header' selector if your header class differs
                      if (typeof scrollToSection === "function") {
                        scrollToSection("upcoming-interviews", ".site-header", 80);
                      } else {
                        console.warn("scrollToSection function is not defined");
                      }
                    }

                    // Close on mobile
                    if (!isDesktop) setIsOpen(false);
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.03,
                    duration: 0.3,
                    ease: "easeOut",
                  }}
                  whileHover={{
                    x: 8,
                    scale: 1.03,
                    transition: { duration: 0.15, ease: "easeOut" },
                  }}
                  whileTap={{
                    scale: 0.97,
                    transition: { duration: 0.1, ease: "easeInOut" },
                  }}
                >
                  {/* Icon */}
                  <motion.div
                    className="relative z-10 flex items-center justify-center"
                    whileHover={{
                      rotate: activeItem === item.id ? 0 : 5,
                      scale: 1.15,
                      transition: { duration: 0.15 },
                    }}
                    whileTap={{
                      scale: 0.9,
                      transition: { duration: 0.1 },
                    }}
                  >
                    <item.icon
                      className={`w-6 h-6 transition-all duration-200 ${activeItem === item.id
                          ? "text-white drop-shadow-md"
                          : "text-gray-600 group-hover:text-primary"
                        }`}
                    />
                  </motion.div>

                  {/* Active indicator – left side */}
                  {activeItem === item.id && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                        duration: 0.2,
                      }}
                    />
                  )}

                  {/* Text */}
                  <motion.span
                    className={`
                      font-bold relative z-10 transition-all duration-200
                      ${activeItem === item.id
                        ? "text-white drop-shadow-md tracking-wide"
                        : "text-gray-700 group-hover:text-gray-900"
                      }
                    `}
                    whileHover={{ x: 3, transition: { duration: 0.15 } }}
                  >
                    {item.label}
                  </motion.span>
                </motion.button>
              ))}
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-sidebar-border">
           <motion.button
              onClick={handleLogout}
              className=" sidebar-item w-full text-red-400 hover:bg-red-500/10 flex items-center gap-3 p-2 rounded-lg"
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
