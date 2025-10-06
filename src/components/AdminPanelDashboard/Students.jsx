import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Search, Linkedin } from "lucide-react";


function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:5000/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudents(data.data);
        }
      })
      .catch((err) => console.error("Error fetching profiles:", err))
      .finally(() => setLoading(false)); // 👈 stop loading
  }, []);
  // Fetch real profiles from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/profiles")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStudents(data.data);
        }
      })
      .catch((err) => console.error("Error fetching profiles:", err));
  }, []);

  const handleDelete = async (id) => {
  const student = students.find((s) => s.id === id);
  if (!student) return;

  const confirmed = window.confirm(`Are you sure you want to remove "${student.full_name}"?`);

  if (!confirmed) return;

  try {
    // Optimistically remove from UI
    setStudents(prev => prev.filter(s => s.id !== id));

    // Delete from backend
const response = await fetch(`http://localhost:5000/api/profile/${id}`, {
  method: 'DELETE',
});


    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      // rollback UI if delete fails
      setStudents(prev => [...prev, student]);
    }
  } catch (err) {
    console.error(err);
    alert('Failed to delete student');
    // rollback UI if request fails
    setStudents(prev => [...prev, student]);
  }
};




  return (
    <main className="p-4 sm:p-6 flex flex-col gap-6">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Manage Students
      </motion.h2>

      {/* Search Bar */}
      <motion.div
        className="stat-card p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="input-field pl-12 w-full"
          />
        </div>
      </motion.div>
      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading
          ? // show skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <motion.div
              key={index}
              className="stat-card p-6 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-gray-200 w-12 h-12" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
              <div className="h-8 bg-gray-200 rounded w-1/2" />
            </motion.div>
          ))
          : // show real students
          students
            .filter((s) =>
              s.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((student, index) => (
              <motion.div
                key={student.id}
                className="stat-card p-6 cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-primary">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {student.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {Array.isArray(student.domains_of_interest)
                        ? student.domains_of_interest.join(", ")
                        : student.domains_of_interest || "No domain"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {student.linkedin_url ? (
                    <a
                      href={student.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="font-medium pt-1">LinkedIn Profile</span>
                    </a>
                  ) : (
                    <span className="text-gray-400 text-sm">No LinkedIn</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(student.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </motion.div>
            ))}
      </div>
    </main>
  );
}


export default Students;
