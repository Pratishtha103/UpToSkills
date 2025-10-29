// src/components/MentorDashboard/components/SkillBadges/SkillBadgeForm.jsx

// import React, { useState } from 'react';

// import Header from '../Header';
// import Sidebar from '../Sidebar';

import React, { useState } from "react";
import Header from "../Header";
import Sidebar from "../Sidebar";
import Footer from "../Footer";
// Define the 6 fixed badge names with unique colors/styles
const FIXED_BADGES = [
    { name: 'Best Intern of the Week', icon: '🏆', color: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/50' },
    { name: 'Project Completion', icon: '✅', color: 'border-green-500 bg-green-50 dark:bg-green-950/50' },
    { name: 'Code Quality Award', icon: '💻', color: 'border-blue-500 bg-blue-50 dark:bg-blue-950/50' },
    { name: 'Teamwork Excellence', icon: '🤝', color: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/50' },
    { name: 'Innovation Champion', icon: '💡', color: 'border-red-500 bg-red-50 dark:bg-red-950/50' },
    { name: 'Mentorship Star', icon: '🎓', color: 'border-purple-500 bg-purple-50 dark:bg-purple-950/50' },
];

// const SkillBadgeForm = ({ isDarkMode, toggleDarkMode }) => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [formData, setFormData] = useState({
//         student_name: '',
//         badge_name: '', // Will be set by clicking a card
//         badge_description: '',
//         verified: false,
//     });
//     const [submissionStatus, setSubmissionStatus] = useState(null);

//     const toggleSidebar = () => {
//         setIsOpen((prev) => !prev);
//     };

//     // Function to set the badge name when a card is clicked
//     const selectBadge = (badgeName) => {
//         setFormData(prev => ({ 
//             ...prev, 
//             badge_name: badgeName,
//         }));
//     };

//     const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         setFormData((prevData) => ({
//             ...prevData,
//             [name]: type === 'checkbox' ? checked : value,
//         }));
//     };
    
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setSubmissionStatus('submitting');
        
//         // 1. Get the Mentor/Admin token
//         const token = localStorage.getItem('token'); 
        
//         // Check if token exists
//         if (!token) {
//             setSubmissionStatus('error');
//             alert('Authentication Error: Mentor token not found. Please log in again.');
//             return;
//         }


const SkillBadgeForm = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    student_name: "",
    badge_name: "",
    badge_description: "",
    verified: false,
  });

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/skill-badges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        alert("Badge added successfully!");
        setFormData({
          student_name: "",
          badge_name: "",
          badge_description: "",
          verified: false,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

//   return (
//     <div className="mt-14 flex min-h-screen">
//       <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onMenuClick={toggleSidebar} />
//       {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}

//       <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
//         <main className="min-h-screen flex items-center justify-center px-4 py-10 pt-24">
//           <div className="p-6 bg-white rounded-lg w-full max-w-xl shadow-md dark:bg-gray-800">
//             <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Add New Skill Badge</h2>
//             <form className="space-y-4" onSubmit={handleSubmit}>
//               <label className="block dark:text-white">
//                 Student Name:
//                 <input
//                   type="text"
//                   name="student_name"
//                   placeholder="Student Name"
//                   value={formData.student_name}
//                   onChange={handleChange}
//                   required
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//               </label>

//               <label className="block dark:text-white">
//                 Badge Name:
//                 <input
//                   type="text"
//                   name="badge_name"
//                   placeholder="Badge Name"
//                   value={formData.badge_name}
//                   onChange={handleChange}
//                   required
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 />
//               </label>

//               <label className="block dark:text-white">
//                 Badge Description:
//                 <textarea
//                   name="badge_description"
//                   placeholder="Badge Description"
//                   value={formData.badge_description}
//                   onChange={handleChange}
//                   required
//                   className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 ></textarea>
//               </label>
// {/* >>>>>>> 10643f4906e20650359dd0a5d3a0fd789a2597ab */}

//         try {
//             const response = await fetch('http://localhost:5000/api/skill-badges', {
//                 method: 'POST',
//                 headers: { 
//                     'Content-Type': 'application/json',
//                     'x-auth-token': token, // <-- CRITICAL: Send the token here!
//                 },
//                 body: JSON.stringify(formData)
//             });
            
//             const data = await response.json();
            
//             if (response.ok && data.success) {
//                 setSubmissionStatus('success');
//                 alert('Badge added successfully!');
//                 // Clear form data on successful submission
//                 setFormData({ student_name: '', badge_name: '', badge_description: '', verified: false });
//             } else {
//                 setSubmissionStatus('error');
//                 // Display specific error message from the backend if available
//                 console.error("Backend Error:", data.message || "Unknown error during badge creation.");
//                 alert(`Failed to add badge. Server response: ${data.message || 'Check browser console for details.'}`); 
//             }
//         } catch (error) {
//             console.error('Network Error:', error);
//             setSubmissionStatus('error');
//             alert('A network error occurred. Check browser console.');
//         }
//     };

    const selectedBadge = FIXED_BADGES.find(b => b.name === formData.badge_name);


    return (
        <div className={`dashboard-container${isDarkMode ? ' dark' : ''}`}>
            {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}
            <div className={`main-content${isOpen ? '' : ' full-width'}`}>
                <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                <div className="min-h-screen flex items-center justify-center px-4 py-10">
                    <div className="pt-24 p-6 bg-white rounded-lg w-full max-w-2xl shadow-md dark:bg-gray-700">
                        <h2 className="text-2xl font-semibold mb-6 dark:text-white">Award a Skill Badge</h2>
                        
                        {/* NEW BADGE SELECTION GALLERY */}
                        <div className="mb-6">
                            <h3 className="text-lg font-medium mb-3 dark:text-white">1. Select Badge Type:</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {FIXED_BADGES.map((badge) => (
                                    <div
                                        key={badge.name}
                                        onClick={() => selectBadge(badge.name)}
                                        className={`p-3 text-center rounded-lg border-2 cursor-pointer transition-all duration-200 
                                            ${badge.color}
                                            ${formData.badge_name === badge.name 
                                                ? 'border-4 ring-2 ring-offset-2 ring-blue-500' 
                                                : 'border-transparent hover:border-blue-400'
                                            }`}
                                    >
                                        <div className="text-3xl mb-1">{badge.icon}</div>
                                        <p className="text-sm font-semibold dark:text-gray-100">{badge.name}</p>
                                    </div>
                                ))}
                            </div>
                            {formData.badge_name && (
                                <p className="mt-3 text-md text-blue-600 dark:text-blue-400">
                                    **Badge Selected:** {selectedBadge.icon} {selectedBadge.name}
                                </p>
                            )}
                        </div>
                        {/* END NEW BADGE SELECTION GALLERY */}
                        
                        
                        {/* FORM APPEARS ONLY AFTER BADGE IS SELECTED */}
                        {formData.badge_name && (
                            <form className="space-y-4" onSubmit={handleSubmit}>
                                
                                <h3 className="text-lg font-medium pt-4 mb-3 border-t dark:border-gray-600 dark:text-white">2. Award Details:</h3>
                                
                                {/* Student Name Input */}
                                <label className="block dark:text-white">
                                    Student Name: 
                                    <input
                                        type="text"
                                        placeholder="Student Name (e.g., John Doe)"
                                        name="student_name"
                                        value={formData.student_name}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    />
                                </label>

                                {/* Badge Description Textarea */}
                                <label className="block dark:text-white">
                                    Badge Description (Optional context):
                                    <textarea
                                        name="badge_description"
                                        placeholder="Brief reason for the award (e.g., Completed the MERN stack project with high code quality)"
                                        value={formData.badge_description}
                                        onChange={handleChange}
                                        required
                                        className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    ></textarea>
                                </label>

                                {/* Verified Checkbox */}
                                <label className="inline-flex items-center space-x-2 dark:text-white">
                                    <input
                                        type="checkbox"
                                        name="verified"
                                        checked={formData.verified}
                                        onChange={handleChange}
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded dark:bg-gray-600 dark:border-gray-500"
                                    />
                                    <span>Verified Badge</span>
                                </label>

                                {/* Submit Button and Status Messages */}
                                <button
                                    type="submit"
                                    disabled={submissionStatus === 'submitting'}
                                    className={`px-4 py-2 text-white rounded-md transition ${
                                        submissionStatus === 'submitting'
                                            ? 'bg-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                                >
                                    {submissionStatus === 'submitting' ? 'Submitting...' : 'Award Badge'}
                                </button>
                                
                                {/* Submission Status Messages */}
                                {submissionStatus === 'success' && (
                                    <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        Skill badge added successfully! 🎉
                                    </p>
                                )}
                                {submissionStatus === 'error' && (
                                    <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        Error adding badge. Check console for details.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
  //   );
  //             <button
  //               type="submit"
  //               className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
  //             >
  //               Submit
  //             </button>
  //           </form>
  //         </div>
  //       </main>
  //     </div>
  //   </div>
  // );
// >>>>>>> 10643f4906e20650359dd0a5d3a0fd789a2597ab
};

export default SkillBadgeForm;