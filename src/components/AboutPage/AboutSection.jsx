// src/components/AboutSection.jsx
import React from 'react';
import Testimonials from './Testimonials';
import communityImpact from"../../assets/community2.png"

const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-8">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[32px] font-bold mb-8 animate-[fadeInUp_0.6s_ease]">About Uptoskills</h2>
        <p className="text-[#64748b] text-[17px] mb-12">
          Uptoskills is a vibrant peer-to-peer learning platform that empowers tech enthusiasts to acquire
          practical skills through collaboration, mentorship, and real-world projects. Our mission is to make
          tech education accessible and impactful for all.
        </p>

        {/* mission/approach */}
        <div className="grid grid-cols-1 gap-8 mb-12 md:grid-cols-2">
          <div className="bg-white p-8 rounded-xl shadow-sm transition-transform duration-300 ease hover:scale-105 text-left">
            <h3 className="font-semibold mb-4">Our Mission</h3>
            <p className="text-[#64748b] text-[17px]">To democratize tech education by offering collaborative, hands-on learning experiences that empower learners from all backgrounds to succeed in the tech industry.</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm transition-transform duration-300 ease hover:scale-105 text-left">
            <h3 className="font-semibold mb-4">Our Approach</h3>
            <p className="text-[#64748b] text-[17px]">We champion learning by doing, connecting learners with peers and mentors to tackle real-world challenges and build skills that drive career success.</p>
          </div>
        </div>

        {/* Vision */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
          <p className="text-[#64748b] mb-8">We envision a world where tech education is universally accessible, fostering innovation and empowering individuals to shape the future of technology.</p>
          <img src="https://img.freepik.com/free-vector/teamwork-concept-illustration_114360-1007.jpg?semt=ais_hybrid&w=740" alt="Teamwork" className="max-w-[600px] w-full mx-auto rounded-xl shadow-lg" />
        </div>

        {/* Values */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-4">Our Values</h3>
          <div className="grid grid-cols-1 gap-8 mb-8 md:grid-cols-3">
            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform duration-300 ease hover:scale-105 text-left">
              <h4 className="font-semibold mb-4">Collaboration</h4>
              <p className="text-[#64748b] text-[17px]">We unite diverse perspectives to solve complex challenges through collective learning.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform duration-300 ease hover:scale-105 text-left">
              <h4 className="font-semibold mb-4">Innovation</h4>
              <p className="text-[#64748b] text-[17px]">We inspire creative thinking to push the boundaries of technology and learning.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm transition-transform duration-300 ease hover:scale-105 text-left">
              <h4 className="font-semibold mb-4">Inclusivity</h4>
              <p className="text-[#64748b] text-[17px]">We foster an inclusive environment where everyone can thrive and succeed.</p>
            </div>
          </div>
          <img src="https://img.freepik.com/free-vector/diversity-concept-illustration_114360-1410.jpg?semt=ais_hybrid&w=740" alt="Diversity" className="max-w-[600px] w-full mx-auto rounded-xl shadow-lg" />
        </div>

        {/* Journey (milestones) */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-4">Our Journey</h3>
          <div className="relative rounded-xl overflow-hidden min-h-[500px]">
            <div className="absolute inset-0 z-0">
              <img src="https://img.freepik.com/free-vector/milestone-concept-illustration_114360-2786.jpg?semt=ais_hybrid&w=740" alt="Milestones" className="w-full h-full object-cover opacity-20" />
              <div className="absolute inset-0 opacity-30"></div>
            </div>

            <p className="text-[#1e293b] mb-8 mt-[10px] text-center">From a small community of learners to a global platform, Uptoskills has grown to impact thousands of lives through tech education. Here's a glimpse of our milestones.</p>
            <div className="relative z-10 p-8 h-full flex flex-col justify-center">
              <div className="flex flex-col gap-6 text-left bg-opacity-90 p-8 rounded-lg mx-auto max-w-3xl">
                <div className="flex items-start">
                  <div className="bg-[#272626] w-3 h-3 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">2018: Founded</h4>
                    <p className="text-[#64748b]">Uptoskills was born to connect tech enthusiasts for peer learning.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#272626] w-3 h-3 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">2020: First Hackathon</h4>
                    <p className="text-[#64748b]">Hosted our inaugural hackathon, fostering innovation and collaboration.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-[#272626] w-3 h-3 rounded-full mt-2 mr-4"></div>
                  <div>
                    <h4 className="font-semibold">2025: Global Reach</h4>
                    <p className="text-[#64748b]">Expanded to support learners in over 50 countries.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Impact and Testimonials */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold mb-4">Community Impact</h3>
          <p className="text-[#64748b] mb-8">Our community has transformed thousands of lives by enabling learners to secure tech jobs, contribute to open-source projects, and innovate in their fields.</p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white p-8 rounded-xl shadow-sm text-left">
              <h4 className="font-semibold mb-4">Testimonials</h4>
              <Testimonials />
            </div>

            <div>
              <img src={communityImpact} alt="Community Success" className="max-w-[600px] w-full mx-auto rounded-xl shadow-lg" />
            </div>

            


          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
