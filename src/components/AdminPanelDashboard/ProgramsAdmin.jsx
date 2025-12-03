import React, { useMemo, useState, useEffect } from 'react';
import { FaLaptopCode, FaSearch, FaTags, FaTrash } from 'react-icons/fa';
import axios from 'axios';

// ⭐ TAG GROUPS YOU PROVIDED
const tagGroups = [
  ["Unity 3D", "C#", "ARCore", "ARKit", "3D Modeling", "VR Interaction Design", "Spatial Mapping", "Animation"],
  ["Hadoop", "Spark", "Hive", "Kafka", "NoSQL Databases", "Data Pipelines", "Distributed Computing", "ETL Processing"],
  ["Unity", "C# Programming", "Unreal Engine", "3D Game Design", "Animation Basics", "Game Physics", "Level Design", "AI for Games"],
  ["Excel", "SQL", "Tableau", "Power BI", "Python", "Data Cleaning", "Data Visualization", "Business Analytics"],
  ["SEO", "Google Ads", "Social Media Marketing", "Content Strategy", "Email Marketing", "Analytics", "Branding", "Campaign Optimization"],
  ["Sensors & Actuators", "Arduino", "Raspberry Pi", "IoT Cloud", "MQTT Protocol", "Python", "Embedded Systems", "Networking Basics"],
  ["Supervised Learning", "Unsupervised Learning", "Python", "NumPy & Pandas", "Scikit-Learn", "Feature Engineering", "Model Evaluation", "Data Visualization"],
  ["AWS Services", "Azure Cloud", "GCP Basics", "Virtual Machines", "Serverless Computing", "Cloud Security", "Networking", "Storage Solutions"],
  ["Network Security", "Ethical Hacking", "Linux Basics", "Firewalls & IDS", "Penetration Testing", "Cryptography", "Risk Assessment", "Digital Forensics"],
  ["HTML & CSS", "JavaScript", "React.js", "Node.js", "Express.js", "MongoDB", "REST APIs", "Git & GitHub", "Deployment"],
  ["Linux & Shell Scripting", "Git & GitHub", "CI/CD Pipelines", "Docker", "Kubernetes", "Jenkins", "Cloud Platforms (AWS/Azure/GCP)", "Infrastructure as Code (Terraform)", "Monitoring Tools (Prometheus, Grafana)"],
  ["Flutter", "Dart", "React Native", "JavaScript", "UI/UX Principles", "API Integration", "Firebase", "State Management (Provider, Redux, Bloc)", "App Deployment"],
  ["Figma", "Wireframing", "Prototyping", "Design Thinking", "User Research", "Color Theory", "Typography", "Usability Testing", "Visual Design"],
  ["Cryptography Basics", "Smart Contracts", "Solidity", "Ethereum Blockchain", "Distributed Ledger Technology", "Web3.js", "Decentralized Apps (DApps)", "Consensus Algorithms"],
  ["Python Programming", "Machine Learning", "Deep Learning", "Neural Networks", "Statistics & Probability", "Data Visualization", "Data Preprocessing", "SQL & NoSQL Databases", "Model Deployment"]
];

export default function ProgramsAdmin({ isDarkMode, onNavigateSection }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);
  const [showAllTags, setShowAllTags] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // CLEAR FILTERS
  const clearAllFilters = () => {
    setQuery('');
    setSelectedTag(null);
  };

  // FETCH COURSES
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

  // ⭐ UNIQUE TAG LIST
  const allTags = useMemo(() => {
    const setTags = new Set();
    tagGroups.flat().forEach((t) => setTags.add(t));
    return Array.from(setTags);
  }, []);

  // ⭐ FIXED FILTER — NOW WORKS 100% CORRECTLY
  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selectedLower = selectedTag?.toLowerCase();

    return courses.filter((course) => {
      const title = course.title?.toLowerCase() || "";
      const desc = course.description?.toLowerCase() || "";
      const skills = (course.skills || []).map((s) => s.toLowerCase());

      const matchesQuery =
        !q ||
        title.includes(q) ||
        desc.includes(q) ||
        skills.some((s) => s.includes(q));

     const matchesTag =
  !selectedTag ||
  skills.some((s) => s.includes(selectedLower));


      return matchesQuery && matchesTag;
    });
  }, [courses, query, selectedTag]);

  // DELETE COURSE
  const removeCourse = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/courses/${id}`);
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting course:", err);
    }
  };

  return (
    <main className={`${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} min-h-screen p-6`}>
      
      <header className="mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">Programs</h1>
            <p className={isDarkMode ? "text-gray-300" : "text-gray-600"}>
              Manage all Programs.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigateSection?.("dashboard")}
              className={`px-4 py-2 rounded-lg ${isDarkMode ? "bg-gray-800" : "bg-white"} border`}
            >
              ← Back
            </button>

            <button
              onClick={() => onNavigateSection?.("courses")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
            >
              Add Program
            </button>
          </div>
        </div>

        {/* SEARCH + TAGS */}
        <div className="mt-6">
          
          {/* SEARCH BAR */}
          <div className={`flex items-center gap-2 p-3 rounded-lg border shadow-sm ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}>
            <FaSearch />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search programs..."
              className={`w-full bg-transparent outline-none`}
            />
            {(query || selectedTag) && (
              <button onClick={clearAllFilters} className="px-3 py-1 bg-gray-500 text-white text-sm rounded-md">
                Clear ✕
              </button>
            )}
          </div>

          {/* TAG SECTION */}
          <div className="flex items-center flex-wrap gap-2 mt-4">
            <span className="flex items-center text-sm opacity-80">
              <FaTags className="mr-2" /> Tags:
            </span>

            {(showAllTags ? allTags : allTags.slice(0, 12)).map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                className={`px-3 py-1.5 rounded-full text-sm border ${
                  selectedTag === tag
                    ? "bg-indigo-600 text-white"
                    : isDarkMode
                    ? "bg-gray-800 text-gray-300"
                    : "bg-white text-gray-700"
                }`}
              >
                {tag}
              </button>
            ))}

            {allTags.length > 12 && (
              <button
                onClick={() => setShowAllTags(!showAllTags)}
                className="text-indigo-600 text-sm px-2"
              >
                {showAllTags ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* COURSES LIST */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div key={course.id}
            className={`${isDarkMode ? "bg-gray-800" : "bg-white"} p-6 rounded-2xl shadow border`}>
            
            <div className="flex gap-4">
              {/* IMAGE */}
              {course.image_path ? (
                <img
                  src={`http://localhost:5000${course.image_path}`}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 bg-indigo-100 flex items-center justify-center rounded-xl">
                  <FaLaptopCode className="text-indigo-600" size={28} />
                </div>
              )}

              <div className="flex-1">
                <h3 className="text-lg font-semibold">{course.title}</h3>
                <p className="text-sm opacity-80 mt-1">{course.description}</p>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {course.skills?.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded-full border"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <button
                  onClick={() => removeCourse(course.id)}
                  className="mt-4 px-3 py-1 bg-red-600 text-white text-sm rounded-full"
                >
                  <FaTrash className="inline-block mr-1" /> Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {!loading && filteredCourses.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No programs found.</p>
        )}
      </section>
    </main>
  );
}
