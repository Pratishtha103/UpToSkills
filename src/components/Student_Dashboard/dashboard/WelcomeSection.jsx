import React, { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
// function WelcomeSection() {
//   // 1. Initialize state for the user's name
//   const [name, setName] = useState("Learner");

//   useEffect(() => {
//     // 2. Fetch the data from the correct key: "user"
//     const userDataString = localStorage.getItem("user");
    
//     // 3. Safely parse and update the name state
//     if (userDataString) {
//       try {
//         // Your LoginForm saves student data to the 'user' key
//         const userData = JSON.parse(userDataString);
        
//         // Use the 'name' property (from full_name or company_name set in auth.js)
//         // or fall back to a safe default.
//         setName(userData.name || "Learner"); 

//       } catch (error) {
//         console.error("Error parsing user data from localStorage:", error);
//         setName("Learner");
//       }
//     } else {
//         // If no user data is found (e.g., before the token is saved on login), 
//         // keep the default "Learner". No fetching/protected calls are made here.
//         setName("Learner");
//     }
//   }, []); 


function WelcomeSection() {
  const [name, setName] = useState("Learner");
  const location = useLocation();

  // Run on first load and whenever login updates
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser.name) {
      setName(storedUser.name);
    } else {
      setName("Learner");
    }
  }, [location.state]); // ✅ runs again when coming from login
// >>>>>>> 10643f4906e20650359dd0a5d3a0fd789a2597ab

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">
          <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">

            Hey {name}. {/* Use the state variable here */}
          </h2>

          <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
            Your learning journey continues — and so does your path to real-world opportunities. 
            Hey {name}!
          </p>

          <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
            Your learning journey continues — and so does your path to real-world opportunities.  
{/* >>>>>>> 10643f4906e20650359dd0a5d3a0fd789a2597ab */}
            Earn badges, showcase projects, and get noticed by recruiters.
          </p>

          <p className="font-medium transition-colors text-blue-600 dark:text-blue-400">
            Let's turn your effort into employment!
          </p>
        </section>
      </div>

      <div className="welcome-illustration">
        <img
          src="https://thumbs.dreamstime.com/b/illustration-young-boy-coding-his-laptop-surrounded-interface-elements-perfect-education-remote-work-technology-376158298.jpg"
          alt="Learning illustration"
        />
      </div>
    </div>
  );
}

export default WelcomeSection;