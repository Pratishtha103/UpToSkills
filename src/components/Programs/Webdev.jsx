import React, { useState } from 'react';
import Header from '../AboutPage/Header';
import Footer from '../AboutPage/Footer';
import axios from 'axios';

const Webdev = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        education: "",
        programexp: "",
        course: "web-development",
    });
    const [resume, setResume] = useState(null);

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            alert('Please upload a PDF file for the resume.');
            e.target.value = null;
            setResume(null);
            return;
        }
        setResume(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => data.append(key, formData[key]));
            if (resume) data.append('resume', resume);

            const res = await axios.post('http://localhost:5000/api/form', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("✅ Upload successful:", res.data);
            window.location.href = '/thankyou';
        } catch (error) {
            console.error("❌ Upload failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#eef2ff] via-white to-[#dbeafe] relative overflow-hidden">
            {/* Animated Gradient Blur */}
            <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-blue-400/30 blur-3xl rounded-full animate-pulse" />
            <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-indigo-400/30 blur-3xl rounded-full animate-pulse" />

            <Header />

            <main className="flex-grow pb-20 relative z-10">
                {/* Hero Section */}
                <div className="text-center mt-28 mb-12 px-4">
                    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 drop-shadow-sm">
                        Web Development
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-gray-700 leading-relaxed mb-3">
                        Kickstart your web development journey with hands-on experience! Build responsive websites, master front-end tools, and turn your ideas into interactive experiences.
                    </p>
                    <p className="text-lg font-semibold text-indigo-600">
                        Join us and unlock the world of modern web design.
                    </p>
                </div>

                {/* Skills Card */}
                <div className="max-w-4xl mx-auto bg-white/60 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-blue-100 mb-12 transform transition hover:scale-[1.01]">
                    <p className="text-gray-700">
                        <span className="font-bold text-blue-600">Skills:</span> HTML, CSS, JavaScript • React, Angular, or Vue • Responsive Design • Git & Deployment • Hosting Basics
                    </p>
                </div>

                {/* Form Section */}
                <div className="grid place-items-center px-4">
                    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
                        <div className="bg-white/80 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-blue-100 transition-all duration-300 hover:shadow-[0_10px_40px_rgba(59,130,246,0.2)]">
                            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                                Apply for Web Development
                            </h2>

                            <div className="space-y-6">
                                {/* Name */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full border-2 border-gray-200 rounded-xl px-4 pt-5 pb-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    />
                                    <label
                                        htmlFor="name"
                                        className="absolute text-sm left-4 text-gray-500 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 transition-all duration-200 ease-in-out "
                                    >
                                        Full Name
                                    </label>
                                </div>

                                {/* Email */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full border-2 border-gray-200 rounded-xl px-4 pt-5 pb-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute text-sm text-gray-500 left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 transition-all"
                                    >
                                        Email Address
                                    </label>
                                </div>

                                {/* Phone */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="phonenum"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder=" "
                                        required
                                        className="peer w-full border-2 border-gray-200 rounded-xl px-4 pt-5 pb-2 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
                                    />
                                    <label
                                        htmlFor="phonenum"
                                        className="absolute text-sm text-gray-500 left-4 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-blue-600 transition-all"
                                    >
                                        Phone Number
                                    </label>
                                </div>

                                {/* Education */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Education Level
                                    </label>
                                    <select
                                        name="education"
                                        value={formData.education}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    >
                                        <option value="">Select your education level</option>
                                        <option value="high-school">High School</option>
                                        <option value="bachelor's-degree">Bachelor's Degree</option>
                                        <option value="master's-degree">Master's Degree</option>
                                    </select>
                                </div>

                                {/* Programming Experience */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Programming Experience
                                    </label>
                                    <select
                                        name="programexp"
                                        value={formData.programexp}
                                        onChange={handleChange}
                                        required
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    >
                                        <option value="">Select your experience level</option>
                                        <option value="none">No Experience</option>
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>

                                {/* Resume Upload */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Upload Resume
                                    </label>
                                    <input
                                        type="file"
                                        id="resume"
                                        name="resume"
                                        onChange={handleFileChange}
                                        accept=".pdf"
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>

                                {/* Course */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Course
                                    </label>
                                    <select
                                        name="course"
                                        value={formData.course}
                                        onChange={handleChange}
                                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                    >
                                        <option value="web-development">Web Development</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full mt-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-[0_8px_30px_rgba(59,130,246,0.4)] hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.03] transition-all duration-300"
                            >
                                Submit Application
                            </button>
                        </div>
                    </form>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Webdev;
