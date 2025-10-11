import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Settings, User, Sun, Moon, Menu } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import logo from "../../assets/logo.jpg";
import { useNavigate } from "react-router-dom";

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
      className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300"
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
            className="p-2 rounded-md hover:bg-gray-100"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-24 h-9 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={logo}
                alt="UptoSkill Logo"
                className="object-contain w-25 h-25"
              />
            </div>
          </motion.div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 relative z-10" />
              <span className="absolute -top-0 -right-0 w-3 h-3 bg-secondary rounded-full flex items-center justify-center z-20">
                <span className="w-1.5 h-1.5 bg-secondary-foreground rounded-full"></span>
              </span>
            </Button>
          </motion.div>

          {/* Theme Toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
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
              <User className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
}
