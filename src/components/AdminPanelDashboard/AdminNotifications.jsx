import React, { useState, useEffect } from "react";

const adminNotificationsData = [
  {
    id: 1,
    title: "New Assignment Added",
    message:
      "Your instructor has added a new assignment for the Physics course.",
    time: "2 hours ago",
  },
  {
    id: 2,
    title: "New Message from Jane Cooper",
    message: "Hey, how's your project going? Let me know if you need help.",
    time: "1 day ago",
  },
  {
    id: 3,
    title: "Milestone Completed",
    message:
      'Congratulations! You have completed the "Initial Research" milestone.',
    time: "3 days ago",
  },
  {
    id: 4,
    title: "Upcoming Deadline",
    message: 'The deadline for "Complete Problem Set #5" is tomorrow.',
    time: "5 days ago",
  },
];

export default function AdminNotifications({ isDarkMode }) {
  const [hoveredId, setHoveredId] = useState(null);

  // Sync dark mode globally
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <main
      className={`p-6 min-h-screen transition-colors duration-300 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <h2 className="text-2xl font-bold mb-6">Notifications</h2>

      <div className="flex flex-col gap-4">
        {adminNotificationsData.map((notification) => (
          <div
            key={notification.id}
            onMouseEnter={() => setHoveredId(notification.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-200 cursor-default shadow-sm
              ${
                isDarkMode
                  ? "bg-gray-800 border-gray-700 text-gray-100"
                  : "bg-white border-gray-200 text-gray-900"
              }
              ${hoveredId === notification.id ? "shadow-lg" : ""}
            `}
          >
            {/* Left Section */}
            <div className="flex flex-col">
              <h3 className="font-semibold text-base mb-1">
                {notification.title}
              </h3>
              <p
                className={`text-sm ${
                  isDarkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {notification.message}
              </p>
            </div>

            {/* Right Section - Time */}
            <span
              className={`text-xs ml-4 flex-shrink-0 whitespace-nowrap ${
                isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
