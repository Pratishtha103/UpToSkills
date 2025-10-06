import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import Header from "./Header";
import StudentProfileForm from "./StudentProfileForm";
import DomainsOfInterest from "./DomainsOfInterest";

const MentorEditProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [domainsOfInterest, setDomainsOfInterest] = useState([]); // reused UI
  const [othersDomain, setOthersDomain] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch mentor profile and map mentor fields -> student-shaped formData
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const res = await axios.get("http://localhost:5000/api/mentor/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const d = (res.data && (res.data.data || res.data)) || {};

      // Map mentor response to the student-form fields that StudentProfileForm expects
      setFormData({
        full_name: d.profile_full_name || d.mentor_name || "",
        contact_number: d.contact_number || d.mentor_phone || "",
        linkedin_url: d.linkedin_url || "",
        github_url: d.github_url || "",
        // map mentor about_me -> why_hire_me field used by the student form
        why_hire_me: d.about_me || d.why_hire_me || "",
        // no direct ai_skill_summary for mentor; keep existing or blank
        ai_skill_summary: d.ai_skill_summary || "",
        profile_completed: typeof d.profile_completed === "boolean" ? d.profile_completed : false,
      });

      // map mentor expertise_domains -> domainsOfInterest (student form format)
      setDomainsOfInterest(d.expertise_domains || d.domains_of_interest || []);
      setOthersDomain(d.others_domain || d.othersDomain || "");
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleDomainChange = (domain, value) => {
    if (domain === "others") {
      setOthersDomain(value);
      return;
    }

    setDomainsOfInterest((prev) => {
      if (value && !prev.includes(domain)) {
        return [...prev, domain];
      } else if (!value) {
        return prev.filter((d) => d !== domain);
      }
      return prev;
    });
  };

  const handleFormSubmit = async (formValues) => {
    // The UI is student-shaped. Map student-shaped values -> mentor-shaped payload
    const payload = {
      full_name: formValues.full_name,
      contact_number: formValues.contact_number,
      linkedin_url: formValues.linkedin_url,
      github_url: formValues.github_url,
      // map student why_hire_me or ai_skill_summary -> mentor about_me
      about_me: formValues.why_hire_me || formValues.ai_skill_summary || "",
      // map domainsOfInterest -> expertise_domains
      expertise_domains: domainsOfInterest,
      // map othersDomain -> others_domain
      others_domain: othersDomain,
    };

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No auth token found");

      const response = await axios.post("http://localhost:5000/api/mentor/profile", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.success) {
        alert("Profile saved successfully!");
        fetchProfile();
      } else {
        alert(`Error saving profile: ${response.data?.message || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: Could not connect to server");
    }
  };

  return (
    <div className={`flex h-screen dashboard-container${isDarkMode ? " dark" : ""}`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isOpen ? "" : "lg:ml-0"}`}>
        <Header onMenuClick={toggleSidebar} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />

        <div className="flex-1 overflow-y-auto pt-16 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Edit Profile</h1>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  {/* Reuse your existing StudentProfileForm (no UI change) */}
                  <StudentProfileForm formData={formData || {}} setFormData={setFormData} onSubmit={handleFormSubmit} />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <DomainsOfInterest selectedDomains={domainsOfInterest} onChange={handleDomainChange} othersValue={othersDomain} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorEditProfilePage;
