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

const MentorEditProfilePage = ({ isDarkMode, toggleDarkMode }) => {
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

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/mentor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data?.data || {};
      setFormData({
        full_name: data.full_name || "",
        contact_number: data.phone || "",
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

  const saveProfile = async () => {
    try {
      setSaving(true);
      const res = await axios.post(
        "http://localhost:5000/api/mentor/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        toast.success("Profile updated successfully!");
        setFormData({
          full_name: "",
          contact_number: "",
          linkedin_url: "",
          github_url: "",
          about_me: "",
          expertise_domains: [],
          others_domain: "",
        });
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error while saving profile.");
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

  return (
    <div className={`flex min-h-screen ${isDarkMode ? "dark" : ""}`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ✅ Smart layout: flex column + justify-between keeps footer at bottom when content is short */}
      <div className="flex flex-col flex-1 justify-between transition-all duration-300">
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

                <div className="flex justify-end">
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
