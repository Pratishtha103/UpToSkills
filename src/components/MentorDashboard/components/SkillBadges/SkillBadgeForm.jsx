import React, { useState } from 'react';

import Header from '../Header';
import Sidebar from '../Sidebar';
// import RightSidebar from '../dashboard/RightSidebar';

const SkillBadgeForm = ({ isDarkMode, setIsDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
  student_name: '', // CHANGED TO student_name
  badge_name: '',
  badge_description: '',
  verified: false,
});

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch('http://localhost:5000/api/skill-badges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await response.json();
    if (data.success) {
      alert('Badge added successfully!');
      setFormData({ student_id: '', badge_name: '', badge_description: '', verified: false });
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <div className="mt-14 flex min-h-screen">
      <Header isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onMenuClick={toggleSidebar} />
      {isOpen && <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />}

      <div className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="min-h-screen flex items-center justify-center px-4 py-10 pt-24">
          <div className="p-6 bg-white rounded-lg w-full max-w-xl shadow-md dark:bg-gray-800">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">Add New Skill Badge</h2>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <label className="block dark:text-white">
                Student Name: 
                <input
                  type="text" // CHANGED
                  placeholder="Student Name" // CHANGED
                  name="student_name" // CHANGED
                  value={formData.student_name} // CHANGED
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </label>

              <label className="block dark:text-white">
                Badge Name:
                <input
                  type="text"
                  placeholder="Badge Name"
                  name="badge_name"
                  value={formData.badge_name}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </label>

              <label className="block dark:text-white">
                Badge Description:
                <textarea
                  name="badge_description"
                  placeholder="Badge Description"
                  value={formData.badge_description}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                ></textarea>
              </label>

              <label className="inline-flex items-center space-x-2 dark:text-white">
                <input
                  type="checkbox"
                  name="verified"
                  checked={formData.verified}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Verified</span>
              </label>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Submit
              </button>
            </form>
          </div>
        </main>
      </div>
      {/* <RightSidebar isDarkMode={isDarkMode} className="padded-top" /> */}
    </div>
  );
};

export default SkillBadgeForm;
