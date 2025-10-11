import React from 'react';

const ProgramsSection = () => {
  return (
    <section id="programs" className="py-8 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-[32px] font-bold mb-4 mt-12">Our Programs</h2>
        <p className="text-[#64748b] text-[17px] mb-12">
          Discover our expertly designed programs to master in-demand tech skills through hands-on projects 
          and mentorship from industry professionals.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              title: 'Web Development',
              img: 'https://img.freepik.com/free-vector/coding-workshop-concept-illustration_114360-8033.jpg?semt=ais_hybrid&w=740',
              desc: 'Build modern, responsive websites using HTML, CSS, JavaScript, and frameworks like React and Vue.',
              link: '/web-dev'

            },
            {
              title: 'Data Science',
              img: 'https://img.freepik.com/free-vector/data-analysis-concept-illustration_114360-8051.jpg?semt=ais_hybrid&w=740',
              desc: 'Master data analysis, machine learning, and visualization with Python, R, and tools like TensorFlow.',
              link: '/data-science'
            },
            {
              title: 'Cloud Computing',
              img: 'https://img.freepik.com/free-vector/cloud-computing-concept-illustration_114360-2269.jpg?semt=ais_hybrid&w=740',
              desc: 'Gain expertise in cloud platforms like AWS, Azure, and GCP through real-world projects.',
              link: '/cloud-computing'
            },
            {
              title: 'Cybersecurity',
              img: 'https://img.freepik.com/free-vector/cyber-security-concept_114360-2294.jpg?semt=ais_hybrid&w=740',
              desc: 'Learn to secure systems and networks with hands-on training in ethical hacking and security protocols.',
              link: '/cybersecurity'
            }
          ].map((program, index) => (
            <div 
              className="bg-white p-6 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-4 hover:shadow-lg" 
              key={index}
            >
              <img 
                src={program.img} 
                alt={program.title} 
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
              <p className="text-[#64748b] text-[15px] leading-snug mb-3">{program.desc}</p>
              <a href={program.link} className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">Enroll Now</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProgramsSection;