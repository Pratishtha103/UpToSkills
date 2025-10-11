// src/pages/CompanyNotificationsPage.jsx
import React from "react";

// ✅ Company-specific notifications data
const companyNotificationsData = [
  {
    id: 1,
    title: "New Student Application",
    message:
      "Md. Najam has applied for the MERN Stack Developer position. Review their profile and schedule an interview.",
    time: "2 hours ago",
    type: "application",
  },
  {
    id: 2,
    title: "Interview Confirmed",
    message:
      "Astha Agrawal has confirmed the interview scheduled for tomorrow at 2:00 PM.",
    time: "4 hours ago",
    type: "interview",
  },
  {
    id: 3,
    title: "Hiring Milestone Reached",
    message:
      "Congratulations! You have successfully hired 10 students this month.",
    time: "1 day ago",
    type: "milestone",
  },
  {
    id: 4,
    title: "Student Profile Updated",
    message:
      "Debasmita has updated their portfolio with new React Native projects.",
    time: "1 day ago",
    type: "profile",
  },
  {
    id: 5,
    title: "Assessment Completed",
    message:
      "Ankit has completed the UI/UX Design assessment with excellent results.",
    time: "2 days ago",
    type: "assessment",
  },
  {
    id: 6,
    title: "Mentorship Request",
    message:
      "James Wilson has requested mentorship for Data Science career guidance.",
    time: "3 days ago",
    type: "mentorship",
  },
  {
    id: 7,
    title: "Interview Rescheduled",
    message:
      "Lisa Chen has requested to reschedule the DevOps interview from Friday to Monday.",
    time: "3 days ago",
    type: "interview",
  },
  {
    id: 8,
    title: "New Badge Verification",
    message:
      "5 students have earned new verified badges. Review and approve pending verifications.",
    time: "5 days ago",
    type: "verification",
  },
];

const CompanyNotificationsPage = () => {
  const getNotificationIcon = (type) => {
    const icons = {
      application: "👤",
      interview: "📅",
      milestone: "🎯",
      profile: "📝",
      assessment: "📊",
      mentorship: "👥",
      verification: "✅",
    };
    return icons[type] || "🔔";
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
        🔔 Company Notifications
      </h2>

      <div className="space-y-4">
        {companyNotificationsData.map((notification) => (
          <div
            key={notification.id}
            className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">
                {getNotificationIcon(notification.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {notification.title}
                </h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
              </div>
            </div>
            <span className="text-xs text-gray-500 ml-4 whitespace-nowrap">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyNotificationsPage;
