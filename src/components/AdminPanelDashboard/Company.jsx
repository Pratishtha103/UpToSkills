import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Building2, Users, Trash2, Eye, X, Mail, Phone, Globe, Briefcase, Calendar, Loader2 } from "lucide-react";

export default function Company({ isDarkMode }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyDetails, setCompanyDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Apply dark or light mode to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companies");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const mappedData = data.map((company) => ({
          id: company.id,
          name: company.company_name,
          hires: 0,
        }));
        setCompanies(mappedData);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  // Fetch company details
  const fetchCompanyDetails = async (companyId) => {
    try {
      setLoadingDetails(true);
      setSelectedCompany(companyId);
      const res = await fetch(`http://localhost:5000/api/companies/${companyId}/details`);
      const data = await res.json();
      if (data.success) {
        setCompanyDetails(data.data);
      } else {
        alert("Failed to load company details");
        setSelectedCompany(null);
      }
    } catch (err) {
      console.error("Error fetching company details:", err);
      alert("Error loading company details");
      setSelectedCompany(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  const closeModal = () => {
    setSelectedCompany(null);
    setCompanyDetails(null);
  };

  // Remove company
  const handleRemoveCompany = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this company?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/companies/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) throw new Error("Failed to delete company");

      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return (
      <main className="p-4 sm:p-6 flex flex-col gap-6 text-foreground">
        <p>Loading companies...</p>
      </main>
    );
  }

  return (
    <main
      className={`${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } flex-grow p-4 sm:p-6 flex flex-col gap-8 transition-colors duration-300`}
    >
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2
          className="text-2xl font-bold text-foreground"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Manage Companies
        </motion.h2>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer shadow-md hover:shadow-lg transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">{company.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{company.hires} Hires</span>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => fetchCompanyDetails(company.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-4 h-4" />
                View
              </motion.button>
              <motion.button
                onClick={() => handleRemoveCompany(company.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Company Details Modal */}
      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl ${
                isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              {/* Modal Header */}
              <div className={`sticky top-0 z-10 p-6 border-b flex justify-between items-center ${
                isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
              }`}>
                <h2 className="text-2xl font-bold">Company Details</h2>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {loadingDetails ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                  </div>
                ) : companyDetails ? (
                  <div className="space-y-6">
                    {/* Company Info Section */}
                    <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Company Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Company Name</p>
                          <p className="font-semibold">{companyDetails.company.company_name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {companyDetails.company.email}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {companyDetails.company.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Registered Since</p>
                          <p className="font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(companyDetails.company.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Company Profile if exists */}
                      {companyDetails.profile && (
                        <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {companyDetails.profile.website && (
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Website</p>
                                <a href={companyDetails.profile.website} target="_blank" rel="noopener noreferrer" className="font-semibold text-blue-500 hover:underline flex items-center gap-2">
                                  <Globe className="w-4 h-4" />
                                  Visit Website
                                </a>
                              </div>
                            )}
                            {companyDetails.profile.industry && (
                              <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Industry</p>
                                <p className="font-semibold flex items-center gap-2">
                                  <Briefcase className="w-4 h-4" />
                                  {companyDetails.profile.industry}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-blue-500">{companyDetails.stats.totalInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Interviews</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-yellow-500">{companyDetails.stats.pendingInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-green-500">{companyDetails.stats.completedInterviews}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
                      </div>
                      <div className={`p-4 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-2xl font-bold text-purple-500">{companyDetails.stats.hiredCount}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Hired</p>
                      </div>
                    </div>

                    {/* Interviews Section */}
                    {companyDetails.interviews.length > 0 && (
                      <div className={`p-6 rounded-lg ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                          <Calendar className="w-5 h-5" />
                          Interview History ({companyDetails.interviews.length})
                        </h3>
                        <div className="space-y-3">
                          {companyDetails.interviews.map((interview) => (
                            <div key={interview.id} className={`p-4 rounded-lg border ${isDarkMode ? "border-gray-600 bg-gray-800" : "border-gray-200 bg-white"}`}>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold">Student ID: {interview.student_id}</p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Date: {new Date(interview.interview_date).toLocaleDateString()}
                                  </p>
                                  {interview.feedback && (
                                    <p className="text-sm mt-2">{interview.feedback}</p>
                                  )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  interview.status === 'completed' 
                                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                    : interview.status === 'pending'
                                    ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                                    : interview.status === 'hired'
                                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200'
                                }`}>
                                  {interview.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {companyDetails.interviews.length === 0 && (
                      <div className={`p-6 rounded-lg text-center ${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
                        <p className="text-gray-500 dark:text-gray-400">No interview history available</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-center py-8">No details available</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
