import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Header from "../components/Header";
// Sample JSON data
// const studentsData = [
//   {
//     name: "Mahesh Bagul",
//     image: "https://randomuser.me/api/portraits/men/75.jpg",
//     email: "mahesh@example.com",
//     full_name: "Mahesh Bagul",
//     contact_number: "91XXXXXXXX",
//     linkedin_url: "https://linkedin.com/in/mahesh",
//     github_url: "https://github.com/mahesh",
//     why_hire_me:
//       "I am a passionate full-stack developer with expertise in React, Node.js, and cloud technologies. I have successfully delivered multiple projects and have strong problem-solving skills.",
//     profile_completed: true,
//     ai_skill_summary:
//       "Experienced in scalable backend, REST APIs, and cloud deployment.",
//   },
//   {
//     name: "Riya Sharma",
//     image: "https://randomuser.me/api/portraits/women/68.jpg",
//     email: "riya@example.com",
//     full_name: "Riya Sharma",
//     contact_number: "91XXXXXXXX",
//     linkedin_url: "https://linkedin.com/in/riya",
//     github_url: "https://github.com/riya",
//     why_hire_me:
//       "Creative front-end developer with strong UI/UX sense and modern design skills.",
//     profile_completed: true,
//     ai_skill_summary:
//       "Experienced in React, Redux, and responsive design principles.",
//   },
//   {
//     name: "Aman Verma",
//     image: "https://randomuser.me/api/portraits/men/42.jpg",
//     email: "aman@example.com",
//     full_name: "Aman Verma",
//     contact_number: "91XXXXXXXX",
//     linkedin_url: "https://linkedin.com/in/aman",
//     github_url: "https://github.com/aman",
//     why_hire_me:
//       "Dedicated backend developer skilled in Node.js and database optimization.",
//     profile_completed: true,
//     ai_skill_summary: "Database design, query optimization, and cloud deployment.",
//   },
//   {
//     name: "Sneha Kulkarni",
//     image: "https://randomuser.me/api/portraits/women/55.jpg",
//     email: "sneha@example.com",
//     full_name: "Sneha Kulkarni",
//     contact_number: "91XXXXXXXX",
//     linkedin_url: "https://linkedin.com/in/sneha",
//     github_url: "https://github.com/sneha",
//     why_hire_me:
//       "Full-stack engineer passionate about building impactful educational tools.",
//     profile_completed: true,
//     ai_skill_summary: "Knowledge in MERN stack and RESTful API development.",
//   },
//   {
//     name: "Kunal Joshi",
//     image: "https://randomuser.me/api/portraits/men/33.jpg",
//     email: "kunal@example.com",
//     full_name: "Kunal Joshi",
//     contact_number: "91XXXXXXXX",
//     linkedin_url: "https://linkedin.com/in/kunal",
//     github_url: "https://github.com/kunal",
//     why_hire_me:
//       "Cloud and DevOps enthusiast with hands-on experience in CI/CD pipelines.",
//     profile_completed: true,
//     ai_skill_summary: "Proficient in Docker, Kubernetes, and cloud architecture.",
//   },
// ];

const MultiStudent = () => {
  const [students, setStudents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch("http://localhost:5000/api/profiles")
    .then((res)=>res.json())
    .then((data) =>{
      if (data.success){
        setStudents(data.data);
      }else{
        console.log("Error fetching students:", data.message);
      }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? students.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === students.length - 1 ? 0 : prev + 1
    );
  };

  const currentStudent = students[currentIndex];

  return (
    <div className="mt-14 flex min-h-screen">
        <Header/>
      {/* Sidebar */}
      <Sidebar />

      {/* Main + Footer in one column */}
      <div className="flex flex-col flex-grow bg-white">
        <main className="flex-grow py-12 px-6 lg:px-12 overflow-auto">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Multi-Student View</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Monitor and manage all your students with their essential details
              in one glance.
            </p>
          </div>

          {/* Student Card */}
          <div className="mt-12 flex items-center justify-center space-x-6">
            {loading ? (
              <div className="w-full max-w-lg border p-6 rounded-lg shadow-md bg-gray-50 animate-pulse">
                <div className="mx-auto mb-4 rounded-full h-28 w-28 bg-gray-300"></div>
                <div className="h-6 w-3/4 bg-gray-300 mb-4 mx-auto rounded"></div>
                <div className="grid grid-cols-2 gap-y-3 text-sm">
                  {Array.from({ length: 8 }).map((_, idx) => (
                    <React.Fragment key={idx}>
                      <span className="font-medium bg-gray-300 h-4 w-24 rounded inline-block"></span>
                      <span className="bg-gray-200 h-4 w-32 rounded inline-block"></span>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : !students.length ? (
              <p className="p-6">No students found</p>
            ) : (
              <>
                <button
                  onClick={handlePrev}
                  className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100"
                >
                  ❮
                </button>

                <div className="w-full max-w-lg border p-6 rounded-lg shadow-md bg-gray-50">
                  <img
                    src={currentStudent.image}
                    alt={currentStudent.name}
                    className="mx-auto mb-4 rounded-full h-28 w-28 object-cover border-2 border-gray-300"
                  />
                  <h2 className="text-2xl font-semibold underline mb-6 text-center">
                    {currentStudent.name}
                  </h2>

                  <h3 className="text-lg font-semibold mt-4 mb-2">
                    Personal Information
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <span className="font-medium">Full Name</span>
                    <span>{currentStudent.full_name}</span>

                    <span className="font-medium">Email</span>
                    <span>{currentStudent.email}</span>

                    <span className="font-medium">Contact Number</span>
                    <span>{currentStudent.contact_number}</span>

                    <span className="font-medium">LinkedIn URL</span>
                    <a
                      href={currentStudent.linkedin_url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentStudent.linkedin_url}
                    </a>

                    <span className="font-medium">GitHub URL</span>
                    <a
                      href={currentStudent.github_url}
                      className="text-blue-600 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {currentStudent.github_url}
                    </a>

                    <span className="font-medium">Why Hire Me</span>
                    <span>{currentStudent.why_hire_me}</span>

                    <span className="font-medium">Profile Completed</span>
                    <span>{currentStudent.profile_completed ? "Yes" : "No"}</span>

                    <span className="font-medium">AI Skill Summary</span>
                    <span>{currentStudent.ai_skill_summary}</span>
                  </div>
                </div>

                <button
                  onClick={handleNext}
                  className="text-3xl p-3 rounded-full border border-gray-400 hover:bg-gray-100"
                >
                  ❯
                </button>
              </>
            )}
          </div>
        </main>

        {/* Footer stays at bottom of right side */}
        <Footer />
      </div>
    </div>
  );
};

export default MultiStudent;
