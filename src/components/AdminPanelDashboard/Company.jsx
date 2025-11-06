import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Trash2, Search, Loader2 } from "lucide-react";

const API_BASE_URL = "http://localhost:5000/api/companies";

export default function Company({ isDarkMode }) {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // Apply/remove dark mode class on root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  // Fetch all companies initially and on search reset
  const fetchAllCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(API_BASE_URL);
      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setCompanies(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllCompanies();
  }, [fetchAllCompanies]);

  // Debounced search effect (500ms delay)
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!searchTerm.trim()) {
        fetchAllCompanies();
        return;
      }
      try {
        setSearching(true);
        const response = await fetch(
          `${API_BASE_URL}/search/${encodeURIComponent(searchTerm)}`
        );
        if (!response.ok)
          throw new Error(`Search failed: ${response.status}`);
        const data = await response.json();
        setCompanies(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error searching companies:", error);
        setCompanies([]);
      } finally {
        setSearching(false);
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [searchTerm, fetchAllCompanies]);

  // Handler for removing a company
  const handleRemoveCompany = async (id) => {
    const companyName = companies.find(c => c.id === id)?.company_name || `ID ${id}`;
    if (!window.confirm(`Are you sure you want to remove ${companyName}?`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete company");
      setCompanies(current => current.filter(c => c.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
      alert("Failed to delete company");
    }
  };

  return (
    <main
      className={`min-h-screen p-4 sm:p-8 font-inter transition-colors duration-500 ${
        isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header */}
        <div className="text-4xl font-extrabold flex items-center gap-3">
          <Users className="w-8 h-8 text-indigo-500" />
          Manage Companies
        </div>

        {/* Search Bar */}
        <div
          className={`p-4 shadow-md rounded-lg border transition-colors duration-300 ${
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"
          }`}
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-400 outline-none ${
                isDarkMode
                  ? "bg-gray-700 text-gray-100 border-gray-600 placeholder-gray-400"
                  : "bg-white text-gray-900 border-gray-300 placeholder-gray-400"
              }`}
              autoFocus
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className={`rounded-lg shadow-md p-6 animate-pulse ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                }`}
              ></div>
            ))
          ) : companies.length > 0 ? (
            companies.map((company) => (
              <motion.div
                key={company.id}
                layout
                className={`p-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 cursor-pointer shadow-md hover:shadow-lg transition-all ${
                  isDarkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold truncate">{company.company_name || company.name}</h3>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <Users className="w-4 h-4" />
                  <span>{company.hires || 0} Hires</span>
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
            ))
          ) : (
            <p>No companies found.</p>
          )}
        </div>
      </div>
    </main>
  );
}
