import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Building2, Users, Trash2 } from "lucide-react";

export default function Company() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/companies");
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const mappedData = data.map(company => ({
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

  const handleRemoveCompany = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to remove this company?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete company");

      setCompanies(companies.filter(company => company.id !== id));
    } catch (error) {
      console.error("Error deleting company:", error);
    }
  };

  if (loading) {
    return (
      <main className="p-4 sm:p-6 flex flex-col gap-6">
        <p>Loading companies...</p>
      </main>
    );
  }

  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage Companies
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company, index) => (
          <motion.div
            key={company.id}
            className="stat-card p-6 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -4 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-secondary">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">{company.name}</h3>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{company.hires} Hires</span>
            </div>

            <div className="flex">
              <motion.button
                onClick={() => handleRemoveCompany(company.id)}
                className="flex-1 btn-primary text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700"
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
    </main>
  );
}
