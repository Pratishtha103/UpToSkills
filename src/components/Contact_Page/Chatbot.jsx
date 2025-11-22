import React, { useState, useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "Welcome! Please select your user type.",
      options: ["Admin", "Company", "Mentor", "Student", "General User"],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (customMessage) => {
    const messageText = customMessage || input;
    if (messageText.trim() === "") return;

    setMessages((prev) => [...prev, { sender: "user", text: messageText }]);
    setInput("");
    setLoading(true);

    let botMessage;

    try {
      if (messageText === "Student") {
        botMessage = {
          sender: "bot",
          text: "Hello Student! How can I assist you today? Choose an option.",
          options: [
            "Add Project",
            "My Projects",
            "Skill Badges",
            "Project Showcase",
            "My Courses",
            "Programs We Offer",
            "Connect With Us",
            "Back to User Type",
          ],
        };
      } else if (messageText === "General User") {
        botMessage = {
          sender: "bot",
          text: "Welcome! As a general user, you can access these options:",
          options: [
            "Explore Courses",
            "View Testimonials",
            "Contact Support",
            "Back to User Type",
          ],
        };
      } else if (["Admin", "Company", "Mentor"].includes(messageText)) {
        botMessage = {
          sender: "bot",
          text: `Hi ${messageText}, this chatbot currently offers personalized assistance for students and general users.\nPlease select another type or return to user type selection.`,
          options: ["Back to User Type"],
        };
      } else if (messageText === "Back to User Type") {
        botMessage = {
          sender: "bot",
          text: "Welcome! Please select your user type.",
          options: ["Admin", "Company", "Mentor", "Student", "General User"],
        };
      } else if (messageText === "Add Project") {
        botMessage = {
          sender: "bot",
          text:
            "To submit a project, login as a student, navigate to 'Add Project', fill out the Student Project Submission form, and click the 🚀 Submit Project button.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "My Projects") {
        botMessage = {
          sender: "bot",
          text: "Login as a student and go to 'My Projects' to view your projects.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "Skill Badges") {
        botMessage = {
          sender: "bot",
          text: "View your earned skill badges by logging in as a student and selecting 'Skill Badges'.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "Project Showcase") {
        botMessage = {
          sender: "bot",
          text:
            "Login as a student and go to 'Project Showcase' as a student to explore all available projects.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "My Courses") {
        botMessage = {
          sender: "bot",
          text: "Login as a student and go to 'My Courses' to see your enrolled courses.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "Programs We Offer") {
        botMessage = {
          sender: "bot",
          text: "Visit the home page and navigate to the 'Programs' section to explore what we offer.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "Connect With Us") {
        botMessage = {
          sender: "bot",
          text: "You can contact us by going to the home page and navigating to the 'Contact' section.",
          options: ["Back to Student Menu", "Back to User Type"],
        };
      } else if (messageText === "Back to Student Menu") {
        botMessage = {
          sender: "bot",
          text: "Hello Student! How can I assist you today? Choose an option.",
          options: [
            "Add Project",
            "My Projects",
            "Skill Badges",
            "Project Showcase",
            "My Courses",
            "Programs We Offer",
            "Connect With Us",
            "Back to User Type",
          ],
        };
      } else {
        botMessage = {
          sender: "bot",
          text: "This feature is coming soon. Please select another action or go back.",
          options: ["Back to User Type"],
        };
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, botMessage]);
        setLoading(false);
      }, 600);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, something went wrong. Please try again or contact support.",
          options: ["Back to User Type"],
        },
      ]);
      setLoading(false);
    }
  };

  const handleOptionClick = (option) => {
    sendMessage(option);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-sm:right-2 max-sm:bottom-2">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-orange-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col max-sm:w-full max-sm:h-[450px]">
          <div className="bg-orange-500 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <h2 className="font-semibold text-lg">Uptoskills Bot</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-xl font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100 rounded-b-xl">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "bot" ? "items-start" : "items-end"
                }`}
              >
                <div className="flex items-end space-x-2 max-w-[75%]">
                  {msg.sender === "bot" && (
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center text-white font-bold">
                      B
                    </div>
                  )}
                  <div
                    className={`relative px-4 py-2 text-sm rounded-2xl shadow-md break-words ${
                      msg.sender === "bot"
                        ? "bg-green-200 text-gray-800"
                        : "bg-orange-500 text-white"
                    }`}
                  >
                    {msg.text.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        <br />
                      </span>
                    ))}
                    <span
                      className={`absolute bottom-0 ${
                        msg.sender === "bot" ? "-left-1" : "-right-1"
                      } w-2 h-2 bg-inherit transform rotate-45`}
                    ></span>
                  </div>
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
                      U
                    </div>
                  )}
                </div>
                {msg.sender === "bot" &&
                  msg.options &&
                  msg.options.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {msg.options.map((option, i) => (
                        <button
                          key={i}
                          onClick={() => handleOptionClick(option)}
                          className="bg-[#0e426a] hover:bg-[#45a049] text-white text-xs px-3 py-1 rounded-full shadow-sm transition-colors"
                        >
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

          <div className="p-3 border-t flex bg-white rounded-b-2xl">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
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
