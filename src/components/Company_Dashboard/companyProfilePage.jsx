import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Navbar";
import Footer from "../AboutPage/Footer";
import { useNavigate } from "react-router-dom";
import { BriefcaseIcon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

const CompanyProfilePage = () => {
  const { darkMode } = useTheme(); // getting dark mode from context
  const [isOpen, setIsOpen] = useState(true); // sidebar open/close state
  const [companyData, setCompanyData] = useState(null); // storing company profile data
  const [loading, setLoading] = useState(true); // loading animation state
  const [error, setError] = useState(""); // error handling
  const navigate = useNavigate();

  const toggleSidebar = () => setIsOpen((prev) => !prev); // sidebar toggle

  useEffect(() => {
    // fetching company profile when page loads
    const fetchCompanyProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token"); // getting token from local storage
        if (!token) {
          setCompanyData({});
          setLoading(false);
          return;
        }

        // API call to get company details
        const res = await axios.get(
          "http://localhost:5000/api/company-profiles/me",
          { headers: { Authorization: `Bearer ${token} `} }
        );

        // checking success response
        if (res.data.success) {
          setCompanyData(res.data.data);
        } else {
          setError(res.data.message || "Failed to load profile.");
        }
      } catch (err) {
        setCompanyData({});
        setError("Failed to load profile.");
      } finally {
        setLoading(false); // stop loading
      }
    };

    fetchCompanyProfile();
  }, []); // runs once on page load

  
  return (
    // main layout wrapper
    <div className={`flex h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>

      {/* Sidebar (opens & closes) */}
      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
      )}

      <div className={`flex-1 flex flex-col overflow-hidden ${isOpen ? "lg:ml-64" : "ml-0"}`}>
        
        {/* Top navbar */}
        <Header onMenuClick={toggleSidebar} />

        {/* Main Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-20 p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
          <motion.button
            onClick={() => navigate("/company")}
            className="flex items-center gap-2 my-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            whileHover={{ scale: 1.05, x: -3 }}
            whileTap={{ scale: 0.95 }}
          >
          </motion.button>
          {/* Profile Data Section */}
          <div className="max-w-6xl mx-auto">
            {loading ? (
              // if data is loading
              <p className="text-gray-600 dark:text-gray-400 m-6">Loading...</p>
            ) : error ? (
              // if error exists
              <p className="text-red-500 m-6">{error}</p>
            ) : companyData ? (
              // if data loaded successfully
              <div className="flex w-full justify-center">
                <div className="grid grid-cols-1 gap-6">
                  <div className=" dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full max-w-4xl border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl">

                    {/* Card Header */}
                    <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-3 flex items-center justify-between">
                      <h1 className="text-3xl font-bold text-gray-800 dark:text-white tracking-tight">
                        Company Profile
                      </h1>
                      <BriefcaseIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>

                    {/* Card Sections */}
                    <div className="space-y-8">

                      {/* Logo Section */}
                      {companyData.logo_url && (
                        <section aria-labelledby="logo-heading">
                          <div className="flex flex-col items-center gap-3">

                            {/* Username */}
                            {companyData.username && (
                              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                {companyData.username}
                              </h3>
                            )}

                            {/* Logo Image */}
                            <div className="flex justify-center py-1 rounded-full">
                              <div className="p-3 border border-gray-200 dark:border-gray-700 rounded-full dark:bg-gray-900 shadow-md transition-all duration-300 hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]">
                                <img
                                  src={`http://localhost:5000${companyData.logo_url}`}
                                  alt={`${companyData.name || companyData.company_name || "Company"} Logo`}
                                  className="h-28 w-28 object-cover rounded-full"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                        </section>
                      )}

                      {/* Basic Information Section */}
                      <section aria-labelledby="basic-info-heading">
                        <h2
                          id="basic-info-heading"
                          className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 border-l-4 border-blue-500 pl-3"
                        >
                          Basic Information
                        </h2>

                        {/* All information fields */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
                          <Info label="Company Name :- " value={companyData.name || companyData.company_name} defaultText="N/A" />
                          <Info label="Industry :- " value={companyData.industry} defaultText="N/A" />
                          <Info label="Website :- " value={companyData.website} defaultText="Not provided" isLink={true} />
                          <Info label="Contact Email :- " value={companyData.email} defaultText="Not provided" isLink={true} linkPrefix="mailto:" />
                          <Info label="Phone Number :- " value={companyData.phone} defaultText="Not provided" isLink={true} linkPrefix="tel:" />
                          <Info label="General Contact :- " value={companyData.contact} defaultText="Not provided" />
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Footer section */}
          <div className="mt-8">
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

// Shows label and value cleanly 
const Info = ({
  label,
  value,
  defaultText = "—",
  isLink = false,
  linkPrefix = "",
}) => {
  if (!value) value = defaultText;

  return (
    <div className="flex gap-2 items-center">
      <label className="block text-sm font-bold text-gray-600 dark:text-gray-400">
        {label}
      </label>

      {isLink ? (
        // clickable link (website, phone, email)
        <a
          href={`${linkPrefix}${value}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          {value}
        </a>
      ) : (
        <p className="text-gray-800 dark:text-white whitespace-pre-wrap">
          {value}
        </p>
      )}
    </div>
  );
};

export default CompanyProfilePage;
