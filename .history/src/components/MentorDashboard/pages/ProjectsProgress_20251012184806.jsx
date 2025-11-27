import { useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, User, Search, Sun, Moon, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../Company_Dashboard/ui/button";
import { Input } from "../../Company_Dashboard/ui/input";
import logo from "../../../assets/logo.jpg";
import darkLogo from "../../../assets/darkLogo.jpg";

export default function Header({ onMenuClick, isDarkMode, setIsDarkMode }) {
  const navigate = useNavigate();

  // Apply dark mode to root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("darkMode", isDarkMode ? "true" : "false");
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleMenuClick = () => {
    if (typeof onMenuClick === "function") onMenuClick();
    else window.dispatchEvent(new CustomEvent("toggleSidebar"));
  };

  const handleNotificationsClick = () => navigate("/dashboard/notifications");
  const handleProfileClick = () => navigate("/mentor-dashboard/profile");

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-white/60 text-gray-900"
      } backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">
        <div className="flex items-center gap-3">
          <motion.button
            aria-label="Toggle sidebar"
            className={`p-2 rounded-md hover:bg-gray-100 ${
              isDarkMode ? "dark:hover:bg-gray-800" : ""
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuClick}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-36 h-9 flex items-center justify-center relative overflow-hidden">
              <img
                src={isDarkMode ? darkLogo : logo}
                alt="Logo"
                className="object-contain w-25 h-10"
              />
            </div>
          </motion.div>
        </div>

        <div className="hidden md:flex items-center max-w-md w-full mx-4 sm:mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search assignments, projects..."
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNotificationsClick}
          >
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {isDarkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button variant="ghost" size="icon" onClick={handleProfileClick}>
            <User className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </motion.nav>
  );
}
