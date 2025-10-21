import React, { useMemo, useState } from 'react';
import { FaCloud, FaShieldAlt, FaLaptopCode, FaChartLine, FaSearch, FaTags } from 'react-icons/fa';

// Metadata for programs (kept local for now)
const programs = [
  {
    id: 'cloud-computing',
    title: 'Cloud Computing',
    desc:
      'Master Cloud platforms (AWS/Azure/GCP), Docker, Kubernetes and cloud security with hands-on labs.',
    skills: ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes'],
    icon: FaCloud,
    path: '/cloud-computing',
  },
  {
    id: 'cyber-security',
    title: 'Cyber Security',
    desc:
      'Learn ethical hacking, threat analysis, digital forensics and defensive techniques to secure systems.',
    skills: ['Ethical Hacking', 'Forensics', 'Cryptography'],
    icon: FaShieldAlt,
    path: '/cyber-security',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    desc:
      'Full-stack web development with modern frontend and backend technologies, deployment and testing.',
    skills: ['React', 'Node.js', 'HTML', 'CSS'],
    icon: FaLaptopCode,
    path: '/web-development',
  },
  {
    id: 'data-science',
    title: 'Data Science',
    desc:
      'Data analysis, visualization and machine learning with Python, pandas, and scikit-learn.',
    skills: ['Python', 'Pandas', 'Machine Learning'],
    icon: FaChartLine,
    path: '/data-science',
  },
];

export default function ProgramsAdmin({ isDarkMode, onNavigateSection }) {
  const [query, setQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(null);

  const allTags = useMemo(() => {
    const s = new Set();
    programs.forEach(p => p.skills.forEach(sk => s.add(sk)));
    return Array.from(s);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter(p => {
      const matchesQuery = !q || p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.skills.join(' ').toLowerCase().includes(q);
      const matchesTag = !selectedTag || p.skills.includes(selectedTag);
      return matchesQuery && matchesTag;
    });
  }, [query, selectedTag]);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} min-h-screen p-6`}> 
      <header className="mb-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold">Programs</h1>
            <p className={`mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Overview of all courses and quick actions.</p>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => onNavigateSection && onNavigateSection('dashboard')} className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'} shadow-sm border`}>← Back</button>
            <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">New Program</button>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-2/3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg w-full ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm border`}>
              <FaSearch className={`${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search programs, skills, descriptions..."
                className={`w-full bg-transparent outline-none ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-auto">
            <span className={`inline-flex items-center text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}><FaTags className='mr-2'/>Tags:</span>
            {allTags.slice(0, 8).map(tag => (
              <button key={tag} onClick={() => setSelectedTag(selectedTag === tag ? null : tag)} className={`text-sm px-3 py-1 rounded-full ${selectedTag === tag ? 'bg-indigo-600 text-white' : isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} border`}>{tag}</button>
            ))}
          </div>
        </div>
      </header>

      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(p => {
            const Icon = p.icon;
            return (
              <div key={p.id} className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-2xl p-8 lg:p-10 shadow hover:shadow-lg transition`}>
                <div className="flex items-start gap-6">
                  <div className={`${isDarkMode ? 'bg-gray-900' : 'bg-indigo-50'} p-4 rounded-xl text-indigo-600`}> 
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-semibold mb-2">{p.title}</h3>
                    <p className={`text-sm lg:text-base mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{p.desc}</p>

                    <div className="flex flex-wrap gap-3 mb-2">
                      {p.skills.map(sk => (
                        <span key={sk} className={`text-sm lg:text-sm px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>{sk}</span>
                      ))}
                    </div>

                    {/* removed action buttons per request */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
