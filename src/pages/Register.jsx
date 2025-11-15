import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

// Helper function to capitalize the first letter and lowercase the rest
const capitalizeFirstLetter = (string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

const RegistrationForm = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  // Ensure initial role is normalized to the capitalization used in the <select>
  const initialRole = capitalizeFirstLetter(params.get("role") || "student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Initial role is now "Student" instead of "student"
    role: initialRole, 
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });
  const [passwordWarning, setPasswordWarning] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Note: The value from the <select> is already capitalized (e.g., "Student")
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "password") {
      if (value.length < 8 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
        setPasswordWarning(
          "Password too weak. Use at least 8 characters, a number, and an uppercase letter."
        );
      } else {
        setPasswordWarning("");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // NOTE: For the backend, you might want to send the role as lowercase (e.g., "student").
      // If so, change formData to {...formData, role: formData.role.toLowerCase()}
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log('Form Data:', formData);
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="h-[100vh] flex items-center justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white shadow-xs shadow-[#00BDA6] sm:rounded-lg flex justify-center flex-1">
        {/* Left Image */}
        <div className="hidden md:block md:w-1/2 lg:w-1/2 xl:w-7/12">
          <div
            className="h-full w-full bg-cover rounded-2xl"
            style={{
              backgroundImage:
                "url(https://www.teamob.ai/images/placement-consultant.png)",
            }}
          ></div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className="flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-4xl xl:text-4xl font-extrabold text-blue-900">
                <span className="text-[#00BDA6]">
                  {/* USE THE HELPER FUNCTION HERE */}
                  {capitalizeFirstLetter(formData.role)}
                </span>{" "}
                <span className="text-[#FF6D34]">Sign Up</span>
              </h1>
              <p className="text-[16px] text-gray-500">
                Hey, enter your details to create your account
              </p>
            </div>

            <div className="w-full flex-1 mt-8">
              <form
                className="mx-auto max-w-xs flex flex-col gap-4"
                onSubmit={handleSubmit}
              >
                {/* Role Selection */}
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 text-sm focus:outline-none focus:border-gray-400 focus:bg-white"
                >
                  {/* Keep these values capitalized as they are now used for the formData state */}
                  <option value="Student">Register as Student</option>
                  <option value="Company">Register as Company</option>
                  <option value="Mentor">Register as Mentor</option>
                </select>

                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200"
                  type="text"
                  placeholder="Enter your name"
                  required
                />
                <input
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200"
                  type="text"
                  placeholder="Enter UserName"
                  required
                />
                {/* ... other form fields follow ... */}
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200"
                  type="email"
                  placeholder="Enter your email"
                  required
                />

                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200"
                  type="tel"
                  placeholder="Enter your mobile no"
                  maxLength={10}
                  required
                />

                <div className="relative w-full">
                  <input
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border border-gray-200 pr-10"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a Password"
                    required
                  />
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

                {passwordWarning && (
                  <p className="text-xs text-red-500 mt-1">
                    {passwordWarning}
                  </p>
                )}

                <button
                  type="submit"
                  className="mt-5 tracking-wide font-semibold bg-[#00BDA6] text-gray-100 w-full py-4 rounded-lg hover:bg-[#FF6D34] transition-all duration-100 ease-in-out"
                >
                  <span className="ml-3">Sign Up</span>
                </button>

                <p className="text-l text-gray-600 text-center">
                  Already have an account?{" "}
                  <Link to="/login">
                    <span className="text-[#FF6D34] hover:text-[#00BDA6] font-semibold">
                      Sign in
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

export default RegistrationForm;