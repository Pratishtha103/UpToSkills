import React, { useMemo, useState, useEffect } from 'react';
import { FaCloud, FaShieldAlt, FaLaptopCode, FaChartLine, FaSearch, FaTags, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// Metadata for programs (kept local for now)
const programs = [
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    desc:
      'Master Cloud platforms (AWS/Azure/GCP), Docker, Kubernetes and cloud security with hands-on labs.',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
    icon: FaCloud,
    path: '/cloud-computing',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    desc:
      'Learn ethical hacking, threat analysis, digital forensics and defensive techniques to secure systems.',
    skills: ['Ethical Hacking', 'Forensics', 'Cryptography'],
    icon: FaShieldAlt,
    path: '/cyber-security',
  }, 
  {
    id: 'web-development',
    title: 'Web Development',
    desc:
      'Full-stack web development with modern frontend and backend technologies, deployment and testing.',
    skills: ['React', 'Node.js', 'HTML', 'CSS'],
    icon: FaLaptopCode,
    path: '/web-development',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    desc:
      'Data analysis, visualization and machine learning with Python, pandas, and scikit-learn.',
    skills: ['Python', 'Pandas', 'Machine Learning'],
    icon: FaChartLine,
    path: '/data-science',
  },
];

export default function ProgramsAdmin({ isDarkMode, onNavigateSection }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const clearAllFilters = () => {
    setQuery('');
    setSelectedTag(null);
  };

  const [showAllTags, setShowAllTags] = useState(false);
  const allTags = useMemo(() => {
    const s = new Set();
    programs.forEach(p => p.skills.forEach(sk => s.add(sk)));
    const extraTags = ['HTML', 'CSS', 'JS', 'React js', 'AI', 'DevOps', 'Blockchain', 'UI/UX'];
    extraTags.forEach(tag => s.add(tag));
    return Array.from(s);
  }, []);

  // Fetch courses
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/courses");
        setCourses(response.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Delete course
  const removeCourse = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  const filteredPrograms = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter(p => {
      const matchesQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q) ||
        p.skills.join(' ').toLowerCase().includes(q);
      const matchesTag = !selectedTag || p.skills.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter(course => {
      const matchesQuery =
        !q ||
        course.title?.toLowerCase().includes(q) ||
        course.description?.toLowerCase().includes(q) ||
        (Array.isArray(course.skills) &&
          course.skills.join(' ').toLowerCase().includes(q));
      const matchesTag =
        !selectedTag ||
        (Array.isArray(course.skills) && course.skills.includes(selectedTag));
      return matchesQuery && matchesTag;
    });
  }, [courses, query, selectedTag]);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen p-6`}>
      <header className="mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Courses</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overview of all courses and quick actions.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateSection && onNavigateSection('dashboard')} className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-sm border`}>← Back</button>
            <button onClick={() => onNavigateSection && onNavigateSection('courses')} className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">New Course</button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-2/3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
              <FaSearch className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or skill..."
                className={`w-full px-4 py-2 rounded-md border ${isDarkMode
                  ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {(query || selectedTag) && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm px-4 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600 transition"
                >
                  Clear All ✕
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}
            >
              <FaTags className="mr-2" />Tags:
            </span>

            {(showAllTags ? allTags : allTags.slice(0, 8)).map(tag => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`text-sm px-3 py-1 rounded-full border ${selectedTag === tag
                  ? 'bg-indigo-600 text-white'
                  : isDarkMode
                    ? 'bg-gray-800 text-gray-300'
                    : 'bg-white text-gray-700'
                  }`}
              >
                {tag}
              </button>
            ))}

            {allTags.length > 8 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className={`text-sm px-3 py-1 rounded-full border-dashed ${isDarkMode ? 'text-indigo-400 border-indigo-400' : 'text-indigo-600 border-indigo-600'
                  }`}
              >
                {showAllTags ? 'Show Less' : 'Show More'}
              </button>
            )}
          </div>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Render filtered programs */}
          {filteredPrograms.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                  } rounded-2xl p-8 lg:p-10 shadow hover:shadow-lg transition`}
              >
                <div className="flex items-start gap-6">
                  <div
                    className={`${isDarkMode ? 'bg-gray-900' : 'bg-indigo-50'
                      } p-4 rounded-xl text-indigo-600`}
                  >
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-semibold mb-2">{p.title}</h3>
                    <p
                      className={`text-sm lg:text-base mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                    >
                      {p.desc}
                    </p>

                    <div className="flex flex-wrap gap-3 mb-2">
                      {p.skills.map((sk) => (
                        <span
                          key={sk}
                          className={`text-sm px-3 py-1 rounded-full ${isDarkMode
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeCourse(p.id)}
                  className="flex items-center gap-1 border border-gray-100 px-3 py-1 bg-red-600 text-white rounded-full text-sm"
                >
                  <FaTrash className="w-4 h-4" /> Delete
                </button>
              </div>
            );
          })}

          {/* Render courses fetched from API */}
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
                } rounded-2xl p-8 lg:p-10 shadow hover:shadow-lg transition`}
            >
              <div className="flex items-start gap-6">
                {/* Display course image or fallback to icon */}
                {course.image_path ? (
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={`http://localhost:5000${course.image_path}`}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div
                    className={`${isDarkMode ? 'bg-gray-900' : 'bg-indigo-50'
                      } p-4 rounded-xl text-indigo-600`}
                  >
                    <FaLaptopCode className="w-8 h-8" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl lg:text-2xl font-semibold mb-2">
                    {course.title}
                  </h3>
                  <p
                    className={`text-sm lg:text-base mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      }`}
                  >
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {Array.isArray(course.skills) && course.skills.length > 0 ? (
                      course.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm italic text-gray-500 dark:text-gray-400">
                        No skills listed
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeCourse(course.id)}
                    className="flex items-center gap-1 border border-gray-100 px-3 py-1 bg-red-600 text-white rounded-full text-sm"
                  >
                    <FaTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {/* Show message when no courses */}
          {filteredPrograms.length === 0 &&
            filteredCourses.length === 0 &&
            !loading && (
              <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
                No results found for this tag.
              </p>
            )}
        </div>
      </section>
    </main>
  );
}