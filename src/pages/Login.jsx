import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import loginImage from "../assets/loginnew.jpg";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "student",
  });

  useEffect(() => {
    if (location.state?.role) {
      setFormData((prev) => ({ ...prev, role: location.state.role }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hardcoded admin
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

      const adminUser = {
        name: "Admin",
        email: hardcodedAdmin.email,
        role: "admin",
      };

      localStorage.setItem("token", "dummy_admin_token");
      localStorage.setItem("user", JSON.stringify(adminUser));

      navigate("/adminPanel", { state: { updated: true } });
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      alert(response.data.message || "Login successful");

      if (response.data.token)
        localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        const user = response.data.user;
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "student" || user.role === "learner") {
          localStorage.setItem("studentId", user.id);
        }
      }

      const roleToSave =
        (response.data.user?.role || formData.role).toLowerCase();

      if (roleToSave === "mentor" && response.data.user) {
        localStorage.setItem("mentor", JSON.stringify(response.data.user));
      }

      if (roleToSave === "admin") navigate("/adminPanel");
      else if (roleToSave === "student" || roleToSave === "learner")
        navigate("/dashboard");
      else if (roleToSave === "mentor") navigate("/mentor-dashboard");
      else if (roleToSave === "company") navigate("/company");
      else navigate("/login");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";
      alert(message);
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center px-5 lg:px-0 bg-gray-50">
      <div className="max-w-screen-xl bg-white sm:rounded-lg shadow-md flex flex-1">

        {/* LEFT IMAGE */}
        <div className="hidden md:flex w-1/2 justify-center items-center p-6">
          <div
            className="w-full h-[420px] md:h-[400px] lg:h-[600px] bg-cover bg-center rounded-2xl shadow-sm"
            style={{ backgroundImage: `url(${loginImage})` }}
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-full md:w-1/2 p-6 sm:p-12 flex flex-col justify-center">
          <div className="text-center mb-6">
            <h1 className="text-4xl font-extrabold text-blue-900">
              <span className="text-[#00BDA6] capitalize">{formData.role}</span>{" "}
              <span className="text-[#FF6D34]">Login</span>
            </h1>
            <p className="text-[16px] text-gray-500">Enter your details</p>
          </div>

          <form className="max-w-xs mx-auto flex flex-col gap-4" onSubmit={handleSubmit}>
            
            {/* ROLE SELECT */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-gray-700 text-sm"
            >
              <option value="admin">Login as Admin</option>
              <option value="student">Login as Student</option>
              <option value="company">Login as Company</option>
              <option value="mentor">Login as Mentor</option>
            </select>

            {/* EMAIL */}
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
              type="text"
              placeholder="Enter email or username"
              required
            />

            {/* PASSWORD */}
            <div className="relative">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
              />
              <div
                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-500" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-500" />
                )}
              </div>
            </div>

            {/* FORGOT PASSWORD */}
            <div className="text-right -mt-2">
              <Link
                to="/login/forgot-password"
                className="text-sm text-[#00BDA6] hover:text-[#FF6D34] font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              className="mt-3 bg-[#FF6D34] text-white w-full py-3 rounded-lg hover:bg-[#00BDA6] transition"
            >
              Login
            </button>

            {/* SIGNUP */}
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
