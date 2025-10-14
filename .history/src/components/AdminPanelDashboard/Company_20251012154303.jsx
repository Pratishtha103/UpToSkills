// src/components/AdminPanelDashboard/Company.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building, Trash2, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/companies";

const Company = ({ isDarkMode }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const res = await fetch(API_BASE_URL);
        const data = await res.json();
        if (data.success) setCompanies(data.data);
        else setCompanies([]);
      } catch (err) {
        console.error("Error fetching companies:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this company?"))
      return;
    try {
      setIsDeleting(id);
      const res = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) setCompanies((prev) => prev.filter((c) => c.id !== id));
      else alert(data.message || "Failed to delete company");
    } catch (err) {
      console.error(err);
      alert("Error deleting company");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div
      className={`${
        isDarkMode
          ? "dark bg-gray-900 text-gray-100"
          : "bg-gray-50 text-gray-900"
      } min-h-screen p-4 sm:p-8`}
    >
      <main className="max-w-7xl mx-auto flex flex-col gap-6">
        <h2 className="text-3xl font-bold flex items-center gap-3">
          <Building className="w-8 h-8 text-indigo-600" /> Companies
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="stat-card p-6 animate-pulse rounded-2xl shadow-md"
              ></div>
            ))
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <motion.div
                key={company.id}
                layout
                className={`stat-card p-6 rounded-2xl shadow-md hover:shadow-lg transition ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 flex-shrink-0">
                    <Building className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">
                      {company.name}
                    </h3>
                    <p className="text-sm text-gray-400">{company.industry}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">{company.email}</span>
                  <button
                    onClick={() => handleDelete(company.id)}
                    disabled={isDeleting === company.id}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 shadow-md ${
                      isDeleting === company.id
                        ? "bg-red-200 text-red-700 cursor-not-allowed"
                        : "bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
                    }`}
                  >
                    {isDeleting === company.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    {isDeleting === company.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400">
              No companies found
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Company;
