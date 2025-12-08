import { useState } from 'react';
import './NotificationPage.css';

// Imports file      
import Header from '../dashboard/Header';
import Sidebar from '../dashboard/Sidebar';
import { useTheme } from '../../../context/ThemeContext';

// Sample data for the notifications
const notificationsData = [
  { 
    id: 1, 
    title: 'New Assignment Added', 
    message: 'Your instructor has added a new assignment for the Physics course.', 
    time: '2 hours ago' 
  },
  { 
    id: 2, 
    title: 'New Message from Jane Cooper', 
    message: "Hey, how's your project going? Let me know if you need help.", 
    time: '1 day ago' 
  },
  { 
    id: 3, 
    title: 'Milestone Completed', 
    message: 'Congratulations! You have completed the "Initial Research" milestone.', 
    time: '3 days ago' 
  },
  { 
    id: 4, 
    title: 'Upcoming Deadline', 
    message: 'The deadline for "Complete Problem Set #5" is tomorrow.', 
    time: '5 days ago' 
  },
];

const NotificationsPage = () => {
  const { darkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isOpen ? "lg:ml-64" : "ml-0"}`}>
        <Header onMenuClick={toggleSidebar} />
        
        {/* content in notification page */}
        <div className={`pt-24 px-6 py-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>🔔 Notifications</h2>
          <div className="space-y-4">
            {notificationsData.map((notification) => (
              <div className={`p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} border`} key={notification.id}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>{notification.title}</h3>
                    <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{notification.message}</p>
                  </div>
                  <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
