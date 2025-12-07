import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../AboutPage/Header';
import axios from 'axios';
import './Loading.css';
import { useTheme } from '../../context/ThemeContext';

const Webdev = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [courseLoading, setCourseLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { darkMode } = useTheme();

  const loading = courseLoading || studentLoading;
  const studentToken = localStorage.getItem("token");

  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", education: "", programexp: "",
    course: "web-development", date: currentDate, time: currentTime,
  });

  const [resume, setResume] = useState(null);

  useEffect(() => {
    const getCourse = async () => {
      try {
        const req = await axios.get(`http://localhost:5000/api/courses/getbyid/${id}`);
        if (req.data.length === 0) { setError("Course not found"); }
        else { setCourse(req.data[0]); setFormData(prev => ({ ...prev, course: req.data[0].title })); }
      } catch (err) { console.error("Error fetching course:", err); setError("Failed to fetch course."); }
      finally { setCourseLoading(false); }
    };

    const getStudent = async () => {
      if (!studentToken) { setStudentLoading(false); return; }
      setStudentLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/getStudent`, { headers: { Authorization: studentToken } });
        setStudent(res.data);
        setFormData(prev => ({ ...prev, name: res.data.name || "", email: res.data.email || "", phone: res.data.phone || "" }));
      } catch (err) { console.error("Error fetching student:", err); }
      finally { setStudentLoading(false); }
    };
    getCourse(); getStudent();
  }, [id, studentToken]);


  const enrollStudent = async (studentId) => {
    if (!student) { navigate('/login'); return; }
    try {
      await axios.put(`http://localhost:5000/api/courses/enrollstudent/${id}`, { studentId });
      navigate('/thankyou');
    } catch (err) { console.error("Enrollment failed:", err); }
  };

  const handleChange = (e) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type !== 'application/pdf') { alert('Please upload a PDF file.'); e.target.value = null; setResume(null); return; }
    setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => data.append(key, formData[key]));
      if (resume) data.append('resume', resume);
      await axios.post('http://localhost:5000/api/form', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (student?.id) { await enrollStudent(student.id); }
      window.location.href = '/thankyou';
    } catch (error) { console.error("Upload failed:", error.response?.data || error.message); }
  };

  const inputClass = `peer w-full border-2 rounded-xl px-4 pt-5 pb-2 transition-all outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelClass = `absolute text-sm left-4 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 ${darkMode ? "text-gray-400 peer-placeholder-shown:text-gray-500" : "text-gray-500 peer-placeholder-shown:text-gray-400"}`;
  const selectClass = `w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelTextClass = `block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-[#eef2ff] via-white to-[#dbeafe]"}`}>
      <div className="text-center">
        {loading ? (
          <div className="min-h-screen flex flex-col">
            <Header className="items-center" />
            <main className="flex-1 flex items-center justify-center"><div className="loader"></div></main>
          </div>
        ) : (
          <div className={`min-h-screen flex flex-col relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-[#eef2ff] via-white to-[#dbeafe]"}`}>
            <div className={`absolute top-[-100px] left-[-100px] w-[300px] h-[300px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-blue-600/20" : "bg-blue-400/30"}`}></div>
            <div className={`absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-indigo-600/20" : "bg-indigo-400/30"}`}></div>
            <Header />
            <div>
              <main className="flex-grow pb-20 relative z-10">
                <div className="text-center mt-28 mb-12 px-4">
                  <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">{course?.title}</h1>
                  <p className={`max-w-3xl mx-auto text-lg leading-relaxed mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>{course?.description}</p>
                  <p className="text-lg font-semibold text-indigo-500">Join us and unlock the world of modern {course?.title}.</p>
                </div>

                <div className={`max-w-4xl mx-auto text-start backdrop-blur-md rounded-2xl p-6 shadow-lg mb-12 transform transition hover:scale-[1.01] ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-blue-100"} border`}>
                  <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                    <span className="font-bold text-blue-500">Skills:</span> {course?.skills?.length > 0 ? course.skills.join(', ') : "No skills listed"}
                  </p>
                </div>

                <div className="grid place-items-center text-start px-4">
                  <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                    <div className={`backdrop-blur-md p-10 rounded-3xl shadow-2xl transition-all duration-300 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-blue-100"} border hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)]`}>
                      <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Apply for {course?.title}</h2>
                      <div className="space-y-6">
                        <div className="relative">
                          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Full Name</label>
                        </div>
                        <div className="relative">
                          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Email Address</label>
                        </div>
                        <div className="relative">
                          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " required className={inputClass} />
                          <label className={labelClass}>Phone Number</label>
                        </div>
                        <div>
                          <label className={labelTextClass}>Education Level</label>
                          <select name="education" value={formData.education} onChange={handleChange} required className={selectClass}>
                            <option value="">Select your education level</option>
                            <option value="high-school">High School</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="bachelor's-degree">Bachelor's Degree</option>
                            <option value="master's-degree">Master's Degree</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelTextClass}>Programming Experience</label>
                          <select name="programexp" value={formData.programexp} onChange={handleChange} required className={selectClass}>
                            <option value="">Select your experience level</option>
                            <option value="none">No Experience</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                          </select>
                        </div>
                        <div>
                          <label className={labelTextClass}>Course</label>
                          <select name="course" value={formData.course} onChange={handleChange} className={selectClass}>
                            <option value={formData.course}>{course?.title}</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.03] transition-all duration-300">Submit Application</button>
                    </div>
                  </form>
                </div>
              </main>
            </div>
          </div>
        )}
      </div>
      <footer className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-950 text-gray-300 border-gray-700" : "bg-gray-700 text-gray-100 border-gray-300"}`}>
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>
    </div>
  );
};

export default Webdev;
