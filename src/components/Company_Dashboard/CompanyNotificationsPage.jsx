// src/pages/CompanyNotificationsPage.jsx
import React, { useEffect, useState } from "react";

// Simple list of notifications to show on the page
const companyNotificationsData = [
  { id: 1, title: "New Student Application", message: "Md. Najam has applied for the MERN Stack Developer position. Review their profile and schedule an interview.", time: "2 hours ago", type: "application" },
  { id: 2, title: "Interview Confirmed", message: "Astha Agrawal has confirmed the interview scheduled for tomorrow at 2:00 PM.", time: "4 hours ago", type: "interview" },
  { id: 3, title: "Hiring Milestone Reached", message: "Congratulations! You have successfully hired 10 students this month.", time: "1 day ago", type: "milestone" },
  { id: 4, title: "Student Profile Updated", message: "Debasmita has updated their portfolio with new React Native projects.", time: "1 day ago", type: "profile" },
  { id: 5, title: "Assessment Completed", message: "Ankit has completed the UI/UX Design assessment with excellent results.", time: "2 days ago", type: "assessment" },
  { id: 6, title: "Mentorship Request", message: "James Wilson has requested mentorship for Data Science career guidance.", time: "3 days ago", type: "mentorship" },
  { id: 7, title: "Interview Rescheduled", message: "Lisa Chen has requested to reschedule the DevOps interview.", time: "3 days ago", type: "interview" },
  { id: 8, title: "New Badge Verification", message: "5 students have earned new verified badges.", time: "5 days ago", type: "verification" },
];

const CompanyNotificationsPage = ({ isDarkMode: propIsDarkMode } = {}) => {

  // This controls dark mode on the page
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof propIsDarkMode !== "undefined") return propIsDarkMode;

    try {
      if (typeof window !== "undefined") {
        if (document.documentElement.classList.contains("dark")) return true;
        return localStorage.getItem("isDarkMode") === "true";
      }
    } catch (e) {}

    return false;
  });

  useEffect(() => {
    // Update when parent gives isDarkMode
    if (typeof propIsDarkMode !== "undefined") {
      setIsDarkMode(propIsDarkMode);
      return;
    }

    // Update dark mode if changed from another tab
    const onStorage = (e) => {
      if (e.key === "isDarkMode") setIsDarkMode(e.newValue === "true");
    };
    window.addEventListener("storage", onStorage);

    // Update when HTML class changes
    const obs = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      window.removeEventListener("storage", onStorage);
      obs.disconnect();
    };
  }, [propIsDarkMode]);

  // Small function: gives emoji based on notification type
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
    // Main page container
    <div className={`p-6 w-full`}>

      {/* Page heading */}
      <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-gray-100' : 'text-gray-900'} mb-6 flex items-center gap-2`}>
        🔔 Company Notifications
      </h2>

      {/* Showing all notifications */}
      <div className="space-y-4">
        {companyNotificationsData.map((notification) => (
          
          // Each notification box
          <div
            key={notification.id}
            className={`rounded-lg p-4 flex justify-between items-start shadow-sm hover:shadow-md transition-shadow border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>

            {/* Left side: icon,title and message */}
            <div className="flex items-start gap-3">
              <div className="text-2xl">{getNotificationIcon(notification.type)}</div>

              <div>
                {/* Notification title */}
                <h3 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                  {notification.title}
                </h3>

                {/* Notification message */}
                <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'} text-sm`}>
                  {notification.message}
                </p>
              </div>
            </div>

            {/* Right side: time */}
            <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs ml-4 whitespace-nowrap`}>
              {notification.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyNotificationsPage;
