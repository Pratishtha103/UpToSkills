import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../MentorDashboard/components/Sidebar";
import Header from "../../MentorDashboard/components/Header";
import Footer from "../../MentorDashboard/components/Footer";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const predefinedDomains = [
  "AI & Machine Learning",
  "Data Science",
  "Web Development",
  "App Development",
  "Cybersecurity",
  "Cloud Computing",
  "Blockchain",
  "UI/UX Design",
  "DevOps",
];

const MentorEditProfilePage = ({ isDarkMode, setIsDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    contact_number: "",
    linkedin_url: "",
    github_url: "",
    about_me: "",
    expertise_domains: [],
    others_domain: "",
  });

  const token = localStorage.getItem("token");

  // Fetch profile from backend
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/mentor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};
      setFormData({
        full_name: data.profile_full_name || data.full_name || "",
        contact_number: data.contact_number || "",
        linkedin_url: data.linkedin_url || "",
        github_url: data.github_url || "",
        about_me: data.about_me || "",
        expertise_domains: data.expertise_domains || [],
        others_domain: data.others_domain || "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to load mentor profile.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Save profile, accepting empty fields
  const saveProfile = async () => {
    try {
      setSaving(true);

      // Trim string fields and prepare payload
      const payload = {
        full_name: (formData.full_name || '').trim(),
        contact_number: (formData.contact_number || '').trim(),
        linkedin_url: (formData.linkedin_url || '').trim(),
        github_url: (formData.github_url || '').trim(),
        about_me: (formData.about_me || '').trim(),
        expertise_domains: Array.isArray(formData.expertise_domains) ? formData.expertise_domains : [],
        others_domain: (formData.others_domain || '').trim(),
      };

      console.log('Sending mentor profile payload:', payload);

      const res = await axios.post(
        "http://localhost:5000/api/mentor/profile",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Mentor profile response:', res.data);

      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        fetchProfile(); // refresh latest values
      } else {
        toast.error(res.data?.message || "Failed to update profile.");
      }
    } catch (err) {
      console.error('Mentor profile save error:', err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Network error while saving profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDomainToggle = (domain) => {
    const exists = formData.expertise_domains.includes(domain);
    setFormData({
      ...formData,
      expertise_domains: exists
        ? formData.expertise_domains.filter((d) => d !== domain)
        : [...formData.expertise_domains, domain],
    });
  };

  const handleSaveButtonClick = (e) => {
    e.preventDefault();
    saveProfile();
  };

  // Check if profile is completed - ALL fields must be filled
  const isProfileCompleted =
    formData.full_name &&
    formData.contact_number &&
    formData.linkedin_url &&
    formData.github_url &&
    formData.about_me &&
    formData.expertise_domains &&
    formData.expertise_domains.length > 0
      ? "Yes"
      : "No";

  return (
    <div className={`flex h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <Header
          onMenuClick={() => setIsOpen(!isOpen)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Main Content */}
        <main className="flex-1 pt-16 p-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Mentor Profile
              </h2>
              {saving && (
                <span className="text-sm text-gray-500 dark:text-gray-300 italic">
                  Saving...
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSaveButtonClick}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      Contact Number
                    </label>
                    <input
                      type="text"
                      name="contact_number"
                      value={formData.contact_number}
                      onChange={handleChange}
                      placeholder="Enter your 10-digit phone number"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      LinkedIn URL
                    </label>
                    <input
                      type="text"
                      name="linkedin_url"
                      value={formData.linkedin_url}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium dark:text-white">
                      GitHub URL
                    </label>
                    <input
                      type="text"
                      name="github_url"
                      value={formData.github_url}
                      onChange={handleChange}
                      placeholder="https://github.com/yourusername"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium dark:text-white">
                      About Me
                    </label>
                    <textarea
                      name="about_me"
                      value={formData.about_me}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Write a short bio about yourself"
                      className="w-full mt-1 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 dark:text-white">
                    Expertise Domains
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {predefinedDomains.map((domain) => (
                      <button
                        key={domain}
                        type="button"
                        onClick={() => handleDomainToggle(domain)}
                        className={`px-4 py-2 rounded-full border transition ${
                          formData.expertise_domains.includes(domain)
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                        }`}
                      >
                        {domain}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    name="others_domain"
                    value={formData.others_domain}
                    onChange={handleChange}
                    placeholder="Add a custom domain..."
                    className="w-full mt-4 p-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-white">
                    Profile Completed: {isProfileCompleted}
                  </span>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
                  >
                    Save Profile
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MentorEditProfilePage;
