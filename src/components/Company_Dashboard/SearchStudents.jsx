import { useState, useEffect } from "react";
import { Search, Loader, User, Phone, Linkedin, Github, ArrowLeft } from "lucide-react";

export default function SearchStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentDetails, setStudentDetails] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter((student) =>
        student.student_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStudents(filtered);
    }
  }, [searchQuery, students]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/students/all-students");
      const data = await res.json();
      if (data.success) {
        setStudents(data.data);
        setFilteredStudents(data.data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentDetails = async (studentId) => {
    try {
      setDetailsLoading(true);
      const res = await fetch(`http://localhost:5000/api/students/student/${studentId}`);
      const data = await res.json();

      if (data.success) {
        setStudentDetails(data.data);
        setSelectedStudent(studentId);
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

  // ------------------- STUDENT DETAILS VIEW -------------------
  if (selectedStudent && studentDetails) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 mb-6 text-lg text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <b>Back to Students List</b>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors">
            {detailsLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {/* Header */}
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

                {/* Details */}
                <div className="p-6 space-y-6 text-gray-900 dark:text-gray-100">
                  {/* Contact Information */}
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

                  {/* Domains of Interest */}
                  {(studentDetails.domainsOfInterest ||
                    studentDetails.othersDomain) && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        Domains of Interest
                      </h2>
                      <div className="flex flex-wrap gap-2">
                        {studentDetails.domainsOfInterest && (
                          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                            {studentDetails.domainsOfInterest}
                          </span>
                        )}
                        {studentDetails.othersDomain && (
                          <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-3 py-1 rounded-full text-sm">
                            {studentDetails.othersDomain}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Skill Summary */}
                  {studentDetails.ai_skill_summary && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">
                        AI Skill Summary
                      </h2>
                      <p className="leading-relaxed">
                        {studentDetails.ai_skill_summary}
                      </p>
                    </div>
                  )}

                  {/* Why Hire Me */}
                  {studentDetails.why_hire_me && (
                    <div>
                      <h2 className="text-lg font-semibold mb-4">Why Hire Me</h2>
                      <p className="leading-relaxed">
                        {studentDetails.why_hire_me}
                      </p>
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

  // ------------------- STUDENT LIST VIEW -------------------
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8 transition-colors">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search students by name..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Student List */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden transition-colors">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Students ({filteredStudents.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStudents.map((student) => (
                <div
                  key={student.user_detail_id || student.id}
                  className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 cursor-pointer"
                  onClick={() =>
                    fetchStudentDetails(student.user_detail_id || student.id)
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {student.student_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600 dark:text-gray-300">
              {searchQuery
                ? "No students found matching your search"
                : "No students available"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
