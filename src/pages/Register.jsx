import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import signupImage from "../assets/bgc.jpeg";

const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const ToastIcons = {
  success: (
    <svg className="w-3 h-3 mr-3 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414L9 14.414l-3.707-3.707a1 1 0 011.414-1.414L9 11.586l6.293-6.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  ),
  info: (
    <svg className="w-3 h-3 mr-3 flex-shrink-0 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 9a1 1 0 102 0v4a1 1 0 11-2 0V9zm1-4a1 1 0 100 2 1 1 0 000-2z" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 mr-3 flex-shrink-0 text-red-600" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-11.707a1 1 0 00-1.414 0L10 8.586 7.707 6.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 101.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293a1 1 0 000-1.414z" clipRule="evenodd" />
    </svg>
  ),
  warning: (
    <svg className="w-3 h-3 mr-3 flex-shrink-0 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
      <path d="M8.257 3.099c.765-1.36 2.682-1.36 3.447 0l6.518 11.593c.75 1.334-.213 3.008-1.724 3.008H3.463c-1.511 0-2.473-1.674-1.724-3.008L8.257 3.1zM11 14a1 1 0 11-2 0 1 1 0 012 0zm-1-6a1 1 0 00-.993.883L9 9v3a1 1 0 001.993.117L11 12V9a1 1 0 00-1-1z" />
    </svg>
  ),
};

const Toast = ({ type, message, onClose }) => {
  const bgColors = {
    success: "bg-green-100 text-green-700",
    info: "bg-blue-100 text-blue-700",
    error: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className={`fixed top-2 right-44 max-w-xs w-full flex items-center px-3 py-2 rounded-md shadow-md ${bgColors[type]}`} role="alert" style={{ minWidth: "280px" }}>
      {ToastIcons[type]}
      <div className="flex-1 text-sm font-medium">{message}</div>
      <button onClick={onClose} className="ml-2 text-gray-400 hover:text-gray-600">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

const RegistrationForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialRole = capitalizeFirstLetter(params.get("role") || "student");

  const [showPassword, setShowPassword] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [passwordWarning, setPasswordWarning] = useState("");
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    role: initialRole,
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const navigate = useNavigate();

  const showToast = (type, message) => setToast({ type, message });
  const closeToast = () => setToast(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // 🔥 Email validation + Auto lowercase
    if (name === "email") {
      if (/[A-Z]/.test(value)) {
        showToast("warning", "Enter a valid email (use lowercase only)");
      }
      setFormData((prev) => ({ ...prev, email: value.toLowerCase() }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      if (!passwordTouched && value.length > 0) setPasswordTouched(true);

      if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        setPasswordWarning("Password too weak. Use at least 8 characters, a number, and an uppercase letter.");
      } else setPasswordWarning("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordWarning) {
      showToast("warning", "Fix password issues before submitting!");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);

      showToast("success", response.data.message || "You have successfully registered!");

      setTimeout(() => {
        closeToast();
        navigate("/login");
      }, 3500);
    } catch (err) {
      showToast("error", err.response?.data?.message || "Registration failed!");
    }
  };

  return (
    <>
      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}

      <div className="h-[100vh] flex items-center justify-center px-5 lg:px-0 bg-gray-50">
        <div className="max-w-screen-xl bg-white shadow-md sm:rounded-lg flex justify-center flex-1">

          {/* LEFT IMAGE */}
          <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-7/12">
            <div className="h-full w-full bg-cover rounded-2xl" style={{ backgroundImage: `url(${signupImage})` }} />
          </div>

          {/* RIGHT FORM */}
          <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
            <div className="flex flex-col items-center">

              <div className="text-center">
                <h1 className="text-4xl font-extrabold text-blue-900">
                  <span className="text-[#00BDA6]">{capitalizeFirstLetter(formData.role)}</span>
                  <span className="text-[#FF6D34]"> Sign Up</span>
                </h1>
                <p className="text-[16px] text-gray-500">Enter your details to create your account</p>
              </div>

              <div className="w-full flex-1 mt-8">
                <form className="mx-auto max-w-xs flex flex-col gap-4" onSubmit={handleSubmit}>

                  {/* Role */}
                  <select name="role" value={formData.role} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200">
                    <option value="Student">Register as Student</option>
                    <option value="Company">Register as Company</option>
                    <option value="Mentor">Register as Mentor</option>
                  </select>

                  <input name="username" value={formData.username} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200" type="text" placeholder="Enter your username" required />

                  <input name="name" value={formData.name} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200" type="text" placeholder="Enter your name" required />

                  <input name="email" value={formData.email} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200" type="email" placeholder="Enter your email" required />

                  <input name="phone" value={formData.phone} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200" type="tel" placeholder="Enter your mobile no" maxLength={10} required />

                  <div className="relative w-full">
                    <input name="password" value={formData.password} onChange={handleChange} className="w-full px-5 py-3 rounded-lg bg-gray-100 border border-gray-200 pr-10" type={showPassword ? "text" : "password"} placeholder="Create a Password" required />

                    {passwordTouched && (
                      <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                      </div>
                    )}
                  </div>

                  {passwordWarning && <p className="text-xs text-red-500 mt-1">{passwordWarning}</p>}

                  <button type="submit" className="mt-5 tracking-wide font-semibold bg-[#00BDA6] text-gray-100 w-full py-4 rounded-lg hover:bg-[#FF6D34] transition-all">
                    Sign Up
                  </button>

                  <p className="text-l text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link to="/login">
                      <span className="text-[#FF6D34] hover:text-[#00BDA6] font-semibold">Sign in</span>
                    </Link>
                  </p>

                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default RegistrationForm;
