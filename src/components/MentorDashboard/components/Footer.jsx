import React from "react";
import { useTheme } from "../../../context/ThemeContext";

// Footer component definition
const Footer = () => {

     // Accessing the darkMode value from the ThemeContext
    const { darkMode } = useTheme();
    
    return (

         // Footer element with dynamic styling based on dark mode
        <footer className={`w-full text-center text-sm py-4 transition-colors duration-200 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"}`}>
            ©2025 Uptoskills. Built by learners.
        </footer>
    );
};

// Exporting the Footer component for use in other parts of the app
export default Footer;
