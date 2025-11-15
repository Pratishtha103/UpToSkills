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
        // Optional: simulate loading delay to test shimmer
        // await new Promise(res => setTimeout(res, 1500));
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

  // 🌈 Enhanced Shimmer Animation
  const shimmerStyle = `
    @keyframes shimmerMove {
      0% { background-position: -1000px 0; opacity: 0.9; }
      50% { opacity: 1; }
      100% { background-position: 1000px 0; opacity: 0.9; }
    }

    @keyframes pulseGlow {
      0%, 100% { box-shadow: 0 0 10px rgba(59, 130, 246, 0.15); }
      50% { box-shadow: 0 0 25px rgba(59, 130, 246, 0.25); }
    }

    .shimmer {
      background: linear-gradient(
        90deg,
        rgba(230, 240, 255, 0.4) 0%,
        rgba(200, 220, 255, 0.9) 50%,
        rgba(230, 240, 255, 0.4) 100%
      );
      background-size: 2000px 100%;
      animation: shimmerMove 1.6s infinite linear, pulseGlow 2.8s ease-in-out infinite;
      border-radius: 0.5rem;
    }

    .dark .shimmer {
      background: linear-gradient(
        90deg,
        rgba(51, 65, 85, 0.3) 0%,
        rgba(71, 85, 105, 0.8) 50%,
        rgba(51, 65, 85, 0.3) 100%
      );
      animation: shimmerMove 1.6s infinite linear, pulseGlow 2.8s ease-in-out infinite;
    }
  `;

  // 🧱 Skeleton Card Component
  const SkeletonCard = () => (
    <div className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md overflow-hidden relative">
      <div className="h-40 shimmer mb-4"></div>
      <div className="h-5 shimmer w-3/4 mb-2"></div>
      <div className="h-4 shimmer w-full mb-2"></div>
      <div className="h-4 shimmer w-5/6 mb-4"></div>
      <div className="h-10 shimmer w-full"></div>
    </div>
  );

  return (
    <section id="programs" className="py-8 px-4 relative">
      {/* Inject shimmer styles */}
      <style>{shimmerStyle}</style>

      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[32px] font-bold mb-4 mt-12 dark:text-white">
          Courses We Offer
        </h2>
        <p className="text-[#64748b] dark:text-slate-300 text-[17px] mb-12">
          Discover our expertly designed courses to master in-demand tech skills
          through hands-on projects and mentorship from industry professionals.
        </p>

        {/* Error Message */}
        {error && <p className="text-red-500 text-lg">{error}</p>}

        {/* 🌈 Loading Shimmer Grid */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* ✅ Loaded Courses */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {courses.map((program, index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#1e293b] p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-3 transition-all duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 dark:text-white">
                  {program.title}
                </h3>
                <p className="text-[#64748b] dark:text-slate-300 text-[15px] leading-snug mb-3">
                  {program.description}
                </p>
                <Link
                  to={`/programForm/${program.id}`}
                  className="inline-block bg-blue-500 text-white py-2 px-5 rounded-md font-semibold hover:bg-blue-600 transition-colors duration-300"
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
