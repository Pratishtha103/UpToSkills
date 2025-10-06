import { useState } from 'react';

// Import components
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Company-specific notifications data
const companyNotificationsData = [
  {
    id: 1,
    title: 'New Student Application',
    message: 'Md. Najam has applied for the MERN Stack Developer position. Review their profile and schedule an interview.',
    time: '2 hours ago',
    type: 'application'
  },
  {
    id: 2,
    title: 'Interview Confirmed',
    message: 'Astha Agrawal has confirmed the interview scheduled for tomorrow at 2:00 PM.',
    time: '4 hours ago',
    type: 'interview'
  },
  {
    id: 3,
    title: 'Hiring Milestone Reached',
    message: 'Congratulations! You have successfully hired 10 students this month.',
    time: '1 day ago',
    type: 'milestone'
  },
  {
    id: 4,
    title: 'Student Profile Updated',
    message: 'Debasmita has updated their portfolio with new React Native projects.',
    time: '1 day ago',
    type: 'profile'
  },
  {
    id: 5,
    title: 'Assessment Completed',
    message: 'Ankit has completed the UI/UX Design assessment with excellent results.',
    time: '2 days ago',
    type: 'assessment'
  },
  {
    id: 6,
    title: 'Mentorship Request',
    message: 'James Wilson has requested mentorship for Data Science career guidance.',
    time: '3 days ago',
    type: 'mentorship'
  },
  {
    id: 7,
    title: 'Interview Rescheduled',
    message: 'Lisa Chen has requested to reschedule the DevOps interview from Friday to Monday.',
    time: '3 days ago',
    type: 'interview'
  },
  {
    id: 8,
    title: 'New Badge Verification',
    message: '5 students have earned new verified badges. Review and approve pending verifications.',
    time: '5 days ago',
    type: 'verification'
  }
];

const CompanyNotificationsPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      application: '👤',
      interview: '📅',
      milestone: '🎯',
      profile: '📝',
      assessment: '📊',
      mentorship: '👥',
      verification: '✅'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-background via-accent/5 to-primary/5">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "lg:ml-64" : "ml-0"
        }`}
      >
        {/* Navbar */}
        <Navbar onMenuClick={toggleSidebar} />

        {/* Notifications Content */}
        <div className="pt-24 bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">🔔 Company Notifications</h2>
          <div className="space-y-4">
            {companyNotificationsData.map((notification) => (
              <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow" key={notification.id}>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{notification.title}</h3>
                  <p className="text-sm text-gray-600">{notification.message}</p>
                </div>
                <span className="text-xs text-gray-500 ml-4">{notification.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyNotificationsPage;
