import React from "react";
import { BriefcaseIcon, Users, Target,GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { FaLinkedin, FaPhone, FaEnvelope } from "react-icons/fa";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function AboutUs() {
  return (
    <div className="mt-14 flex min-h-screen">
                <Header/>
                {/* Sidebar Navbar */}
                <Sidebar />
    <div className="pt-20 px-2 sm:px-4 py-6 mx-auto dark:text-white dark:bg-gray-900">
      <motion.div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-xl p-8 w-full border border-gray-100 dark:border-gray-800 transition-all duration-300 hover:shadow-2xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
       <div className="flex items-center justify-between mb-6">
  <div className="flex items-center gap-4">
    <div className="p-3 rounded-full bg-gradient-to-r from-[#01BDA5] to-[#43cea2] text-white shadow-md">
      <Users className="w-6 h-6" />
    </div>
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
        About UptoSkill
      </h1>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        Empowering students to showcase their talent, learn through real-world projects, and connect with mentors and companies.
      </p>
    </div>
  </div>

  <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <section>
    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-blue-500 pl-3">
      Our Mission
    </h2>
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      At UptoSkill, our mission is to bridge the gap between learning and employment by giving students a platform to enhance their skills, build portfolios, and gain exposure to industry-ready challenges.
    </p>

    <h3 className="mt-4 text-md font-semibold text-gray-700 dark:text-gray-200">What we offer</h3>
    <ul className="list-disc pl-5 mt-2 text-gray-700 dark:text-gray-300 leading-relaxed">
      <li>Access to hands-on projects and learning challenges.</li>
      <li>Personalized skill badges and performance tracking.</li>
      <li>Opportunities to connect with mentors and hiring teams.</li>
    </ul>
  </section>

  <section>
    <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2 border-l-4 border-green-400 pl-3">
      Values & Approach
    </h2>
    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
      We believe in learning by doing. UptoSkill encourages students to apply knowledge, collaborate with peers, and showcase their progress in a transparent and motivating environment.
    </p>

    <div className="mt-4 p-4 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
      <h4 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-white">
        <Target className="w-4 h-4" /> Why students love UptoSkill
      </h4>
      <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
        UptoSkill helps students build real-world skills, gain recognition, and get ready for job opportunities through guided mentorship and verified achievements.
      </p>
    </div>
  </section>
</div>

<div className="mt-6 border-t pt-6 text-sm text-gray-600 dark:text-gray-400">
  <p>
    UptoSkill is more than a platform—it's a growth partner for students. From guided learning to showcasing your capabilities, every feature is designed to help you reach your career goals.
  </p>
</div>


      </motion.div>
          
              {/* Contact Info Section */}
                    <section className="w-full mx-auto py-16 px-4 text-center bg-white">
                      <p className="text-orange-500 font-semibold uppercase">Our Contacts</p>
                      <h2 className="text-4xl font-bold mt-2">We're here to Help You</h2>
                      <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                        Got a project in mind? We’d love to hear about it. Take five minutes to fill out our project form
                        so that we can get to know you and understand your project.
                      </p>
              
                      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        <a href ="https://www.linkedin.com/company/uptoskills/posts/?feedView=all"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
                          <FaLinkedin className="text-orange-500 mx-auto mb-4" size={40} />
                          <h3 className="text-xl font-semibold mb-2">Get to Know Us:</h3>
                          <p>www.Linked In.com</p>
                        </div>
                        </a>
                         <a
                      href="tel:+919319772294">
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
                          <FaPhone className="text-orange-500 mx-auto mb-4" size={40} />
                          <h3 className="text-xl font-semibold mb-2">Phone Us 24/7:</h3>
                          <p className="text-gray-600">+91 (931) 977 2294</p>
                        </div>
                        </a>
              
                        <a
                      href="https://mail.google.com/mail/u/0/?tab=rm&ogbl#inbox?compose=DmwnWrRpctPQbXNFtntrNcJqHZhhCzgrmTlQmCzbLtpmfMxDWlctnGFFgpGsCfrDMfkFmDBTtkRV"
                      target="_blank"
                      rel="noopener noreferrer"
                      
                      >
                        <div className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition">
                          <FaEnvelope className="text-orange-500 mx-auto mb-4" size={40} />
                          <h3 className="text-xl font-semibold mb-2">Mail Us 24/7:</h3>
                          <p className="text-gray-600">info@uptoskills.com</p>
                        </div>
                        </a>
                      </div>
                    </section>
              
    </div>
    </div>
  );
}
