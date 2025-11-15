import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/newlogo.jpg";

//import logo from "../../assets/logo.jpg";

const Header = () => {
  return (
    <header className="font-sans fixed w-full z-50 bg-white/80 backdrop-blur-lg shadow-sm transition">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" aria-label="Uptoskills Home">
          <img
            src={logo} // using imported logo instead of hard-coded path
            alt="Uptoskills Logo"
            className="w-36 h-10 transition-transform hover:scale-110"
          />
        </Link>

        {/* Navigation */}
        <nav className="flex space-x-6 font-medium text-gray-800 text-sm">
          {["Home", "About", "Courses", "Contact"].map((link, i) => {
            const path =
              link.toLowerCase() === "home" ? "/" : `/${link.toLowerCase()}`;
            return (
              <Link
                key={i}
                to={path}
                className="relative group hover:text-[#00BDA6]"
              >
                {link}
                <span className="absolute left-0 -bottom-1 h-0.5 w-0 bg-[#00BDA6] group-hover:w-full transition-all duration-300" />
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

export default Header;