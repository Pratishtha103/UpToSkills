import React from "react";
import { useTheme } from "../../../context/ThemeContext";

const Footer = () => {
    const { darkMode } = useTheme();
    
    return (
        <footer className={`w-full text-center text-sm py-4 transition-colors duration-200 ${darkMode ? "bg-gray-900 text-gray-300" : "bg-white text-gray-700"}`}>
            ©2025 Uptoskills. Built by learners.
        </footer>
    );
};

export default Footer;
