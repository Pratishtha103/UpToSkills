import React, { useEffect, useMemo, useState } from 'react';

function downloadCSV(filename, rows) {
  if (!rows.length) return;
  const header = Object.keys(rows[0]).join(',') + '\n';
  const csv = rows
    .map(r => Object.values(r).map(v => `"${String(v ?? '')}"`).join(','))
    .join('\n');
  const blob = new Blob([header + csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function CoursesTable({ isDarkMode, onNavigateSection }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 12;

  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses');
        const data = await res.json();
        if (!mounted) return;
        setCourses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching courses:', err);
        if (mounted) setCourses([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchCourses();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(c =>
      String(c.title || '').toLowerCase().includes(q) ||
      String(c.description || '').toLowerCase().includes(q) ||
      String(c.id || '').includes(q)
    );
  }, [courses, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => { if (page > pageCount) setPage(1); }, [pageCount]);

  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <main className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} p-4 sm:p-6 min-h-screen`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateSection && onNavigateSection('dashboard')}
            className="px-3 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            ← Back
          </button>
          <h2 className="text-2xl font-bold">All Courses</h2>
          <span className="text-sm text-gray-500 dark:text-gray-400">({courses.length})</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search title or description..."
            className="px-3 py-2 rounded-md border bg-transparent text-sm outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
          <button
            onClick={() => downloadCSV('courses.csv', filtered)}
            className="px-3 py-2 rounded-md bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
            disabled={filtered.length === 0}
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
          ))}
        </div>
      ) : (
        <div className={`overflow-x-auto rounded-md shadow-sm border ${isDarkMode ? 'border-gray-700' : ''}`}>
          <table className="min-w-full table-auto border-collapse">
            <thead className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <tr className={`text-left border-b ${isDarkMode ? 'border-gray-700' : ''}`}>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Description</th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr><td colSpan={3} className="p-4 text-center">No courses found.</td></tr>
              ) : pageData.map(c => (
                <tr key={c.id} className={`border-b ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <td className="px-4 py-3 align-top">{c.id}</td>
                  <td className="px-4 py-3 align-top">{c.title}</td>
                  <td className="px-4 py-3 align-top">{c.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className={`${isDarkMode ? 'text-gray-300' : 'text-sm text-gray-500'}`}>
          Showing {Math.min((page-1)*pageSize+1, filtered.length)}-{Math.min(page*pageSize, filtered.length)} of {filtered.length}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            className={`px-3 py-1 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}
          >Prev</button>
          <span className={`px-2 py-1 border rounded ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}>{page} / {pageCount}</span>
          <button
            disabled={page === pageCount}
            onClick={() => setPage(p => Math.min(pageCount, p + 1))}
            className={`px-3 py-1 rounded border ${isDarkMode ? 'bg-gray-800 border-gray-600 text-gray-200' : ''}`}
          >Next</button>
        </div>
      </div>
    </main>
  );
}
