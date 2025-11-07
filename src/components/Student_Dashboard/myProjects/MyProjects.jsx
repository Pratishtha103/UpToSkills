// import React, { useState } from 'react';
// import Sidebar from '../dashboard/Sidebar';
// import Header from '../dashboard/Header';
// import ProjectSubmissionForm from './ProjectSubmissionForm';

// function MyProjects({ isDarkMode, toggleDarkMode }) {
//   const [isOpen, setIsOpen] = useState(true);

//   const toggleSidebar = () => setIsOpen(prev => !prev);

//   return (
//     <div
//       className={`flex min-h-screen transition-all duration-300
//       ${isDarkMode ? "dark bg-gray-900" : "bg-gray-100"}`}
//     >
//       <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />

//       <div
//         className={`flex-1 flex flex-col transition-all duration-300
//           ${isOpen ? "lg:ml-[250px]" : "ml-0"}`}
//       >
//         <Header
//           onMenuClick={toggleSidebar}
//           isDarkMode={isDarkMode}
//           toggleDarkMode={toggleDarkMode}
//         />

//         <div className="flex justify-center items-start px-4 py-4 w-full">
//           <ProjectSubmissionForm />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default MyProjects;


import React, { useState } from 'react';
import Sidebar from '../dashboard/Sidebar';
import Header from '../dashboard/Header';
import ProjectSubmissionForm from './ProjectSubmissionForm';

function MyProjects({ isDarkMode, toggleDarkMode }) {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(prev => !prev);

  return (
    // ✅ Added 'dark' class conditionally to the parent container
    <div className={`${isDarkMode ? "dark" : ""} min-h-screen transition-all duration-300`}>
      <div
        className={`flex min-h-screen transition-all duration-300 
        bg-gray-100 dark:bg-gray-900`}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isDarkMode={isDarkMode} />

        <div
          className={`flex-1 flex flex-col transition-all duration-300
            ${isOpen ? "lg:ml-[250px]" : "ml-0"}`}
        >
          <Header
            onMenuClick={toggleSidebar}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />

          <div className="flex justify-center items-start px-4 py-4 w-full">
            <ProjectSubmissionForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyProjects;