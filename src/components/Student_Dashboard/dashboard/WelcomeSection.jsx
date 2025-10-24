import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

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

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">
          <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">
            Hey {name}!
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
