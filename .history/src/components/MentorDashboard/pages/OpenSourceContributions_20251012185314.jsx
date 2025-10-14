import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

function OpenSourceContributions() {
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
      <Header />
      <Sidebar />

      <div className="flex flex-col flex-grow">
        <main className="px-8 lg:px-12 py-10 flex-grow w-full">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Open Source Contributions
          </h1>
          <p className="text-center text-gray-600 mb-8 max-w-3xl mx-auto">
            Monitor, review and approve your student’s commits, pull requests,
            and milestones across open-source platforms.
          </p>

          <section className="mb-10">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
                <thead className="bg-gray-100 text-gray-700 text-sm uppercase tracking-wide">
                  <tr>
                    <th className="px-6 py-4 text-left">Project Title</th>
                    <th className="px-6 py-4 text-left">Total Students</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    Array.from({ length: 4 }).map((_, idx) => (
                      <tr key={idx} className="animate-pulse">
                        <td className="px-6 py-4 bg-gray-200">&nbsp;</td>
                        <td className="px-6 py-4 bg-gray-200">&nbsp;</td>
                      </tr>
                    ))
                  ) : projects.length === 0 ? (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No projects assigned yet.
                      </td>
                    </tr>
                  ) : (
                    projects.map((proj) => (
                      <tr
                        key={proj.id}
                        className="hover:bg-gray-50 transition duration-200 ease-in-out"
                      >
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {proj.project_title}
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {proj.total_students}
                        </td>
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
