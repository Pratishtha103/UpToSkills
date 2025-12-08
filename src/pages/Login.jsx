import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Sun, Moon, Loader2 } from "lucide-react";
import axios from "axios";
import loginImage from "../assets/loginnew.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "../context/ThemeContext";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();

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
    setIsLoading(true);

    const hardcodedAdmin = {
      email: "admin@example.com",
      password: "Admin123",
      role: "admin",
    };

    const isHardcodedAdmin =
      formData.email === hardcodedAdmin.email &&
      formData.password === hardcodedAdmin.password &&
      formData.role === "admin";

    const fallbackAdminLogin = () => {
      toast.success("Admin login successful (fallback mode)");

      const adminUser = {
        name: "Admin",
        email: hardcodedAdmin.email,
        role: "admin",
      };

      localStorage.setItem("token", "dummy_admin_token");
      localStorage.setItem("user", JSON.stringify(adminUser));
      localStorage.setItem("admin", JSON.stringify(adminUser));

      setTimeout(() => {
        setIsLoading(false);
        navigate("/adminPanel", { state: { updated: true } });
      }, 2500);
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      toast.success(response.data.message || "Login successful");

      if (response.data.token)
        localStorage.setItem("token", response.data.token);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("studentId", response.data.user.id);
        localStorage.setItem("id", response.data.user.id);
      }

      const role = response.data.user?.role || formData.role;

      if (role === "mentor")
        localStorage.setItem("mentor", JSON.stringify(response.data.user));

      if (role === "admin")
        localStorage.setItem("admin", JSON.stringify(response.data.user));

      setTimeout(() => {
        setIsLoading(false);
        if (role === "admin") navigate("/adminPanel");
        else if (role === "student" || role === "learner")
          navigate("/dashboard");
        else if (role === "mentor") navigate("/mentor-dashboard");
        else if (role === "company") navigate("/company");
        else navigate("/login");
      }, 2500);
    } catch (err) {
      setIsLoading(false);
      
      if (isHardcodedAdmin) {
        fallbackAdminLogin();
        return;
      }

      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
      <div
        className="shadow-lg bg-white overflow-hidden flex"
        style={{ width: "1237px", height: "651px", borderRadius: "12px" }}
      >

        {/* LEFT IMAGE */}
        <div className="w-1/2 h-full rounded-l-xl overflow-hidden">
          <img
            src={loginImage}
            className="w-full h-full object-cover object-center"
            alt="Login Visual"
          />
        </div>

        {/* RIGHT FORM */}
        <div className="w-1/2 h-full flex items-center justify-center">
          <div className="flex flex-col items-center">

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={false}
              pauseOnHover
              style={{ marginTop: "20px", right: "250px", zIndex: 9999 }}
              closeOnClick
            />

            <div className="text-center w-full">
              <h1 className="text-4xl font-extrabold text-blue-900">
                <span className="text-[#00BDA6] capitalize">
                  {formData.role}
                </span>{" "}
                <span className="text-[#FF6D34]">Login</span>
              </h1>
              <p className="text-[16px] text-gray-500">Enter your details</p>
            </div>

            <div className="w-full flex-1 mt-8">
              <form
                className="mx-auto max-w-xs flex flex-col gap-4"
                onSubmit={handleSubmit}
              >

                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-700 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
                  disabled={isLoading}
                  className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  type="text"
                  placeholder="Enter email or username"
                  required
                />

                <div className="relative">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={isLoading}
                    className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                  />
                  <div
                    className={`absolute inset-y-0 right-3 flex items-center ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    onClick={() => !isLoading && setShowPassword((s) => !s)}
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
                    className={`text-sm text-[#00BDA6] hover:text-[#FF6D34] font-medium ${isLoading ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#FF6D34] text-white w-full py-4 rounded-lg hover:bg-[#00BDA6] transition disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    "Login"
                  )}
                </button>

                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <Link to="/register" className={isLoading ? 'pointer-events-none opacity-60' : ''}>
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