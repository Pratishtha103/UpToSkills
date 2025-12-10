import mentorimg from "../../../assets//mentor_illustration.png";

function WelcomeSection() {
  // 🔹 Fetch mentor info from localStorage
  const mentorData = JSON.parse(localStorage.getItem("mentor"));

  // 🔹 Use saved mentor name, or fallback to "Mentor"
  const mentorName = mentorData && mentorData.name ? mentorData.name : "Mentor";

  return (
    // 🔹 Main container for the welcome section
    <div className="welcome-section flex p-2 rounded-2xl bg-gray-100 dark:bg-gray-700">
      
      {/* 🔹 Left side: Text content */}
      <div className="welcome-content">
        <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">

          {/* 👋 Dynamic greeting */}
          <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">
            Hey {mentorName}.
          </h2>

          {/* 📄 Description / motivational text */}
          <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
            Your guidance empowers the next generation — and shapes real-world success stories.
            Mentor projects, award badges, and help learners shine in front of recruiters.
          </p>

          {/* 🔹 Highlighted supportive line */}
          <p className="font-medium transition-colors text-blue-600 dark:text-blue-400">
            Let’s turn your mentorship into meaningful impact!
          </p>
        </section>
      </div>

      {/* 🔹 Right side: illustration image */}
      <div className="welcome-illustration">
        <img
          src={mentorimg}
          alt="Mentor"
          width="200px"
          className="rounded-2xl"
        />
      </div>

    </div>
  );
}

export default WelcomeSection;
