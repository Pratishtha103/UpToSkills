import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      toast.success("Admin login successful");

      const adminUser = {
        name: "Admin",
        email: hardcodedAdmin.email,
        role: "admin",
      };

      localStorage.setItem("token", "dummy_admin_token");
      localStorage.setItem("user", JSON.stringify(adminUser));

      setTimeout(() => navigate("/adminPanel", { state: { updated: true } }), 1000);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Login successful");

      if (response.data.token) localStorage.setItem("token", response.data.token);
      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("studentId", response.data.user.id);
        localStorage.setItem("id", response.data.user.id);
      }

      const roleToSave = (response.data.user?.role || formData.role).toLowerCase();
      if (roleToSave === "mentor" && response.data.user) {
        localStorage.setItem("mentor", JSON.stringify(response.data.user));
      }

      setTimeout(() => {
        if (roleToSave === "admin") navigate("/adminPanel");
        else if (roleToSave === "student" || roleToSave === "learner")
          navigate("/dashboard");
        else if (roleToSave === "mentor") navigate("/mentor-dashboard");
        else if (roleToSave === "company") navigate("/company");
        else navigate("/login");
      }, 5000);

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again.";

      toast.error(message);
    }
  };

  return (
    <div className="h-[100vh] flex justify-center items-center px-5 lg:px-0 bg-gray-50">
      <div className="max-w-screen-xl bg-white sm:rounded-lg shadow-md flex justify-center flex-1">

        {/* Image */}
        <div className="w-full md:w-1/2 p-3 flex items-center">
          <div
            className="w-full h-[420px] md:h-[400px] lg:h-[600px] bg-cover bg-center rounded-2xl shadow-sm"
            style={{ backgroundImage: `url(${loginImage})` }}
          />
        </div>

        {/* Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12 relative">
          <div className="flex flex-col items-center">

            {/* Toast Container positioned above heading */}
            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              pauseOnHover
              closeOnClick
              newestOnTop
              style={{ top: '-40px', right: '110px', position: 'absolute', marginRight: '0', zIndex: 9999 }}
            />

            <div className="text-center w-full">
              <h1 className="text-4xl xl:text-4xl font-extrabold text-blue-900">
                <span className="text-[#00BDA6] capitalize">{formData.role}</span>{" "}
                <span className="text-[#FF6D34]">Login</span>
              </h1>
              <p className="text-[16px] text-gray-500">Enter your details</p>
            </div>

            <div className="w-full flex-1 mt-8">
              <form className="mx-auto max-w-xs flex flex-col gap-4" onSubmit={handleSubmit}>
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

                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm"
                  type="text"
                  placeholder="Enter email or username"
                  required
                />

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

                <div className="text-right -mt-2 mb-3">
                  <Link
                    to="/login/forgot-password"
                    className="text-sm text-[#00BDA6] hover:text-[#FF6D34] font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="bg-[#FF6D34] text-white w-full py-4 rounded-lg hover:bg-[#00BDA6] transition"
                >
                  Login
                </button>

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

      </div>
    </div>
  );
};

export default LoginForm;
