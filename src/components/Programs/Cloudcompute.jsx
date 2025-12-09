import React, { useState } from 'react';
import Header from '../AboutPage/Header';
import axios from 'axios';
import { useTheme } from '../../context/ThemeContext';

const Cloudcompute = () => {
  const { darkMode } = useTheme();
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", education: "", programexp: "",
    course: "cloud-computing", date: currentDate, time: currentTime,
  });
  const [resume, setResume] = useState(null);

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
      window.location.href = '/thankyou';
    } catch (error) { console.error("Upload failed:", error.response?.data || error.message); }
  };

  const inputClass = `peer w-full border-2 rounded-xl px-4 pt-5 pb-2 transition-all outline-none ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelClass = `absolute text-sm left-4 top-3.5 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-500 ${darkMode ? "text-gray-400 peer-placeholder-shown:text-gray-500" : "text-gray-500 peer-placeholder-shown:text-gray-400"}`;
  const selectClass = `w-full border-2 rounded-xl px-4 py-3 outline-none transition-all ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-400" : "bg-white border-gray-200 text-gray-800 focus:border-blue-500"} focus:ring-2 focus:ring-blue-200`;
  const labelTextClass = `block text-sm font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`;

  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-gradient-to-br from-blue-50 via-white to-indigo-50"}`}>
      <div className={`absolute top-[-100px] left-[-100px] w-[300px] h-[300px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-blue-600/20" : "bg-blue-400/30"}`} />
      <div className={`absolute bottom-[-120px] right-[-100px] w-[320px] h-[320px] blur-3xl rounded-full animate-pulse ${darkMode ? "bg-indigo-600/20" : "bg-indigo-400/30"}`} />
      <Header />
      <main className="flex-grow relative z-10 pb-20">
        <section className="text-center mt-28 mb-12 px-4">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-5 drop-shadow-sm">Cloud Computing</h1>
          <p className={`max-w-3xl mx-auto text-lg leading-relaxed mb-3 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Master Cloud Computing and learn to design, deploy, and manage scalable applications on platforms like AWS, Azure, and Google Cloud.</p>
          <p className="text-lg font-semibold text-indigo-500">Join us and unlock the power of the cloud today!</p>
        </section>

        <div className={`max-w-4xl mx-auto backdrop-blur-md rounded-2xl p-6 shadow-lg mb-12 transform transition hover:scale-[1.01] ${darkMode ? "bg-gray-800/60 border-gray-700" : "bg-white/60 border-blue-100"} border`}>
          <p className={`leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
            <span className="font-bold text-blue-500">Skills:</span> AWS, Azure, Google Cloud • Docker & Kubernetes • Serverless architecture • Cloud databases & storage • Monitoring & scaling • Cloud security & automation.
          </p>
        </div>

        <div className="grid max-w-7xl mx-auto px-6 items-center">
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
            <div className={`backdrop-blur-md p-10 rounded-3xl shadow-2xl transition-all duration-300 ${darkMode ? "bg-gray-800/80 border-gray-700" : "bg-white/80 border-blue-100"} border hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)]`}>
              <h2 className={`text-3xl font-bold mb-8 text-center ${darkMode ? "text-white" : "text-gray-800"}`}>Apply for Cloud Computing</h2>
              <div className="space-y-6">
                <div className="relative">
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder=" " required className={inputClass} />
                  <label htmlFor="name" className={labelClass}>Full Name</label>
                </div>
                <div className="relative">
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder=" " required className={inputClass} />
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                </div>
                <div className="relative">
                  <input type="text" id="phonenum" name="phone" value={formData.phone} onChange={handleChange} placeholder=" " required className={inputClass} />
                  <label htmlFor="phonenum" className={labelClass}>Phone Number</label>
                </div>
                <div>
                  <label className={labelTextClass}>Education Level</label>
                  <select name="education" value={formData.education} onChange={handleChange} required className={selectClass}>
                    <option value="">Select your education level</option>
                    <option value="high-school">High School</option>
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
                    <option value="cloud-computing">Cloud Computing</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.03] transition-all duration-300">Submit Application</button>
            </div>
          </form>
        </div>
      </main>
      <footer className={`w-full text-center py-4 text-sm transition-colors duration-300 border-t ${darkMode ? "bg-gray-950 text-gray-300 border-gray-700" : "bg-gray-700 text-gray-100 border-gray-300"}`}>
        <p>© 2025 Uptoskills. Build by learners.</p>
      </footer>
    </div>
  );
};

export default Cloudcompute;
