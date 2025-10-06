import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import StudentProfileForm from "./StudentProfileForm";
import DomainsOfInterest from "./DomainsOfInterest";

const EditProfilePage = ({ isDarkMode, toggleDarkMode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [domainsOfInterest, setDomainsOfInterest] = useState([]);
  const [othersDomain, setOthersDomain] = useState("");
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⬇️ Fetch profile once on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const d = res.data.data; // ✅ your API's data shape
        setFormData({
          full_name: d.profile_full_name || d.student_name,
          contact_number: d.contact_number || d.student_phone,
          linkedin_url: d.linkedin_url || "",
          github_url: d.github_url || "",
          why_hire_me: d.why_hire_me || "",
          ai_skill_summary: d.ai_skill_summary || "",
          profile_completed: d.profile_completed || false,
        });
        setDomainsOfInterest(d.domains_of_interest || []);
        setOthersDomain(d.others_domain || "");
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleDomainChange = (domain, value) => {
    if (domain === "others") {
      setOthersDomain(value);
    } else {
      setDomainsOfInterest((prev) => {
        if (value && !prev.includes(domain)) {
          return [...prev, domain];
        } else if (!value) {
          return prev.filter((d) => d !== domain);
        }
        return prev;
      });
    }
  };

  const handleFormSubmit = async (formValues) => {
    const fullData = {
      ...formValues,
      domainsOfInterest,
      othersDomain,
    };
    console.log("Submitting full profile data:", fullData);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(fullData),
      });

      const result = await response.json();
      if (result.success) {
        alert("Profile saved successfully!");
      } else {
        alert(`Error saving profile: ${result.message}\nDetails: ${result.error}`);
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error: Could not connect to server");
    }
  };

  return (
    <div className={`flex h-screen dashboard-container${isDarkMode ? " dark" : ""}`}>
      {isOpen && (
        <Sidebar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          isDarkMode={isDarkMode}
        />
      )}

      <div
        className={`flex-1 flex flex-col overflow-hidden main-content${
          isOpen ? "" : " full-width"
        }`}
      >
        <Header
          onMenuClick={toggleSidebar}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        <div className="flex-1 overflow-y-auto pt-24 p-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Edit Profile
            </h1>

            {/* ✅ Only the form section shows loading spinner */}
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <StudentProfileForm
                    formData={formData || {}}
                    setFormData={setFormData}
                    onSubmit={handleFormSubmit}
                  />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <DomainsOfInterest
                    selectedDomains={domainsOfInterest}
                    onChange={handleDomainChange}
                    othersValue={othersDomain}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfilePage;
