import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

const ForgotPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
        password,
      });

      if (response.status === 200) {
        alert("Password reset successfully!");
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to reset password. Please try again.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#F9FAFB]">
      <div className="flex bg-white rounded-2xl shadow-lg overflow-hidden max-w-5xl w-full">

        {/* Left Image */}
        <div className="w-1/2 hidden md:flex items-center justify-center bg-[#F5F9FF] p-10">
          <img
            src="https://cdn-icons-png.flaticon.com/512/6195/6195699.png"
            alt="Forgot Password"
            className="w-3/4"
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-[#09C3A1]">
            Forgot <span className="text-[#FF6600]">Password</span>
          </h2>

          <p className="text-gray-500 mt-1 mb-6">
            Enter your registered email and new password
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <input
              type="email"
              placeholder="Enter registered email-id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1]"
            />

            {/* New Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1]"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#09C3A1]"
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FF6600] hover:bg-[#e45600] text-white font-semibold rounded-md py-3 transition duration-300"
            >
              🔒 Reset Password
            </button>
          </form>

          <p className="text-center text-gray-600 mt-5">
            Remembered your password?{" "}
            <Link to="/login" className="text-[#09C3A1] font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
