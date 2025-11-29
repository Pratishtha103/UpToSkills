import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

function OpenSourceContributions({ isDarkMode, setIsDarkMode }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const mentor = JSON.parse(localStorage.getItem("mentor"));
  const mentorId = mentor?.id;

  useEffect(() => {
    if (!mentorId) return;
    fetch("http://localhost:5000/api/mentor_projects")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const myProjects = data.data.filter(
            (proj) => proj.mentor_id === mentorId
          );
          setProjects(myProjects);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
        setLoading(false);
      });
  }, [mentorId]);

  return (
    <div className="mt-14 flex min-h-screen">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Sidebar isDarkMode={isDarkMode} />

      <div className="flex flex-col flex-grow bg-gray-50 dark:bg-gray-900">
        <main className="px-8 lg:px-12 py-10 flex-grow w-full">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800 dark:text-gray-300">
            My Programs
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Manage and track all programs created by mentors.
          </p>

          <section className="mb-10">
            <div className="overflow-x-auto">
              <table className="min-w-full text-gray-600 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl overflow-hidden">
                <thead className="text-sm uppercase tracking-wide bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Program Title</th>
                    <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Total Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-6 py-4 bg-gray-200 dark:bg-gray-700">&nbsp;</td>
                        <td className="px-6 py-4 bg-gray-200 dark:bg-gray-700">&nbsp;</td>
                      </tr>
                    ))
                  ) : projects.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                        No projects assigned yet.
                      </td>
                    </tr>
                  ) : (
                    projects.map((proj) => (
                      <tr key={proj.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition duration-200 ease-in-out">
                        <td className="px-6 py-4 font-medium text-gray-700 dark:text-gray-200">{proj.project_title}</td>
                        <td className="px-6 py-4 text-gray-700 dark:text-gray-200">{proj.total_students}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </main>
        {/* Footer stays below content, adjusts with sidebar */}
        <Footer />
      </div>
    </div>
  );
}

export default OpenSourceContributions;