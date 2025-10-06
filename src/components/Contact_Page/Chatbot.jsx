import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hi! Welcome to Uptoskills! How can I assist you today?',
      options: ['Browse Courses', 'My Progress', 'Ask a Question', 'Contact Mentor'] 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [currentMenu, setCurrentMenu] = useState('main');

  // Scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (customMessage) => {
    const messageText = customMessage || input;
    if (messageText.trim() === '') return;

    // Add user message
    const userMessage = { sender: 'user', text: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      let botMessage;

      // Handle Back option - go to previous menu
      if (messageText === 'Back') {
        switch (currentMenu) {
          case 'courses':
          case 'progress':
          case 'question':
          case 'mentor':
            botMessage = {
              sender: 'bot',
              text: 'What would you like to do?',
              options: ['Browse Courses', 'My Progress', 'Ask a Question', 'Contact Mentor'],
            };
            setCurrentMenu('main');
            break;
          case 'programming':
          case 'design':
          case 'marketing':
            botMessage = {
              sender: 'bot',
              text: 'Great! Here are some categories you can explore:',
              options: ['Programming', 'Design', 'Marketing', 'Back'],
            };
            setCurrentMenu('courses');
            break;
          case 'dashboard':
          case 'report':
            botMessage = {
              sender: 'bot',
              text: 'You can track your progress below:',
              options: ['View Dashboard', 'Download Report', 'Back'],
            };
            setCurrentMenu('progress');
            break;
          default:
            botMessage = {
              sender: 'bot',
              text: 'What would you like to do?',
              options: ['Browse Courses', 'My Progress', 'Ask a Question', 'Contact Mentor'],
            };
            setCurrentMenu('main');
        }
      }
      // Closing conversations
      else if (messageText === 'Main Menu') {
        botMessage = {
          sender: 'bot',
          text: 'Welcome back! What would you like to explore today?',
          options: ['Browse Courses', 'My Progress', 'Ask a Question', 'Contact Mentor'],
        };
        setCurrentMenu('main');
      } 
      else if (messageText === "That's all" || messageText === 'No thanks' || messageText === "I'm done") {
        botMessage = {
          sender: 'bot',
          text: 'Thanks for chatting with Uptoskills! 🎓\nHappy learning and see you next time! 👋',
          options: ['Start New Conversation'],
        };
      } 
      else if (messageText === 'Start New Conversation') {
        botMessage = {
          sender: 'bot',
          text: 'Great to have you back! How can I assist you today?',
          options: ['Browse Courses', 'My Progress', 'Ask a Question', 'Contact Mentor'],
        };
        setCurrentMenu('main');
      }
      // Thank you responses
      else if (
        messageText.toLowerCase().includes('thank') ||
        messageText.toLowerCase().includes('thanks')
      ) {
        botMessage = {
          sender: 'bot',
          text: "You're welcome! 😊\nIs there anything else I can help you with?",
          options: ['Browse Courses', 'My Progress', "That's all"],
        };
      }
      // Main menu options
      else if (messageText === 'Browse Courses') {
        botMessage = {
          sender: 'bot',
          text: 'Great! Here are some categories you can explore:',
          options: ['Programming', 'Design', 'Marketing', 'Back'],
        };
        setCurrentMenu('courses');
      } 
      else if (messageText === 'My Progress') {
        botMessage = {
          sender: 'bot',
          text: 'You can track your progress below:',
          options: ['View Dashboard', 'Download Report', 'Back'],
        };
        setCurrentMenu('progress');
      } 
      else if (messageText === 'Ask a Question') {
        botMessage = {
          sender: 'bot',
          text: 'Sure! What type of question do you have?',
          options: ['Course Content', 'Technical Issue', 'Other', 'Back'],
        };
        setCurrentMenu('question');
      } 
      else if (messageText === 'Contact Mentor') {
        botMessage = {
          sender: 'bot',
          text: 'How would you like to connect with a mentor?',
          options: ['Schedule Meeting', 'Send Message', 'Back'],
        };
        setCurrentMenu('mentor');
      } 
      // Sub-options with enhanced final responses
      else if (messageText === 'Programming') {
        botMessage = {
          sender: 'bot',
          text: '💻 **Programming Courses Available:**\n\n• JavaScript Fundamentals\n• Python for Beginners\n• Java Mastery\n• React Advanced\n\nWould you like to explore further or return to main menu?',
          options: ['Course Details', 'Enrollment Info', 'Main Menu', 'Back'],
        };
        setCurrentMenu('programming');
      } 
      else if (messageText === 'Design') {
        botMessage = {
          sender: 'bot',
          text: '🎨 **Design Courses Available:**\n\n• UI/UX Design Fundamentals\n• Figma Masterclass\n• Graphic Design Principles\n• Adobe Creative Suite\n\nReady to start your design journey?',
          options: ['Course Syllabus', 'Start Learning', 'Main Menu', 'Back'],
        };
        setCurrentMenu('design');
      } 
      else if (messageText === 'Marketing') {
        botMessage = {
          sender: 'bot',
          text: '📈 **Marketing Courses Available:**\n\n• Digital Marketing Strategy\n• Social Media Marketing\n• SEO Optimization\n• Content Marketing\n\nWhich area interests you most?',
          options: ['Digital Marketing', 'Social Media', 'SEO', 'Main Menu', 'Back'],
        };
        setCurrentMenu('marketing');
      }
      else if (messageText === 'View Dashboard') {
        botMessage = {
          sender: 'bot',
          text: '📊 **Your Learning Dashboard**\n\n• Completion Progress: 75% 🎉\n• Current Streak: 5 days 🔥\n• Skills Learned: 12\n• Certificates Earned: 3\n\nKeep up the great work! What would you like to do next?',
          options: ['Continue Learning', 'Download Certificate', 'Set Goals', 'Main Menu'],
        };
        setCurrentMenu('dashboard');
      } 
      else if (messageText === 'Download Report') {
        botMessage = {
          sender: 'bot',
          text: '📄 **Your Progress Report**\n\nDownload link: https://uptoskills.com/report.pdf\n\nYour detailed learning report is ready! Is there anything else you need?',
          options: ['View Dashboard', 'Share Report', 'Main Menu', 'Back'],
        };
        setCurrentMenu('report');
      }
      else if (messageText === 'Schedule Meeting') {
        botMessage = {
          sender: 'bot',
          text: '📅 **Mentor Meeting Scheduling**\n\nPlease visit: https://uptoskills.com/mentor-schedule\n\nSelect your preferred time slot and your mentor will confirm via email. Need help with anything else?',
          options: ['Contact Support', 'Main Menu', 'Back'],
        };
        setCurrentMenu('schedule');
      }
      else if (messageText === 'Send Message') {
        botMessage = {
          sender: 'bot',
          text: '💌 **Message Your Mentor**\n\nYou can reach your mentor at: mentors@uptoskills.com\n\nThey typically respond within 24 hours. Is there anything else I can help with?',
          options: ['Schedule Meeting', 'Main Menu', 'Back'],
        };
        setCurrentMenu('message');
      }
      // Course content questions
      else if (messageText === 'Course Content') {
        botMessage = {
          sender: 'bot',
          text: '📚 **Course Content Help**\n\nOur course materials include:\n• Video lectures\n• Interactive exercises\n• Downloadable resources\n• Community forums\n\nWhat specific content do you need help with?',
          options: ['Video Issues', 'Exercise Help', 'Resources', 'Main Menu', 'Back'],
        };
        setCurrentMenu('content');
      }
      // Enhanced final responses for end of flows
      else if (messageText === 'Course Details' || messageText === 'Enrollment Info') {
        botMessage = {
          sender: 'bot',
          text: '🎯 **Course Enrollment**\n\nVisit: https://uptoskills.com/courses\n\nAll courses include:\n• Lifetime access\n• Certificate of completion\n• Mentor support\n• Project portfolio\n\nReady to start learning?',
          options: ['Browse More Courses', 'Main Menu', "That's all"],
        };
      }
      else if (messageText === 'Download Certificate') {
        botMessage = {
          sender: 'bot',
          text: '🏆 **Certificate Download**\n\nYour certificates are available at: https://uptoskills.com/certificates\n\nCongratulations on your achievements! 🎉',
          options: ['View Dashboard', 'Share Achievement', 'Main Menu', "That's all"],
        };
      }
      else {
        // Fallback: fetch from API
        const res = await fetch(
          `https://corsproxy.io/?https://api.affiliateplus.xyz/api/chatbot?message=${encodeURIComponent(
            messageText
          )}&botname=HelperBot&ownername=LearnPlatform&user=12345`
        );
        const data = await res.json();
        botMessage = { 
          sender: 'bot', 
          text: data.message,
          options: ['Browse Courses', 'My Progress', 'Main Menu', "That's all"]
        };
      }

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { 
          sender: 'bot', 
          text: 'Sorry, something went wrong. Please try again.',
          options: ['Browse Courses', 'My Progress', 'Main Menu']
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-sm:right-2 max-sm:bottom-2">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col max-sm:w-full max-sm:h-[450px]">
          {/* Header */}
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-semibold text-lg">Uptoskills Bot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Message Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-b-xl">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === 'bot' ? 'items-start' : 'items-end'
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[75%]">
                  {/* Avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
                      B
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`relative px-4 py-2 text-sm rounded-2xl shadow-md break-words ${
                      msg.sender === 'bot'
                        ? 'bg-green-200 text-gray-800'
                        : 'bg-orange-500 text-white'
                    }`}
                  >
                    {/* Format text with line breaks */}
                    {msg.text.split('\n').map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                    {/* Bubble tail */}
                    <span
                      className={`absolute bottom-0 ${
                        msg.sender === 'bot' ? '-left-1' : '-right-1'
                      } w-2 h-2 bg-inherit transform rotate-45`}
                    ></span>
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      U
                    </div>
                  )}
                </div>

                {/* Options Buttons */}
                {msg.sender === 'bot' && msg.options && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {msg.options.map((option, i) => (
                      <button
                        key={i}
                        onClick={() => handleOptionClick(option)}
                        className="bg-[#0e426a] hover:bg-[#45a049] text-white text-xs px-3 py-1 rounded-full shadow-sm transition-colors">
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500 italic animate-pulse">
                Bot is typing...
              </div>
            )}
            <div ref={messagesEndRef}></div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t flex bg-white rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:border-orange-500 text-sm"
            />
            <button
              onClick={() => sendMessage()}
              className="bg-orange-500 hover:bg-green-500 text-white px-4 rounded-r-lg transition-colors duration-300"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;