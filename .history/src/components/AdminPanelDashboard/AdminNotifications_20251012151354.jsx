import React, { useState } from "react";

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

const AdminNotifications = () => {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
        Notifications
      </h2>
      <div className="flex flex-col gap-4">
        {adminNotificationsData.map((notification) => (
          <div
            key={notification.id}
            onMouseEnter={() => setHoveredId(notification.id)}
            onMouseLeave={() => setHoveredId(null)}
            className={`
              flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200 cursor-default
              ${hoveredId === notification.id ? "shadow-lg" : ""}
            `}
          >
            <div className="flex flex-col">
              <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-base mb-1">
                {notification.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-300 text-sm">
                {notification.message}
              </p>
            </div>
            <span className="text-gray-400 dark:text-gray-400 text-xs ml-4 flex-shrink-0 whitespace-nowrap">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotifications;
