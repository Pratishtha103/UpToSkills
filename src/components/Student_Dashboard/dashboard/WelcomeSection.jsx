import React, { useState, useEffect } from "react";
// Import useLocation from the incoming code to handle name refreshing
import { useLocation } from "react-router-dom"; 

function WelcomeSection() {
  const [name, setName] = useState("Learner");
  const location = useLocation(); // Keep this hook from the incoming code

  // Merged useEffect logic: Use the cleaner approach from the incoming code
  // and make it run on location.state change (after login/navigation).
  useEffect(() => {
    // Safely retrieve and parse the 'user' object from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    
    // Check if the 'name' property exists in the stored user data
    if (storedUser.name) {
      setName(storedUser.name);
    } else {
      // Fallback to the default if the data is not found or incomplete
      setName("Learner");
    }
  }, [location.state]); // Dependency array: Re-run when navigation state changes

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">
          <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">
            Hey {name}! {/* Keep the Hey {name} format from HEAD/Incoming */}
          </h2>

          <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
            Your learning journey continues — and so does your path to real-world opportunities.
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