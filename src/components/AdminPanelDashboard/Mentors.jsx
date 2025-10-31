import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaTrash, FaEnvelope, FaPhone } from 'react-icons/fa';

const MentorCard = ({ mentor, onDelete }) => (
  <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-4 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{mentor.full_name}</h4>
      <button
        onClick={() => onDelete(mentor.id)}
        className="text-sm text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md flex items-center gap-2"
      >
        <FaTrash />
        Delete
      </button>
    </div>

    <div className="text-sm text-gray-600 dark:text-gray-300 flex flex-col gap-1">
      <div className="flex items-center gap-2"><FaEnvelope /> <span>{mentor.email}</span></div>
      <div className="flex items-center gap-2"><FaPhone /> <span>{mentor.phone}</span></div>
    </div>
  </div>
);

export default function Mentors({ isDarkMode }) {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const fetchMentors = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/mentors');
      setMentors(res.data || []);
    } catch (err) {
      console.error('Failed to load mentors', err);
      setError('Unable to load mentors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMentors();
  }, []);

  const deleteMentor = async (id) => {
    if (!confirm('Delete this mentor?')) return;
    try {
      await axios.delete(`${API_BASE}/api/mentors/${id}`);
      setMentors((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error('Failed to delete mentor', err);
      alert('Failed to delete mentor');
    }
  };

  if (loading) return <div className="p-4">Loading mentors...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <section className="p-6">
      <h2 className={`text-2xl font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Mentors</h2>
      {mentors.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300">No mentors found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentors.map((m) => (
            <MentorCard key={m.id} mentor={m} onDelete={deleteMentor} />
          ))}
        </div>
      )}
    </section>
  );
}
