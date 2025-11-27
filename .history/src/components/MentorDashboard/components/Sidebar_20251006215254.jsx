// src/components/Sidebar.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./logo.png"; // <-- adjust this path if needed
import { X, Home, Users, Folder, LogOut } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/mentor-dashboard" },
  { name: "Students", icon: <Users size={18} />, path: "/mentor-dashboard/multi-student" },
  { name: "Projects", icon: <Folder size={18} />, path: "/mentor-dashboard/open-source-contributions" },
];

const Sidebar = ({ children, isOpen: controlledIsOpen, setIsOpen: controlledSetIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("Dashboard");

  // internal open state (used when not controlled)
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  // track desktop breakpoint safely (avoid reading window during SSR/hydration)
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const check = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      if (desktop && !isControlled) setInternalOpen(true);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [isControlled]);

  const setOpen = (v) => {
    if (isControlled) {
      if (typeof controlledSetIsOpen === "function") controlledSetIsOpen(v);
    } else {
      setInternalOpen(v);
    }
  };

  // sync active item to route (handles exact or nested paths)
  useEffect(() => {
    const currentItem =
      sidebarItems.find((item) => item.path === location.pathname) ||
      sidebarItems.find((item) => location.pathname.startsWith(item.path));
    if (currentItem) setActiveItem(currentItem.name);
  }, [location.pathname]);

  // global toggle handler (use ref to avoid stale closures)
  const toggleHandlerRef = useRef();
  useEffect(() => {
    toggleHandlerRef.current = () => setOpen(!isOpen);
  }, [isOpen]);
  useEffect(() => {
    const handler = () => toggleHandlerRef.current && toggleHandlerRef.current();
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "mentor";
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } }); 
  };


  return (
    <>
      <AnimatePresence>{!isControlled && !isOpen && null}</AnimatePresence>

      <motion.aside
        className="fixed top-0 left-0 h-full w-64 shadow-2xl z-40 overflow-hidden bg-white"
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.28 }}
      >
        {/* Mobile close button */}
        <AnimatePresence>
          {isOpen && !isDesktop && (
            <motion.button
              key="close-btn"
              className="absolute top-4 right-4 z-50 p-2 text-black hover:text-gray-700"
              onClick={() => setOpen(false)}
              aria-label="Close Sidebar"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              <X size={22} />
            </motion.button>
          )}
        </AnimatePresence>

        <div className="flex flex-col h-full pt-16">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
            <img src={logo} alt="Logo" className="h-10 object-contain" />
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 pt-6 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden group cursor-pointer select-none
                    ${
                      activeItem === item.name
                        ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-xl shadow-blue-400/30"
                        : "text-gray-700 hover:bg-gray-100"
                    }
                  `}
                  onClick={() => {
                    setActiveItem(item.name);
                    navigate(item.path);
                    if (!isDesktop) setOpen(false);
                  }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: index * 0.02,
                    duration: 0.22,
                    ease: "easeOut",
                  }}
                  whileHover={{ x: 6, scale: 1.02, transition: { duration: 0.12 } }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    {React.cloneElement(item.icon, {
                      className: `w-5 h-5 transition-all duration-200 ${activeItem === item.name ? "text-white" : "text-gray-600 group-hover:text-gray-800"}`,
                    })}
                  </div>

                  {/* Active indicator */}
                  {activeItem === item.name && (
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-1.5 bg-white rounded-r-full"
                      layoutId="activeIndicator"
                      transition={{ type: "spring", stiffness: 420, damping: 30 }}
                    />
                  )}

                  <span className={`font-semibold relative z-10 ${activeItem === item.name ? "text-white" : "text-gray-800"}`}>
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>

          <div className="p-4 border-t border-gray-200">
            <motion.button
              onClick={handleLogout}
              className="w-full text-red-500 hover:bg-red-50 flex items-center gap-3 p-2 rounded-lg"
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* shift content when desktop and open */}
      <div className={`transition-all duration-300 ${isOpen && isDesktop ? "ml-64" : "ml-0"}`}>{children}</div>
    </>
  );
};

export default Sidebar;
