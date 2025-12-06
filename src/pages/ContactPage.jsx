import React from 'react'
import Contact from '../components/Contact_Page/Contact'
import Faq from '../components/Contact_Page/Faq'
import Chatbot from '../components/Contact_Page/Chatbot'
import Footer from '../components/Contact_Page/Footer'
import Header from '../components/Contact_Page/Header'
import { useTheme } from '../context/ThemeContext'

const ContactPage = () => {
  const { darkMode } = useTheme();

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
      <Header/>
      <main className="pt-16"></main>
      <Contact />
      <Faq />
      <Chatbot />
      <Footer/>
    </div>
  )
}

export default ContactPage