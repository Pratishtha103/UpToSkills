import React, { useState, useEffect } from "react";

const StudentProfileForm = ({ formData, setFormData, onSubmit }) => {
  // Local state mirrors parent formData for immediate UI updates
  const [localData, setLocalData] = useState({
    full_name: "",
    contact_number: "",
    linkedin_url: "",
    github_url: "",
    why_hire_me: "",
    profile_completed: false,
    ai_skill_summary: "",
  });

  // Pre-fill fields when parent updates formData from API
  useEffect(() => {
    if (formData) {
      setLocalData({
        full_name: formData.full_name || "",
        contact_number: formData.contact_number || "",
        linkedin_url: formData.linkedin_url || "",
        github_url: formData.github_url || "",
        why_hire_me: formData.why_hire_me || "",
        profile_completed: formData.profile_completed || false,
        ai_skill_summary: formData.ai_skill_summary || "",
      });
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Update local UI state
    setLocalData((prev) => ({ ...prev, [name]: newValue }));

    // Keep parent state in sync
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (!localData.full_name || !/^[A-Za-z ]+$/.test(localData.full_name)) {
      alert("Full name is required and should contain only alphabets");
      return;
    }
    if (
      !localData.contact_number ||
      !/^[0-9]{10}$/.test(localData.contact_number)
    ) {
      alert("Contact number is required and should be exactly 10 digits");
      return;
    }
    if (
      localData.linkedin_url &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.*$/.test(localData.linkedin_url)
    ) {
      alert("Please provide a valid LinkedIn URL");
      return;
    }
    if (
      localData.github_url &&
      !/^https?:\/\/(www\.)?github\.com\/.*$/.test(localData.github_url)
    ) {
      alert("Please provide a valid GitHub URL");
      return;
    }
    if (!localData.why_hire_me) {
      alert("Please provide why hire me information");
      return;
    }
    if (!localData.ai_skill_summary) {
      alert("Please provide AI skill summary");
      return;
    }

    // Send the final validated data back to parent
    onSubmit(localData);
  };

  return (
    <form
      className="w-[95%] mx-auto bg-white p-6 rounded-lg shadow-md font-sans"
      onSubmit={handleSubmit}
    >
      {/* Full Name */}
      <div className="mb-4">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="full_name">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={localData.full_name || ""}
          onChange={handleChange}
          placeholder="Enter full name"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* Contact Number */}
      <div className="mb-4">
        <label
          className="font-semibold mb-2 text-gray-700"
          htmlFor="contact_number"
        >
          Contact Number
        </label>
        <input
          type="text"
          id="contact_number"
          name="contact_number"
          value={localData.contact_number || ""}
          onChange={handleChange}
          placeholder="Enter contact number"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* LinkedIn */}
      <div className="mb-4">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="linkedin_url">
          LinkedIn URL
        </label>
        <input
          type="url"
          id="linkedin_url"
          name="linkedin_url"
          value={localData.linkedin_url || ""}
          onChange={handleChange}
          placeholder="Enter LinkedIn profile URL"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* GitHub */}
      <div className="mb-4">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="github_url">
          GitHub URL
        </label>
        <input
          type="url"
          id="github_url"
          name="github_url"
          value={localData.github_url || ""}
          onChange={handleChange}
          placeholder="Enter GitHub profile URL"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* Why Hire Me */}
      <div className="mb-4">
        <label className="font-semibold mb-2 text-gray-700" htmlFor="why_hire_me">
          Why Hire Me
        </label>
        <textarea
          id="why_hire_me"
          name="why_hire_me"
          value={localData.why_hire_me || ""}
          onChange={handleChange}
          placeholder="Explain why someone should hire you"
          rows="4"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      {/* Profile Completed */}
      <div className="mb-4 flex items-center">
        <input
          type="checkbox"
          id="profile_completed"
          name="profile_completed"
          checked={localData.profile_completed || false}
          onChange={handleChange}
          className="mr-2"
        />
        <label className="font-semibold text-gray-700" htmlFor="profile_completed">
          Profile Completed
        </label>
      </div>

      {/* AI Skill Summary */}
      <div className="mb-4">
        <label
          className="font-semibold mb-2 text-gray-700"
          htmlFor="ai_skill_summary"
        >
          AI Skill Summary
        </label>
        <textarea
          id="ai_skill_summary"
          name="ai_skill_summary"
          value={localData.ai_skill_summary || ""}
          onChange={handleChange}
          placeholder="Summarize your AI skills"
          rows="4"
          className="p-2.5 border border-gray-300 rounded-md text-sm w-full"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-3 px-5 rounded-md font-bold hover:bg-blue-700"
      >
        Save Profile
      </button>
    </form>
  );
};

export default StudentProfileForm;
