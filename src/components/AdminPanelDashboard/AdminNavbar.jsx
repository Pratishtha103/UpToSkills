import { motion } from "framer-motion";
import { Bell, Sun, Moon, Menu } from "lucide-react";
import { Button } from "../Company_Dashboard/ui/button";
import logo from "../../assets/logo.jpg";
import darkLogo from "../../assets/darkLogo.jpg";

export default function AdminNavbar({
  onMenuClick,
  onNotificationsClick,
  isDarkMode,
  toggleTheme,
}) {
  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b border-border shadow-xl transition-all duration-300 ${
        isDarkMode ? "bg-gray-900/80 text-white" : "bg-white/60 text-gray-900"
      }`}
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
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onMenuClick}
          >
            <Menu className="w-6 h-6" />
          </motion.button>

          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-28 h-9 rounded-xl flex items-center justify-center relative overflow-hidden">
              <img
                src={isDarkMode ? darkLogo : logo}
                alt="UptoSkill Logo"
                className="object-contain w-36 h-25"
              />
            </div>
          </motion.div>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          {/* <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onNotificationsClick}
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0 -right-0 w-3 h-3 bg-secondary rounded-full flex items-center justify-center z-20">
                <span className="w-1.5 h-1.5 bg-secondary-foreground rounded-full"></span>
              </span>
            </Button>
          </motion.div> */}

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
        </div>
      </div>
    </motion.nav>
  );
}
