import React from 'react'
import Header from '../AboutPage/Header'
import Footer from '../AboutPage/Footer'
const Thankyou = () => {
    return (
        <div className="h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-200">
            <Header />
            <main className="flex-grow flex flex-col items-center justify-center">
                <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center max-w-lg w-full animate-fade-in">
                    <img src="/uptoskills_logo.png" alt="Thank You" className="mb-6" />
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 mb-3 drop-shadow-lg">Thank You!</h1>
                    <p className="text-xl text-gray-800 mb-6 text-center font-medium">
                        Your submission was <span className="text-blue-600 font-bold">successful</span>.<br />
                        We appreciate your interest in <span className="text-purple-600 font-bold">UpToSkills</span>.<br />
                        Our team will contact you soon!
                    </p>
                    <div className="flex gap-6 mt-6">
                        <a href="/" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-7 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200">Home</a>
                        <a href="/programs" className="bg-white border-2 border-purple-400 text-purple-700 px-7 py-3 rounded-xl font-semibold shadow-lg hover:bg-purple-50 transition-colors duration-200">Explore Programs</a>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

export default Thankyou