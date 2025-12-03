import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MyPrograms = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentId =
    localStorage.getItem("id") ||
    localStorage.getItem("studentId") ||
    localStorage.getItem("userId");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!studentId || !token) {
      setError("Please log in to view your enrolled programs.");
      setLoading(false);
      return;
    }

    const fetchPrograms = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/enrollments/mycourses/${studentId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();

        if (Array.isArray(data.courses)) {
          setPrograms(data.courses);
        } else {
          setPrograms([]);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, [studentId, token]);

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div className="flex flex-col flex-1 lg:ml-64 transition-all duration-300">
        <Header />

        <main className="flex-1 p-8 mt-24">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
            <h1 className="text-3xl font-bold mb-4 md:mb-0">My Programs</h1>

            <div className="flex gap-4">
              <button className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                Filter
              </button>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <p className="text-center text-gray-500">Loading programs...</p>
          )}

          {/* Error */}
          {error && !loading && (
            <p className="text-center text-red-500 font-semibold">{error}</p>
          )}

          {/* Empty */}
          {!loading && programs.length === 0 && !error && (
            <p className="text-center text-gray-500">
              You are not enrolled in any programs.
            </p>
          )}

          {/* Program Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((program) => (
              <div
                key={program.id}
                className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 hover:shadow-lg transition"
              >
                <h2 className="text-xl font-semibold mb-2">
                  {program.title}
                </h2>

                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {program.description || "No description available"}
                </p>

                
              </div>
            ))}
          </div>
        </main>

        <footer className="bg-gray-900 text-gray-300 border-t border-gray-700 py-4 text-center">
          <p className="text-sm">© 2025 UpToSkills. Built by learners.</p>
        </footer>
      </div>
    </div>
  );
};

export default MyPrograms;
