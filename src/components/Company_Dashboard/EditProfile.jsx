import React, { useState } from "react";
import axios from "axios";

export default function AddCompanyProfile() {
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    contact: "",
    logo: null,
    logoPreview: null,
  });

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

      const res = await axios.post(
        "http://localhost:5000/api/company-profiles",
        fd
      );

      alert("Company profile added successfully!");
      console.log("Response:", res.data);

      // Reset form
      setFormData({
        companyName: "",
        website: "",
        industry: "",
        contact: "",
        logo: null,
        logoPreview: null,
      });
      e.target.reset();
    } catch (err) {
      console.error("Submission failed:", err.response?.data || err.message);
      alert("Failed to add profile.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        Add Company Profile
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
        {/* Company Name */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
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
          <label className="block text-gray-700 font-semibold mb-2">
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
          <label className="block text-gray-700 font-semibold mb-2">
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
          <label className="block text-gray-700 font-semibold mb-2">
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
          <label className="block text-gray-700 font-semibold mb-2">
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
