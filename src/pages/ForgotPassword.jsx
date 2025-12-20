import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const ForgotPassword = () => {
  // ===============================
  // STATE MANAGEMENT
  // ===============================

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  // ===============================
  // PASSWORD VALIDATION RULES
  // ===============================

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isMinLength = password.length >= 8;

  const isStrongPassword =
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    isMinLength;

  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const passwordsMismatch = password !== confirmPassword && confirmPassword.length > 0;

  // ===============================
  // VALIDATION CHECKS
  // ===============================

  const isEmailValid = email.trim().length > 0;
  const isFormValid = isEmailValid && passwordsMatch && isStrongPassword;

  // ===============================
  // SUBMIT HANDLER
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!isEmailValid) {
      toast.error("Please enter your email or username");
      return;
    }

    if (!passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    if (!isStrongPassword) {
      toast.error("Password must be 8+ chars with uppercase, lowercase, number & special char!");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email: email.trim(),
        password: password.trim(),
      }, {
        timeout: 10000,
      });

      if (response.data.success) {
        toast.success("Password reset successfully!");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      
      if (error.response?.status === 404) {
        toast.error(error.response.data.message || "User not found. Check your email/username.");
      } else if (error.response?.status === 400) {
        toast.error(error.response.data.message || "Invalid input. Please check your details.");
      } else if (error.request) {
        toast.error("No response from server. Please check your connection.");
      } else {
        toast.error("Failed to reset password. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`relative flex justify-center items-center min-h-screen px-4 py-10 transition-colors duration-300 ${
        darkMode ? "bg-[#020817] text-gray-100" : "bg-[#F9FAFB] text-gray-900"
      }`}
    >
      {/* Theme Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className={`absolute top-6 right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full shadow-md transition-colors ${
          darkMode
            ? "bg-slate-800 text-yellow-300 hover:bg-slate-700"
            : "bg-white text-slate-600 hover:bg-slate-100"
        }`}
        aria-label="Toggle theme"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Main Container */}
      <div
        className={`flex rounded-2xl shadow-2xl overflow-hidden max-w-5xl w-full border transition-colors duration-300 ${
          darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
        }`}
      >
        {/* Left Image Section */}
        <div
          className={`w-1/2 hidden md:flex items-center justify-center p-10 transition-colors duration-300 ${
            darkMode ? "bg-slate-950" : "bg-[#F5F9FF]"
          }`}
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
            alt="Forgot Password"
            className="w-3/4 drop-shadow-lg"
          />
        </div>

        {/* Right Form Section */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#09C3A1]">
            Forgot <span className="text-[#FF6600]">Password</span>
          </h2>

          <p className={`mt-1 mb-6 text-base ${darkMode ? "text-slate-300" : "text-gray-500"}`}>
            Enter your registered email or username and new password
          </p>

          {/* Reset Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            {/* Email/Username Field */}
            <div>
              <input
                type="text"
                placeholder="Enter registered email or username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className={`w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1] transition-colors ${
                  darkMode
                    ? "bg-slate-800 border border-slate-700 text-white placeholder:text-slate-400"
                    : "border border-gray-300 bg-white text-gray-900"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />
            </div>

            {/* New Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (8+ chars, uppercase, lowercase, number, special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className={`w-full rounded-md px-4 py-3 focus:outline-none transition-colors ${
                  isStrongPassword && password ? "border border-green-500 focus:ring-2 focus:ring-green-500" : ""
                } ${
                  !isStrongPassword && password ? "border border-red-500 focus:ring-2 focus:ring-red-500" : ""
                } ${
                  !password ? (darkMode ? "border border-slate-700" : "border border-gray-300") : ""
                } ${
                  darkMode ? "bg-slate-800 text-white placeholder:text-slate-400" : "bg-white text-gray-900"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              {/* Password visibility toggle */}
              <div
                className={`absolute inset-y-0 right-3 flex items-center ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                } ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                onClick={() => !isLoading && setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="new-password"
                className={`w-full rounded-md px-4 py-3 focus:outline-none transition-colors ${
                  passwordsMatch && confirmPassword ? "border border-green-500 focus:ring-2 focus:ring-green-500" : ""
                } ${
                  passwordsMismatch ? "border border-red-500 focus:ring-2 focus:ring-red-500" : ""
                } ${
                  !passwordsMatch && !passwordsMismatch ? (darkMode ? "border border-slate-700" : "border border-gray-300") : ""
                } ${
                  darkMode ? "bg-slate-800 text-white placeholder:text-slate-400" : "bg-white text-gray-900"
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              />

              {/* Confirm password visibility toggle */}
              <div
                className={`absolute inset-y-0 right-3 flex items-center ${
                  isLoading ? "cursor-not-allowed" : "cursor-pointer"
                } ${darkMode ? "text-slate-400" : "text-gray-500"}`}
                onClick={() => !isLoading && setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <p className={`text-sm font-medium ${isStrongPassword ? "text-green-500" : "text-red-500"}`}>
                  {isStrongPassword ? "✔ Strong password" : "✖ Password too weak"}
                </p>
                <div className={`grid grid-cols-5 gap-1 text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>
                  <span className={`text-center ${isMinLength ? "text-green-500 font-bold" : ""}`}>8+</span>
                  <span className={`text-center ${hasUpperCase ? "text-green-500 font-bold" : ""}`}>ABC</span>
                  <span className={`text-center ${hasLowerCase ? "text-green-500 font-bold" : ""}`}>abc</span>
                  <span className={`text-center ${hasNumber ? "text-green-500 font-bold" : ""}`}>123</span>
                  <span className={`text-center ${hasSpecialChar ? "text-green-500 font-bold" : ""}`}>@#$</span>
                </div>
              </div>
            )}

            {/* Password Match Messages */}
            {passwordsMatch && (
              <p className="text-green-500 text-sm font-medium">✔ Passwords match</p>
            )}
            {passwordsMismatch && (
              <p className="text-red-500 text-sm font-medium">✖ Passwords do not match</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold transition duration-300 ${
                isFormValid && !isLoading
                  ? "bg-[#09C3A1] hover:bg-[#07a589] text-white cursor-pointer"
                  : darkMode
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Resetting...
                </>
              ) : (
                <>
                  🔒 Reset Password
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <p className={`text-center mt-5 ${darkMode ? "text-slate-400" : "text-gray-600"}`}>
            Remembered your password?{" "}
            <Link to="/login" className="text-[#09C3A1] font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme={darkMode ? "dark" : "light"} />
    </div>
  );
};

export default ForgotPassword;