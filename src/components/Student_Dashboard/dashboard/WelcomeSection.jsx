import React from 'react';

function WelcomeSection() {
  // ✅ यहाँ से user का नाम लेंगे (login के समय जो store होगा)
  const userName = localStorage.getItem("username") || "User";

  return (
    <div className="welcome-section">
      <div className="welcome-content">
        <h1>Hey {userName}.</h1>
        <p>Your learning journey continues — and so does your path to real-world opportunities.</p>
        <p>Earn badges, showcase projects, and get noticed by recruiters.</p>
        <p><strong>Let's turn your effort into employment!</strong></p>
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
