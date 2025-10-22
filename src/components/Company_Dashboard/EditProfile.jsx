import React, { useState, useEffect } from "react";
import axios from "axios";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    contact: "",
    logo: null,
    logoPreview: null,
  });

  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token"); // get JWT token

  // Fetch existing profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/company-profiles/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data.success) {
          const data = res.data.data;
          setFormData({
            companyName: data.name || "",
            website: data.website || "",
            industry: data.industry || "",
            contact: data.contact || "",
            logo: null,
            logoPreview: data.logo_url ? `http://localhost:5000${data.logo_url}` : null,
          });
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        logo: file,
        logoPreview: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append("name", formData.companyName);
      fd.append("website", formData.website);
      fd.append("industry", formData.industry);
      fd.append("contact", formData.contact);
      if (formData.logo) fd.append("logo", formData.logo);

      const res = await axios.put(
        "http://localhost:5000/api/company-profiles",
        fd,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Profile saved successfully!");
        console.log("Response:", res.data.data);
      } else {
        alert("Failed to save profile.");
      }
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      alert("Failed to save profile.");
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-8 shadow-lg border border-gray-200 rounded-xl mt-10 dark:bg-gray-900 dark:text-white">
      <h2 className="text-3xl font-bold mb-8 text-center">
        {formData.companyName ? "Edit Company Profile" : "Add Company Profile"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        encType="multipart/form-data"
      >
        {/* Company Name */}
        <div>
          <label className="block font-semibold mb-2">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Logo */}
        <div>
          <label className="block font-semibold mb-2">
            Company Logo
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full border rounded-lg px-3 py-2"
          />
          {formData.logoPreview && (
            <img
              src={formData.logoPreview}
              alt="Logo Preview"
              className="mt-4 h-28 object-contain rounded-lg border"
            />
          )}
        </div>

        {/* Website */}
        <div>
          <label className="block font-semibold mb-2">
            Website URL
          </label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Industry */}
        <div>
          <label className="block font-semibold mb-2">
            Industry Type
          </label>
          <select
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select industry</option>
            <option value="IT">IT / Technology</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Contact */}
        <div>
          <label className="block font-semibold mb-2">
            Company Contact
          </label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
        >
          Save Details
        </button>
      </form>
    </div>
  );
}
