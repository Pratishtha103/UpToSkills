import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API = "http://localhost:5000";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [form, setForm] = useState({ name: "", role: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // ✅ success alert
  const [showForm, setShowForm] = useState(false);

  // --- Fetch testimonials ---
  const fetchTestimonials = async () => {
    try {
      const res = await axios.get(`${API}/api/testimonials`);
      setTestimonials(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to load testimonials");
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // --- Form handling ---
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.name.trim() || !form.message.trim()) {
      setError("Name and message are required");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/testimonials`, form);
      setTestimonials((prev) => [res.data, ...prev]);
      setForm({ name: "", role: "", message: "" });
      setShowForm(false);
      setSuccess("✅ Your review has been submitted successfully!");

      // Auto hide alert after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error(err);
      setError("Failed to submit testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between h-[450px]">
      <h3 className="font-semibold text-lg mb-4">Testimonials</h3>

      {/* --- Testimonials list --- */}
      <div className="overflow-y-auto pr-2 h-[360px] space-y-4">
        {testimonials.length === 0 ? (
          <p className="text-gray-500 text-center">
            No testimonials yet — be the first to add one!
          </p>
        ) : (
          testimonials.map((t, i) => (
            <div
              key={i}
              className="border-l-4 border-emerald-500 pl-4 text-left"
            >
              <p className="italic text-[#334155] mb-2">“{t.message.trim()}”</p>
              <p className="text-sm text-gray-600 font-medium">
                – {t.name}
                {t.role ? `, ${t.role}` : ""}
              </p>
              {t.created_at && (
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(t.created_at).toLocaleString()}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      {/* --- Button to open popup --- */}
      <div className="text-center mt-4">
       <button
  onClick={() => setShowForm(true)}
  className="bg-[#FF6A28] text-white font-bold px-5 py-2 rounded hover:bg-green-500 transition-all duration-300"
>
  Give Review
</button>

      </div>

      {/* ✅ Success Alert */}
      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-5 right-5 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
        >
          {success}
        </motion.div>
      )}

      {/* --- Popup Modal --- */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-8 w-[90%] max-w-md relative"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✖
            </button>
            <h4 className="font-semibold mb-4 text-xl">Add a Testimonial</h4>
            {error && <div className="text-red-500 mb-3">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="block text-sm mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-1">Role (optional)</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm mb-1">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </div>
              <button
                type="submit"
                className="bg-[#FF6A28] text-white px-4 py-2 rounded w-full"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
