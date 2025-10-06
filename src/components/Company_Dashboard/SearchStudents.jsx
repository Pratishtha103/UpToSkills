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

  // Fetch all students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  // Filter students based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStudents(students);
    } else {
      const filtered = students.filter(student =>
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

  // Student Details View
  if (selectedStudent && studentDetails) {
    return (
      <div className="p-6"> {/* Remove min-h-screen and use simple padding */}
        <div className="max-w-4xl mx-auto">
          
          {/* Back Button */}
          <button
            onClick={handleBackToList}
            className="flex items-center gap-2 mb-6 text-lg text-black hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <b>Back to Students List</b>
          </button>

          {/* Student Details Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
                      <p className="text-white/80">Student ID: {studentDetails.student_id}</p>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-6">
                  
                  {/* Contact Information */}
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      {studentDetails.contact_number && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-700">{studentDetails.contact_number}</span>
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
                          <Github className="w-5 h-5 text-gray-800" />
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
                  {(studentDetails.domainsOfInterest || studentDetails.othersDomain) && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Domains of Interest</h2>
                      <div className="flex flex-wrap gap-2">
                        {studentDetails.domainsOfInterest && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {studentDetails.domainsOfInterest}
                          </span>
                        )}
                        {studentDetails.othersDomain && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {studentDetails.othersDomain}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* AI Skill Summary */}
                  {studentDetails.ai_skill_summary && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Skill Summary</h2>
                      <p className="text-gray-700 leading-relaxed">{studentDetails.ai_skill_summary}</p>
                    </div>
                  )}

                  {/* Why Hire Me */}
                  {studentDetails.why_hire_me && (
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-4">Why Hire Me</h2>
                      <p className="text-gray-700 leading-relaxed">{studentDetails.why_hire_me}</p>
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

  // Student List View
  return (
    <div className="p-6"> {/* Remove min-h-screen and use simple padding */}
      <div className="max-w-4xl mx-auto">
        
        {/* Header Section */}
        {/* <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Search Students</h1>
          <p className="text-gray-600">Find and view student profiles</p>
        </div> */}

        {/* Search Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students by name..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Student Names List */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Students ({filteredStudents.length})
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <div 
                  key={student.user_detail_id || student.id} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  onClick={() => fetchStudentDetails(student.user_detail_id || student.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">
                      {student.student_name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                {searchQuery ? "No students found matching your search" : "No students available"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}