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
          // Log specific server-side errors
          console.log(
            "Error fetching students:",
            data.message || "Invalid data structure."
          );
          setStudents([]); // Ensure students is an empty array on failure
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
        // Optionally set a user-facing error state here
      });
  }, []);

  // Navigation handlers wrap around the array
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? students.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === students.length - 1 ? 0 : prev + 1));
  };

  const currentStudent = students[currentIndex];

  // Destructure for cleaner JSX
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
  } = currentStudent || {}; // Use || {} to prevent errors if currentStudent is undefined initially or during loading

  // Conditional Rendering Logic
  let content;
  if (loading) {
    // Loading State (Pulsing Skeleton) - Keep the original excellent structure
    content = (
      <div className="w-full max-w-lg border p-6 rounded-lg shadow-md bg-gray-50 animate-pulse">
        <div className="mx-auto mb-4 rounded-full h-28 w-28 bg-gray-300"></div>
        <div className="h-6 w-3/4 bg-gray-300 mb-4 mx-auto rounded"></div>
        <div className="grid grid-cols-2 gap-y-3 text-sm">
          {Array.from({ length: 8 }).map((_, idx) => (
            <React.Fragment key={idx}>
              <span className="font-medium bg-gray-300 h-4 w-24 rounded inline-block"></span>
              <span className="bg-gray-200 h-4 w-32 rounded inline-block"></span>
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  } else if (!students.length) {
    // No Students Found State
    content = <p className="p-6 text-xl font-medium">No students found 😢</p>;
  } else {
    // Student Card View
    content = (
      <>
        <button
          onClick={handlePrev}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Previous Student"
        >
          ❮
        </button>

        <div className="w-full max-w-lg border p-6 rounded-lg shadow-xl bg-white transition-shadow duration-300 hover:shadow-2xl">
          <img
            // Use safeData for image URL in case it's missing or null
            src={
              safeData(image) !== "N/A"
                ? image
                : "https://via.placeholder.com/150/EEEEEE/808080?text=No+Image"
            }
            alt={safeData(name)}
            className="mx-auto mb-4 rounded-full h-28 w-28 object-cover border-4 border-indigo-500/50"
          />
          <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
            {safeData(name)}
          </h2>

          <h3 className="text-xl font-bold mt-4 mb-3 border-b pb-1 text-gray-700">
            Personal Information 🧑‍💻
          </h3>
          <div className="grid grid-cols-2 gap-y-3 text-base">
            <span className="font-semibold text-gray-600">Full Name</span>
            <span>{safeData(full_name)}</span>

            <span className="font-semibold text-gray-600">Email</span>
            <span className="truncate">{safeData(email)}</span>

            <span className="font-semibold text-gray-600">Contact Number</span>
            <span>{safeData(contact_number)}</span>

            <span className="font-semibold text-gray-600">LinkedIn URL</span>
            {safeData(linkedin_url) !== "N/A" ? (
              <a
                href={linkedin_url}
                className="text-blue-600 hover:text-blue-800 underline transition-colors truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span>N/A</span>
            )}

            <span className="font-semibold text-gray-600">GitHub URL</span>
            {safeData(github_url) !== "N/A" ? (
              <a
                href={github_url}
                className="text-blue-600 hover:text-blue-800 underline transition-colors truncate"
                target="_blank"
                rel="noopener noreferrer"
              >
                Link
              </a>
            ) : (
              <span>N/A</span>
            )}

            <span className="font-semibold text-gray-600">
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

          <h3 className="text-xl font-bold mt-6 mb-3 border-b pb-1 text-gray-700">
            Career Snapshot 🚀
          </h3>
          <div className="flex flex-col space-y-4 text-base">
            <div>
              <span className="font-semibold text-gray-600 block mb-1">
                Why Hire Me
              </span>
              <p className="p-3 bg-gray-100 rounded-md border text-sm italic">
                {safeData(why_hire_me)}
              </p>
            </div>
            <div>
              <span className="font-semibold text-gray-600 block mb-1">
                AI Skill Summary
              </span>
              <p className="p-3 bg-gray-100 rounded-md border text-sm italic">
                {safeData(ai_skill_summary)}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleNext}
          className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100 transition-colors"
          aria-label="Next Student"
        >
          ❯
        </button>
      </>
    );
  }

  // --- Render Section ---
  return (
    <div className="mt-14 flex min-h-screen">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Sidebar />

      <div className="flex flex-col flex-grow bg-gray-50 dark:bg-gray-900 transition-colors">
        <main className="flex-grow py-12 px-6 lg:px-12 overflow-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold mb-2 text-gray-900 dark:text-white">
              Multi-Student View 🧑‍🎓
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Monitor and manage all your students with their essential details
              using the carousel view.
            </p>
          </div>

          {/* Student Card Container */}
          <div className="mt-16 flex items-start justify-center space-x-6 min-h-[500px]">
            {content}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MultiStudent;
