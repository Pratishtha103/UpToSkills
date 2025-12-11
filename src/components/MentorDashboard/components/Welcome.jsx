// Imports the  image for the mentor section from the assets directory
import mentorimg from "../../../assets//mentor_illustration.png";

<<<<<<< Updated upstream
function WelcomeSection() {
  // 🔹 Fetch mentor info from localStorage
  const mentorData = JSON.parse(localStorage.getItem("mentor"));

  // 🔹 Use saved mentor name, or fallback to "Mentor"
  const mentorName = mentorData && mentorData.name ? mentorData.name : "Mentor";
=======
//  Defines the 'WelcomeSection' component, which handles the introductory  on the dashboard
function WelcomeSection() {
  // Retrieves and parses the mentor data stored locally in the browser's storage
  const mentorData = JSON.parse(localStorage.getItem("mentor"));
>>>>>>> Stashed changes

  // Extracts the mentor's name from the data; defaults to "Mentor" if the name is not available
  const mentorName = mentorData && mentorData.name ? mentorData.name : "Mentor";

  // /Renders the main structure of the welcome section
  return (
<<<<<<< Updated upstream
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
=======
    <div className="welcome-section flex p-2 rounded-2xl bg-gray-100 dark:bg-gray-700">
      {/* Container for the textual content (greeting and motivational message) */}
      <div className="welcome-content">
        {/* Section containing the personalized greeting and detailed message. */}
        <section className="p-6 rounded-2xl mb-8 transition-all duration-300 bg-gray-100 dark:bg-[#1e293b]">
          {/* Displays the personalized greeting, including the fetched mentor's name. */}
          <h2 className="text-3xl font-bold mb-2 transition-colors text-gray-800 dark:text-white">
            Hey {mentorName}.
          </h2>

          {/* Primary motivational text guiding the mentor on their role. */}
          <p className="text-base leading-relaxed mb-2 transition-colors text-gray-700 dark:text-gray-300">
            Your guidance empowers the next generation — and shapes real-world
            success stories. Mentor projects, award badges, and help learners
            shine in front of recruiters.
          </p>

          {/* Highlighted call-to-action message. */}
          <p className="font-medium transition-colors text-blue-600 dark:text-blue-400">
            Let’s turn your mentorship into meaningful impact!
          </p>
        </section>
      </div>

      {/* Container for the visual illustration (mentor image). */}
>>>>>>> Stashed changes
      <div className="welcome-illustration">
        <img
          src={mentorimg}
          alt="Mentor"
          width="200px"
          className="rounded-2xl"
        />
      </div>
<<<<<<< Updated upstream

=======
>>>>>>> Stashed changes
    </div>
  );
}

// Exports the WelcomeSection component for use in other parts of the application (dashboard)
export default WelcomeSection;
