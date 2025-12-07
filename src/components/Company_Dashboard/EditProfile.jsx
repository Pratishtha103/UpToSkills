import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTheme } from "../../context/ThemeContext";

export default function EditProfile() {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    industry: "",
    contact: "",
    logo: null,
    logoPreview: null,
  });

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

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
            companyName: data.name || data.company_name || "",
            website: data.website || "",
            industry: data.industry || "",
            contact: data.contact || "",
            logo: null,
            logoPreview: data.logo_url
              ? `http://localhost:5000${data.logo_url}`
              : null,
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
    <>
      <div className="flex flex-col min-h-screen">
        {/* Main Content */}
        <main className="flex-grow flex justify-center items-start p-6">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-900 dark:text-white shadow-lg rounded-xl p-8 mt-10">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
              {formData.companyName ? "Edit Company Profile" : "Add Company Profile"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              encType="multipart/form-data"
            >
              {/* Company Name */}
              <div>
                <label className="block font-semibold mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>

              {/* Company Logo */}
              <div class="flex items-center justify-center w-full">
                <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-50 bg-neutral-secondary-medium border border-dashed border-default-strong rounded cursor-pointer hover:bg-neutral-tertiary-medium">
                  <div class="flex flex-col items-center justify-center text-body pt-5 pb-6">
                    <svg class="w-8 h-8 mb-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h3a3 3 0 0 0 0-6h-.025a5.56 5.56 0 0 0 .025-.5A5.5 5.5 0 0 0 7.207 9.021C7.137 9.017 7.071 9 7 9a4 4 0 1 0 0 8h2.167M12 19v-9m0 0-2 2m2-2 2 2" /></svg>
                    <p class="mb-2 text-sm"><span class="font-semibold">Click to upload</span> or drag & drop</p>
                    <p class="text-xs">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input id="dropzone-file" accept="image/*" type="file" class="hidden" onChange={handleLogoChange} />
                </label>
              </div>
              {formData.logoPreview && (
                  <img
                    src={formData.logoPreview}
                    alt="Logo Preview"
                    className="mt-4 h-50 object-contain rounded-lg border"
                  />
                )}
              {/* <div>
                <label className="block font-semibold mb-2">Company Logo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="w-full border rounded-lg px-3 py-2 dark:bg-gray-800"
                />
                
              </div> */}

              {/* Website */}
              <div>
                <label className="block font-semibold mb-2">Website URL</label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
                />
              </div>

              {/* Industry */}
              <div>
                <label className="block font-semibold mb-2">Industry Type</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  required
                  className="w-full border rounded-lg px-4 py-2 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block font-semibold mb-2">Company Contact</label>
                <input
                  type="text"
                  name="contact"
                  value={formData.contact}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800"
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
        </main>
      </div>
      <footer
        className="w-full mt-2 text-gray-700   dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 text-center py-4 text-sm transition-colors duration-300 "
      >
        <p>© 2025 Uptoskills. Built by learners.</p>
      </footer>
    </>
  );
}