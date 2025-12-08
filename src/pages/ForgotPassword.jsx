import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ===========================================
// ForgotPassword Component
// Handles password reset with validation,
// toast notifications, password strength checking,
// and redirect after success.
// ===========================================
const ForgotPassword = () => {

  // ===============================
  // STATE MANAGEMENT
  // ===============================

  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Input fields state
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Navigation hook to redirect after success
  const navigate = useNavigate();

  // ===============================
  // PASSWORD VALIDATION RULES
  // Strong password = must pass all checks
  // ===============================

  const hasUpperCase = /[A-Z]/.test(password);              // At least 1 uppercase letter
  const hasLowerCase = /[a-z]/.test(password);              // At least 1 lowercase letter
  const hasNumber = /\d/.test(password);                    // At least 1 number
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password); // At least 1 special character
  const isMinLength = password.length >= 8;                 // Minimum 8 characters

  // Combined strong password check
  const isStrongPassword =
    hasUpperCase &&
    hasLowerCase &&
    hasNumber &&
    hasSpecialChar &&
    isMinLength;

  // Password match logic
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const passwordsMismatch = password !== confirmPassword && confirmPassword.length > 0;

  // ===============================
  // SUBMIT HANDLER
  // Called when user resets password
  // ===============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Passwords must match
    if (!passwordsMatch) {
      toast.error("Passwords do not match!");
      return;
    }

    // Validation: Password must be strong
    if (!isStrongPassword) {
      toast.error("Password must be 8+ chars with uppercase, lowercase, number & special char!");
      return;
    }

    try {
      // Making POST request to backend
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
        password,
      });

      if (response.status === 200) {
        toast.success("Password reset successfully!");

        // Redirect user after success
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9FAFB]">

      {/* Outer wrapper for card layout */}
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl w-full">

        {/* ===================================== */}
        {/* LEFT SIDE IMAGE (Visible only on MD+) */}
        {/* ===================================== */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-[#F5F9FF] p-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
            alt="Forgot Password"
            className="w-3/4"
          />
        </div>

        {/* ===================================== */}
        {/* RIGHT SIDE FORM SECTION */}
        {/* ===================================== */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">

          {/* Title */}
          <h2 className="text-3xl font-bold text-[#09C3A1]">
            Forgot <span className="text-[#FF6600]">Password</span>
          </h2>

          <p className="text-gray-500 mt-1 mb-6">
            Enter your registered email or username and new password
          </p>

          {/* =========================== */}
          {/* RESET PASSWORD FORM */}
          {/* =========================== */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Field */}
            <input
              type="email"
              placeholder="Enter registered email-id or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1]"
            />

            {/* =========================== */}
            {/* NEW PASSWORD FIELD */}
            {/* =========================== */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password (8+ chars, uppercase, lowercase, number, special)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full rounded-md px-4 py-3 focus:outline-none
                  ${isStrongPassword ? "border border-green-500" : ""}
                  ${!isStrongPassword && password ? "border border-red-500" : ""}
                  ${!password ? "border border-gray-300" : ""}`}
              />

              {/* Toggle password visibility */}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* =========================== */}
            {/* CONFIRM PASSWORD FIELD */}
            {/* =========================== */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full rounded-md px-4 py-3 focus:outline-none
                  ${passwordsMatch ? "border border-green-500" : ""}
                  ${passwordsMismatch ? "border border-red-500" : ""}
                  ${!passwordsMatch && !passwordsMismatch ? "border border-gray-300" : ""}`}
              />

              {/* Toggle confirm-password visibility */}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* =========================== */}
            {/* PASSWORD STRENGTH MESSAGE */}
            {/* =========================== */}
            {password && (
              <div className="space-y-1">
                <p className={`text-sm ${isStrongPassword ? "text-green-600" : "text-red-600"}`}>
                  {isStrongPassword ? "✔ Strong password" : "✖ Password too weak"}
                </p>

                {/* Guide symbols */}
                <div className="flex gap-1 text-xs text-gray-500">
                  <span>8+ chars</span>
                  <span>ABC</span>
                  <span>abc</span>
                  <span>123</span>
                  <span>@#$</span>
                </div>
              </div>
            )}

            {/* Match/Mismatch messages */}
            {passwordsMatch && (
              <p className="text-green-600 text-sm">✔ Passwords match</p>
            )}
            {passwordsMismatch && (
              <p className="text-red-600 text-sm">✖ Passwords do not match</p>
            )}

            {/* =========================== */}
            {/* RESET PASSWORD BUTTON */}
            {/* =========================== */}
            <button
              type="submit"
              disabled={!passwordsMatch || !isStrongPassword}
              className={`w-full flex items-center justify-center gap-2 rounded-md py-3 font-semibold transition duration-300 ${
                passwordsMatch && isStrongPassword
                  ? "bg-[#09C3A1] hover:bg-[#07a589] text-white"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              🔒 Reset Password
            </button>
          </form>

          {/* Login redirect text */}
          <p className="text-center text-gray-600 mt-5">
            Remembered your password?{" "}
            <Link to="/login" className="text-[#09C3A1] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* Toast popup container */}
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
    </div>
  );
};

export default ForgotPassword;
