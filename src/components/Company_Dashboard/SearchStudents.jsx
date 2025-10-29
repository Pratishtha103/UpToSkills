import { useState, useEffect } from "react";
import { Search, Loader, User, Phone, Linkedin, Github, ArrowLeft } from "lucide-react";
import SearchFilters from "./SearchFilters";

/**
 * SearchStudents (ESLint-safe)
 *
 * - No eslint-disable or references to react-hooks/exhaustive-deps
 * - fetchStudents is defined inside the mount effect so the effect has no external deps
 * - Filtering effect declares its dependencies explicitly
 */

export default function SearchStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ name: "", domain: "All Domains" });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Mount: fetch students. fetchStudents is defined inside the effect to avoid being a dependency.
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/students/all-students");
        const data = await res.json();
        // Accept either { success: true, data: [...] } or directly an array
        const rows = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
        setStudents(rows);
        setFilteredStudents(rows);
      } catch (err) {
        console.error("Error fetching students:", err);
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); // no external dependencies

  // Client-side filtering: depends explicitly on searchQuery, filters, and students
  useEffect(() => {
    let filtered = students;

    // Apply name filter
    if (filters.name.trim()) {
      const nameQuery = filters.name.trim().toLowerCase();
      filtered = filtered.filter((s) => {
        const name =
          (s.student_name || s.full_name || s.name || s.displayName || "")
            .toString()
            .toLowerCase();
        return name.includes(nameQuery);
      });
    }

    // Apply domain filter
    if (filters.domain !== "All Domains") {
      filtered = filtered.filter((s) => {
        // Normalize domains: array, JSON string, comma-separated string, or plain string
        let domains = "";
        try {
          if (Array.isArray(s.domains_of_interest)) {
            domains = s.domains_of_interest.join(" ");
          } else if (typeof s.domains_of_interest === "string") {
            const trimmed = s.domains_of_interest.trim();
            if (trimmed.startsWith("[")) {
              try {
                const parsed = JSON.parse(trimmed);
                domains = Array.isArray(parsed) ? parsed.join(" ") : trimmed;
              } catch {
                domains = trimmed;
              }
            } else {
              domains = trimmed;
            }
          } else if (Array.isArray(s.domainsOfInterest)) {
            domains = s.domainsOfInterest.join(" ");
          } else if (s.domainsOfInterest && typeof s.domainsOfInterest === "string") {
            domains = s.domainsOfInterest;
          } else {
            domains = "";
          }
        } catch {
          domains = "";
        }

        const others = (s.othersDomain || s.others_domain || "").toString().toLowerCase();
        const combinedDomains = domains.toLowerCase() + " " + others;
        // Check if the selected domain is included in the combined domains string
        return combinedDomains.includes(filters.domain.toLowerCase());
      });
    }

    // Apply search query filter
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      filtered = filtered.filter((s) => {
        const name =
          (s.student_name || s.full_name || s.name || s.displayName || "")
            .toString()
            .toLowerCase();

        // Normalize domains for search
        let domains = "";
        try {
          if (Array.isArray(s.domains_of_interest)) {
            domains = s.domains_of_interest.join(" ");
          } else if (typeof s.domains_of_interest === "string") {
            const trimmed = s.domains_of_interest.trim();
            if (trimmed.startsWith("[")) {
              try {
                const parsed = JSON.parse(trimmed);
                domains = Array.isArray(parsed) ? parsed.join(" ") : trimmed;
              } catch {
                domains = trimmed;
              }
            } else {
              domains = trimmed;
            }
          } else if (Array.isArray(s.domainsOfInterest)) {
            domains = s.domainsOfInterest.join(" ");
          } else if (s.domainsOfInterest && typeof s.domainsOfInterest === "string") {
            domains = s.domainsOfInterest;
          } else {
            domains = "";
          }
        } catch {
          domains = "";
        }

        const ai = (s.ai_skill_summary || s.ai_skills || s.ai || "").toString().toLowerCase();
        const others = (s.othersDomain || s.others_domain || "").toString().toLowerCase();

        return (
          name.includes(q) ||
          domains.toString().toLowerCase().includes(q) ||
          ai.includes(q) ||
          others.includes(q)
        );
      });
    }

    setFilteredStudents(filtered);
  }, [searchQuery, filters, students]); // explicit deps

  const fetchStudentDetails = async (studentId) => {
    if (!studentId) return;
    try {
      setDetailsLoading(true);
      const res = await fetch(`http://localhost:5000/api/students/student/${studentId}`);
      const data = await res.json();
      if (data.success) {
        const d = data.data;
        const normalized = {
          ...d,
          full_name: d.profile_full_name || d.full_name || d.student_name || "",
          student_id: d.student_id || d.id,
          contact_number: d.contact_number || d.phone,
          linkedin_url: d.linkedin_url,
          github_url: d.github_url,
          ai_skill_summary: d.ai_skill_summary || d.ai_skills || "",
          domainsOfInterest: d.domains_of_interest || d.domainsOfInterest || [],
          othersDomain: d.others_domain || d.othersDomain || "",
        };
        setStudentDetails(normalized);
        setSelectedStudent(studentId);
      } else {
        console.warn("No student detail returned:", data);
      }
    } catch (err) {
      console.error("Error fetching student details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setStudentDetails(null);
  };

  const onFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const onClearFilters = () => {
    setFilters({ name: "", domain: "All Domains" });
  };

  // ---------- STUDENT DETAILS VIEW ----------
  if (selectedStudent && studentDetails) {
    return (
      <div className="p-6  dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 mb-6 text-lg text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <b>Back to Students List</b>
          </button>

          <div className="dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors">
            {detailsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-8">
                  <div className="flex items-center gap-4">
                    <div className="bg-white/20 p-3 rounded-full">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">
                        {studentDetails.full_name}
                      </h1>
                      <p className="text-white/80">
                        Student ID: {studentDetails.student_id}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
                  <div>
                    <h2 className="text-lg font-semibold mb-4">
                      Contact Information
                    </h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {studentDetails.contact_number && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400 dark:text-gray-300" />
                          <span>{studentDetails.contact_number}</span>
                        </div>
                      )}
                      {studentDetails.linkedin_url && (
                        <div className="flex items-center gap-3">
                          <Linkedin className="w-5 h-5 text-blue-600" />
                          <a
                            href={studentDetails.linkedin_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            LinkedIn Profile
                          </a>
                        </div>
                      )}
                      {studentDetails.github_url && (
                        <div className="flex items-center gap-3">
                          <Github className="w-5 h-5 text-gray-800 dark:text-white" />
                          <a
                            href={studentDetails.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            GitHub Profile
                          </a>
                        </div>
                      )}
                    </div>
                  </div>

                  {(studentDetails.domainsOfInterest || studentDetails.othersDomain) && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Domains of Interest
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {Array.isArray(studentDetails.domainsOfInterest)
                          ? studentDetails.domainsOfInterest.map((d, i) => (
                              <span key={i} className=" dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                {d}
                              </span>
                            ))
                          : (studentDetails.domainsOfInterest || "").toString().split(",").map((d, i) => d.trim() ? (
                              <span key={i} className=" dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                                {d}
                              </span>
                            ) : null)}
                        {studentDetails.othersDomain && (
                          <span className=" dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                            {studentDetails.othersDomain}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {studentDetails.ai_skill_summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">AI Skill Summary</h2>
                      <p className="leading-relaxed">{studentDetails.ai_skill_summary}</p>
                    </div>
                  )}

                  {studentDetails.why_hire_me && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Why Hire Me</h2>
                      <p className="leading-relaxed">{studentDetails.why_hire_me}</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ---------- STUDENT LIST VIEW ----------
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <SearchFilters
          filters={filters}
          onFilterChange={onFilterChange}
          onClearFilters={onClearFilters}
        />

        <div className=" dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or skill/domain (try: react, ai, frontend)..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div className="dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Candidates ({filteredStudents.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => {
                const id = student.user_detail_id || student.id || student.student_id;
                const displayName =
                  student.student_name ||
                  student.full_name ||
                  student.profile_full_name ||
                  student.name ||
                  "Unknown Student";
                const domainDisplay =
                  student.domains_of_interest ||
                  student.domainsOfInterest ||
                  student.ai_skill_summary ||
                  "";
                return (
                  <div
                    key={id || Math.random()}
                    className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                    onClick={() => fetchStudentDetails(id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-900 dark:text-gray-100">{displayName}</span>
                        <div className="text-sm text-gray-500 dark:text-gray-300">
                          {typeof domainDisplay === "string"
                            ? domainDisplay.slice(0, 80)
                            : Array.isArray(domainDisplay)
                            ? domainDisplay.join(", ").slice(0, 80)
                            : ""}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">
              {searchQuery ? "No students found matching your search" : "No students available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
