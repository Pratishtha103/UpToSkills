import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProgramsSection = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("❌ Failed to fetch courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Shimmer animation CSS (inline via Tailwind + custom style tag)
  const shimmerStyle = `
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    .shimmer {
      background: linear-gradient(
        90deg,
        rgba(200, 230, 255, 0.3) 0%,
        rgba(180, 220, 255, 0.8) 50%,
        rgba(200, 230, 255, 0.3) 100%
      );
      background-size: 2000px 100%;
      animation: shimmer 1.8s infinite linear;
    }
    .dark .shimmer {
      background: linear-gradient(
        90deg,
        rgba(51, 65, 85, 0.3) 0%,
        rgba(71, 85, 105, 0.7) 50%,
        rgba(51, 65, 85, 0.3) 100%
      );
    }
  `;

  // 🔹 Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md">
      <div className="h-40 shimmer rounded-lg mb-4"></div>
      <div className="h-5 shimmer rounded w-3/4 mb-2"></div>
      <div className="h-4 shimmer rounded w-full mb-2"></div>
      <div className="h-4 shimmer rounded w-5/6 mb-4"></div>
      <div className="h-10 shimmer rounded-md"></div>
    </div>
  );

  return (
    <section id="programs" className="py-8 px-4 relative">
      {/* Inject shimmer CSS */}
      <style>{shimmerStyle}</style>

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[32px] font-bold mb-4 mt-12 dark:text-white">Our Programs</h2>
        <p className="text-[#64748b] dark:text-slate-300 text-[17px] mb-12">
          Discover our expertly designed programs to master in-demand tech skills
          through hands-on projects and mentorship from industry professionals.
        </p>

        {/* 🔹 Error Message */}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {/* 🔹 Shimmer Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* 🔹 Actual Course Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((program, index) => (
              <div
                className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-4 hover:shadow-lg"
                key={index}
              >
                {/* Uncomment if you have images */}
                {/* <img
                  src={program.image_path}
                  alt={program.title}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                /> */}
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{program.title}</h3>
                <p className="text-[#64748b] dark:text-slate-300 text-[15px] leading-snug mb-3">
                  {program.description}
                </p>
                <Link
                  to={`/programForm/${program.id}`}
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300"
                >
                  Enroll Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProgramsSection;
