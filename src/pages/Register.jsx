// src/pages/Registration.jsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Helper to capitalize first letter
const capitalizeFirstLetter = (str) => str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const RegistrationForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialRole = capitalizeFirstLetter(params.get("role") || "student");

  const [formData, setFormData] = useState({
    role: initialRole,
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");

  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        setPasswordWarning("Password too weak. Use 8+ chars, a number, and uppercase letter.");
      } else {
        setPasswordWarning("");
      }
    }
  };

  // Validate form inputs
  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return false;
    }
    if (!formData.username.trim()) {
      toast.error("Username is required");
      return false;
    }
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return false;
    }
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Invalid email format");
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error("Phone number is required");
      return false;
    }
    if (formData.phone.length !== 10 || !/^\d{10}$/.test(formData.phone)) {
      toast.error("Phone number must be 10 digits");
      return false;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return false;
    }
    if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
      toast.error("Password must be at least 8 characters with uppercase and number");
      return false;
    }
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    try {
      // Send role in lowercase to match backend
      const payload = { ...formData, role: formData.role.toLowerCase() };

      const response = await axios.post("http://localhost:5000/api/auth/register", payload, {
        headers: { "Content-Type": "application/json" },
      });

      toast.success(response.data.message || "Registration successful 🎉", { position: "top-center", autoClose: 3000 });

      // Navigate to login after a short delay
      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please check your inputs and try again.";

      toast.error(message, { position: "top-center", autoClose: 4000 });
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center px-5 lg:px-0">
      {/* Toast Container */}
      <ToastContainer />

      <div className="max-w-screen-xl bg-white shadow-md sm:rounded-lg flex justify-center flex-1">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-7/12">
          <div
            className="h-full w-full bg-cover rounded-2xl"
            style={{
              backgroundImage: "url(https://www.teamob.ai/images/placement-consultant.png)",
            }}
          ></div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-blue-900 text-center">
              <span className="text-[#00BDA6]">{capitalizeFirstLetter(formData.role)}</span>{" "}
              <span className="text-[#FF6D34]">Sign Up</span>
            </h1>
            <p className="text-gray-500 text-center mt-2">
              Enter your details to create an account
            </p>

            <form className="w-full mt-8 flex flex-col gap-4 max-w-xs mx-auto" onSubmit={handleSubmit}>
              {/* Role */}
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-lg border bg-gray-100 focus:outline-none"
              >
                <option value="Student">Register as Student</option>
                <option value="Company">Register as Company</option>
                <option value="Mentor">Register as Mentor</option>
              </select>

              {/* Name */}
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                type="text"
                placeholder="Enter your name"
                className="w-full px-5 py-3 rounded-lg border bg-gray-100"
                required
              />

              {/* Username */}
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                type="text"
                placeholder="Enter username"
                className="w-full px-5 py-3 rounded-lg border bg-gray-100"
                required
              />

              {/* Email */}
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3 rounded-lg border bg-gray-100"
                required
              />

              {/* Phone */}
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="Enter your phone number"
                maxLength={10}
                className="w-full px-5 py-3 rounded-lg border bg-gray-100"
                required
              />

              {/* Password */}
              <div className="relative w-full">
                <input
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full px-5 py-3 rounded-lg border bg-gray-100 pr-10"
                  required
                />
                <div
                  className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                </div>
              </div>
              {passwordWarning && <p className="text-red-500 text-xs">{passwordWarning}</p>}

              {/* Submit */}
              <button
                type="submit"
                className="mt-5 w-full py-4 rounded-lg bg-[#00BDA6] text-gray-100 font-semibold hover:bg-[#FF6D34] transition-all duration-150"
              >
                Sign Up
              </button>

              {/* Link to login */}
              <p className="text-gray-600 text-center mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-[#FF6D34] font-semibold hover:text-[#00BDA6]">
                  Sign In
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
