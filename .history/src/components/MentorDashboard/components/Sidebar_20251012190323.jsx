// Sidebar.jsx
import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { X, Home, Users, Folder, LogOut, Edit3 } from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: <Home size={18} />, path: "/mentor-dashboard" },
  {
    name: "Students",
    icon: <Users size={18} />,
    path: "/mentor-dashboard/multi-student",
  },
  {
    name: "Projects",
    icon: <Folder size={18} />,
    path: "/mentor-dashboard/projects-progress",
  },
  {
    name: "Edit Profile",
    icon: <Edit3 size={18} />,
    path: "/mentor-dashboard/edit-profile",
  },
];

const Sidebar = ({
  children,
  isOpen: controlledIsOpen,
  setIsOpen: controlledSetIsOpen,
  isDarkMode,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeItem, setActiveItem] = useState("Dashboard");
  const [internalOpen, setInternalOpen] = useState(true);
  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

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

  // Sync active item to route
  useEffect(() => {
    const currentItem =
      sidebarItems.find((item) => item.path === location.pathname) ||
      sidebarItems.find((item) => location.pathname.startsWith(item.path));
    if (currentItem) setActiveItem(currentItem.name);
  }, [location.pathname]);

  // global toggle handler
  const toggleHandlerRef = useRef();
  useEffect(() => {
    toggleHandlerRef.current = () => setOpen(!isOpen);
  }, [isOpen]);
  useEffect(() => {
    const handler = () =>
      toggleHandlerRef.current && toggleHandlerRef.current();
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  const handleLogout = () => {
    const lastRole = localStorage.getItem("role") || "mentor";
    localStorage.clear();
    navigate("/login", { state: { role: lastRole } });
  };

  // Dark mode colors
  const bgColor = isDarkMode
    ? "bg-gray-900 text-white"
    : "bg-white text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700" : "border-gray-200";
  const hoverBg = isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100";
  const activeBg = isDarkMode
    ? "bg-gray-700 text-white"
    : "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-xl shadow-blue-400/30";

  return (
    <>
      <AnimatePresence>{!isControlled && !isOpen && null}</AnimatePresence>

      <motion.aside
        className={`fixed top-0 left-0 h-full w-64 shadow-2xl z-40 overflow-hidden ${bgColor}`}
        initial={{ x: -264 }}
        animate={{ x: isOpen ? 0 : -264 }}
        transition={{ duration: 0.28 }}
      >
        {/* Mobile close button */}
        <AnimatePresence>
          {isOpen && !isDesktop && (
            <motion.button
              key="close-btn"
              className={`absolute top-4 right-4 z-50 p-2 ${
                isDarkMode
                  ? "text-white hover:text-gray-300"
                  : "text-black hover:text-gray-700"
              }`}
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
          {/* Navigation Items */}
          <nav className="flex-1 pt-6 px-4">
            <div className="space-y-2">
              {sidebarItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  className={`w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 ease-out relative overflow-hidden group cursor-pointer select-none
                    ${activeItem === item.name ? activeBg : hoverBg}`}
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
                  whileHover={{
                    x: 6,
                    scale: 1.02,
                    transition: { duration: 0.12 },
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className="relative z-10 flex items-center justify-center">
                    {React.cloneElement(item.icon, {
                      className: `w-5 h-5 transition-all duration-200 ${
                        activeItem === item.name
                          ? "text-white"
                          : isDarkMode
                          ? "text-gray-300 group-hover:text-white"
                          : "text-gray-600 group-hover:text-gray-800"
                      }`,
                    })}
                  </div>

                  <span
                    className={`font-semibold relative z-10 ${
                      activeItem === item.name
                        ? "text-white"
                        : isDarkMode
                        ? "text-gray-300"
                        : "text-gray-800"
                    }`}
                  >
                    {item.name}
                  </span>
                </motion.button>
              ))}
            </div>
          </nav>

          <div className={`p-4 border-t ${borderColor}`}>
            <motion.button
              onClick={handleLogout}
              className={`w-full text-red-500 hover:bg-red-50 flex items-center gap-3 p-2 rounded-lg`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Log Out</span>
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Shift content when desktop and open */}
      <div
        className={`transition-all duration-300 ${
          isOpen && isDesktop ? "ml-64" : "ml-0"
        }`}
      >
        {children}
      </div>
    </>
  );
};

export default Sidebar;
