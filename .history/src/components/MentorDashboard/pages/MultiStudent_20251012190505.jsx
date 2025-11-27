import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";

// Helper function to safely display data or default to "N/A"
const safeData = (data) => (data ? data : "N/A");

const MultiStudent = ({ isDarkMode, setIsDarkMode }) => {
  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/api/profiles")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setStudents(data.data);
        } else {
          console.log(
            "Error fetching students:",
            data.message || "Invalid data structure."
          );
          setStudents([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === students.length - 1 ? 0 : prev + 1));
  };

  const currentStudent = students[currentIndex];

  // Destructure with a default empty object to avoid errors if currentStudent is undefined
  const {
    image,
    name,
    full_name,
    email,
    contact_number,
    linkedin_url,
    github_url,
    why_hire_me,
    ai_skill_summary,
    profile_completed,
  } = currentStudent || {};

  // Conditional Rendering Logic (similar to the previous suggestion, but with dark mode classes)
  let content;
  if (loading) {
    // Loading State (Pulsing Skeleton)
    content = (
      <div className="w-full max-w-lg border p-6 rounded-lg shadow-md bg-gray-50 dark:bg-gray-700 animate-pulse dark:border-gray-600">
        <div className="mx-auto mb-4 rounded-full h-28 w-28 bg-gray-300 dark:bg-gray-500"></div>
        <div className="h-6 w-3/4 bg-gray-300 dark:bg-gray-500 mb-4 mx-auto rounded"></div>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {Array.from({ length: 8 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium bg-gray-300 h-4 w-24 rounded inline-block dark:bg-gray-500"></span>
              <span className="bg-gray-200 h-4 w-32 rounded inline-block dark:bg-gray-600"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  } else if (!students.length) {
    // No Students Found State
    content = (
      <p className="p-6 text-xl font-medium text-gray-700 dark:text-gray-300">
        No students found 😢
      </p>
    );
  } else {
    // Student Card View
    content = (
      <>
        {/* Previous Button - Dark Mode */}
        <button
          onClick={handlePrev}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700 dark:text-white transition-colors"
          aria-label="Previous Student"
        >
          ❮
        </button>

        {/* Student Card - Dark Mode */}
        <div className="w-full max-w-lg border p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 dark:border-gray-700 dark:shadow-2xl transition-shadow duration-300">
          <h3 className="text-xl font-bold mt-4 mb-3 border-b pb-1 text-gray-700 dark:text-gray-300 dark:border-gray-600">
            Personal Information 🧑‍💻
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-base">
            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Full Name
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {safeData(full_name)}
            </span>

            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Email
            </span>
            <span className="truncate text-gray-900 dark:text-gray-100">
              {safeData(email)}
            </span>

            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Contact Number
            </span>
            <span className="text-gray-900 dark:text-gray-100">
              {safeData(contact_number)}
            </span>

            <span className="font-semibold text-gray-600 dark:text-gray-400">
              LinkedIn URL
            </span>
            {safeData(linkedin_url) !== "N/A" ? (
              <a
                href={linkedin_url}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline transition-colors truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">N/A</span>
            )}

            <span className="font-semibold text-gray-600 dark:text-gray-400">
              GitHub URL
            </span>
            {safeData(github_url) !== "N/A" ? (
              <a
                href={github_url}
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline transition-colors truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span className="text-gray-500 dark:text-gray-400">N/A</span>
            )}

            <span className="font-semibold text-gray-600 dark:text-gray-400">
              Profile Completed
            </span>
            <span
              className={`font-bold ${
                profile_completed ? "text-green-600" : "text-red-600"
              }`}
            >
              {profile_completed ? "Yes ✅" : "No ❌"}
            </span>
          </div>

          <h3 className="text-xl font-bold mt-6 mb-3 border-b pb-1 text-gray-700 dark:text-gray-300 dark:border-gray-600">
            Career Snapshot 🚀
          </h3>
          <div className="flex flex-col space-y-4 text-base">
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                Why Hire Me
              </span>
              <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600 text-sm italic text-gray-800 dark:text-gray-200">
                {safeData(why_hire_me)}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-600 dark:text-gray-400 block mb-1">
                AI Skill Summary
              </span>
              <p className="p-3 bg-gray-100 dark:bg-gray-700 rounded-md border dark:border-gray-600 text-sm italic text-gray-800 dark:text-gray-200">
                {safeData(ai_skill_summary)}
              </p>
            </div>
          </div>
        </div>

        {/* Next Button - Dark Mode */}
        <button
          onClick={handleNext}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 dark:border-gray-500 dark:hover:bg-gray-700 dark:text-white transition-colors"
          aria-label="Next Student"
        >
          ❯
        </button>
      </>
    );
  }

  // The outer div should respect the dark mode prop passed to it, usually by
  // conditionally setting the 'dark' class on the HTML or body element,
  // but here we are applying classes directly to the component wrapper.

  return (
    // Step 1: Conditionally set the 'dark' class on the top-level container
    // However, the standard practice in Tailwind is to set 'dark' on the html tag.
    // For simplicity in the component, we'll apply dark background/text classes here.
    <div className={`mt-14 flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {/* Assuming Sidebar handles its own dark mode internally */}
      <Sidebar />

      {/* Main content background now uses dark:bg-gray-900 */}
      <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 transition-colors">
        <main className="flex-grow py-12 px-6 lg:px-12 overflow-auto">
          <div className="text-center">
            {/* Text color now uses dark:text-white and dark:text-gray-400 */}
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white">
              Multi-Student View 🧑‍🎓
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Monitor and manage all your students with their essential details
              using the carousel view.
            </p>
          </div>

          <div className="mt-16 flex items-start justify-center space-x-6 min-h-[500px]">
            {content}
          </div>
        </main>

        {/* Assuming Footer handles its own dark mode internally */}
        <Footer />
      </div>
    </div>
  );
};

export default MultiStudent;
