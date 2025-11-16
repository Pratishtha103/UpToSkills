import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Sun, Moon, Menu } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";
import darkLogo from "../../assets/darkLogo.jpg";
import { Link } from "react-router-dom";
import NotificationCenter from "../Notifications/NotificationCenter";

export default function Navbar({ onMenuClick }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 bg-black-60 dark:bg-gray-800 pb-2 backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ WebkitBackdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 pb-1">
        {/* Left: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          {/* Hamburger Menu */}
          <motion.button
            aria-label="Toggle sidebar"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
          </motion.button>

          {/* Logo - 🌟 FIX APPLIED HERE 🌟 */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="w-36 h-9 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                // **Dynamically set the src based on the theme**
                src={isDarkMode ? darkLogo : logo} 
                alt="UptoSkill Logo"
                className="object-contain w-25 h-25"
              />
            </Link>
          </motion.div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <NotificationCenter role="company" />
          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-white" />
              ) : (
                <Moon className="w-5 h-5 text-black" />
              )}
            </Button>
          </motion.div>

          {/* User Profile */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/company-profile")}
            >
              <User className="w-5 h-5 dark:text-white" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}