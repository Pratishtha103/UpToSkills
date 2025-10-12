import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Trash2, Sun, Moon } from "lucide-react";

export default function Company({ isDarkMode }) {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isDarkMode, setIsDarkMode] = useState(false);

  // 🌗 Apply dark or light mode to document root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  // 🔁 Fetch companies
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

  // 🗑️ Remove company
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

        {/* 🌗 Theme Toggle */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDarkMode((prev) => !prev)}
          className="p-2 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.button>
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

            <motion.button
              onClick={() => handleRemoveCompany(company.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Trash2 className="w-4 h-4" />
              Remove
            </motion.button>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
