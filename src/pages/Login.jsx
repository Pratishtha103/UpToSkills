

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Set role if coming from outside navigation
  useEffect(() => {
    if (location.state?.role) {
      setFormData((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded Admin Login
    const hardcodedAdmin = {
      email: "admin@example.com",
      password: "Admin123",
      role: "admin",
    };

    if (
      formData.email === hardcodedAdmin.email &&
      formData.password === hardcodedAdmin.password &&
      formData.role === "admin"
    ) {
      alert("Admin login successful");
      const adminUser = { name: "Admin", email: hardcodedAdmin.email, role: "admin" };
      localStorage.setItem("token", "dummy_admin_token");
      localStorage.setItem("user", JSON.stringify(adminUser));
      navigate("/adminPanel");
      return;
    }

    // Normal API Login
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Login response:", response.data); // Debug log

      alert(response.data.message || "Login successful");

      // ✅ CRITICAL FIX: Store all data BEFORE navigation
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      if (response.data.user)
        localStorage.setItem("user", JSON.stringify(response.data.user));

      const role = response.data.user?.role?.toLowerCase() || formData.role;

      if (role === "admin") navigate("/adminPanel");
      else if (role === "student" || role === "learner") navigate("/dashboard");
      else if (role === "mentor") navigate("/mentor-dashboard");
      else if (role === "company") navigate("/company");
      else navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center px-5 bg-gray-50">
      <div className="max-w-screen-xl bg-white sm:rounded-lg shadow-md flex flex-1">

        {/* Left Image */}
        <div className="hidden md:block md:w-1/2">
          <div
            className="h-full w-full bg-cover rounded-2xl bg-left"
            style={{
              backgroundImage:
                "url(https://static.vecteezy.com/system/resources/previews/008/415/006/non_2x/employment-agency-for-recruitment-or-placement-job-service-with-skilled-and-experienced-career-laborers-in-flat-cartoon-illustration-vector.jpg)",
            }}
          />
        </div>

        {/* Right Form */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h1 className="text-4xl font-extrabold text-center text-blue-900">
            <span className="text-[#00BDA6] capitalize">{formData.role}</span>{" "}
            <span className="text-[#FF6D34]">Login</span>
          </h1>

          <p className="text-center text-gray-500 mt-1">Enter your details to login</p>

          {/* Login Form */}
          <form
            className="max-w-xs mx-auto mt-8 flex flex-col gap-4"
            onSubmit={handleSubmit}
            autoComplete="off"
          >

            {/* Role Selector */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm"
            >
              <option value="admin">Login as Admin</option>
              <option value="student">Login as Student</option>
              <option value="company">Login as Company</option>
              <option value="mentor">Login as Mentor</option>
            </select>

            {/* Email */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="text"
              autoComplete="off"
              placeholder="Enter email or username"
              className="px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Enter your password"
                className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-300 text-sm"
                required
              />

              {/* Eye Toggle */}
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-2">
              <Link
                to="/login/forgot-password"
                className="text-sm text-[#00BDA6] hover:text-[#FF6D34]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="bg-[#FF6D34] text-white py-3 rounded-lg hover:bg-[#00BDA6] transition"
            >
              Login
            </button>

            {/* Signup */}
            <p className="text-center text-gray-600">
              Don’t have an account?{" "}
              <Link to="/register">
                <span className="text-[#00BDA6] hover:text-[#FF6D34] font-semibold">
                  Sign up
                </span>
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginForm;

