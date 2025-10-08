// src/Student_Dashboard/SkillBadges/StudentSkillBadgesPage.jsx (NO CHANGES NEEDED)

import React, { useState, useEffect } from "react"; 
import Sidebar from "../dashboard/Sidebar";
import Header from "../dashboard/Header";
import Footer from "../dashboard/Footer";
import AchievementCard from "./AchievementCard"; 

const StudentSkillBadgesPage = () => {
    // ... (All original code remains the same)
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(
        localStorage.getItem("theme") === "dark"
    );
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);

    // Theme handling (Omitted for brevity)
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDarkMode]);

    const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

    // Sidebar responsive behavior (Omitted for brevity)
    useEffect(() => {
        const checkScreenSize = () => {
            const mobile = window.innerWidth <= 1024;
            setSidebarVisible(!mobile);
        };
        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    // MODIFIED: Fetch Skill Badges with Authorization Header
    useEffect(() => {
        const fetchBadges = async () => {
            setLoading(true);
            try {
                // 1. Get the token from localStorage
                const token = localStorage.getItem('token'); 
                
                // 2. Defensive check
                if (!token) {
                    console.error("No authentication token found. Aborting fetch.");
                    setLoading(false);
                    return;
                }

                console.log("Token sent in request: Token present");

                // 3. Send the token in the correct header
                const response = await fetch("http://localhost:5000/api/skill-badges", {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`, // <--- FINAL CRITICAL FIX
                    }
                });
                
                const data = await response.json();

                if (response.ok && data.success) {
                    setBadges(data.data);
                } else {
                    console.error("Failed to fetch badges:", data.message); 
                }
            } catch (err) {
                console.error("Error fetching badges:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchBadges();
    }, []);

    return (
        <div
            className={`flex min-h-screen transition-all duration-300 ${
                isDarkMode ? "dark bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
            }`}
        >
            <Sidebar isOpen={isSidebarVisible} setIsOpen={setSidebarVisible} />
            <div
                className={`flex-1 flex flex-col transition-all duration-300 ${
                    isSidebarVisible ? "lg:ml-64" : "ml-0"
                }`}
            >
                <Header
                    onMenuClick={() => setSidebarVisible(!isSidebarVisible)}
                    toggleDarkMode={toggleDarkMode}
                />

                <div className="pt-24 px-4 sm:px-6 py-6">
                    <h1 className="text-3xl font-semibold mb-8 border-b pb-2 dark:border-gray-700">
                        🎖️ Student Skill Badges
                    </h1>

                    {loading ? (
                        <p className="text-center text-gray-500 dark:text-gray-300">
                            Loading your awesome achievements...
                        </p>
                    ) : badges.length === 0 ? (
                        <div className="p-10 text-center bg-white dark:bg-gray-800 rounded-lg">
                            <p className="text-xl text-gray-500 dark:text-gray-400">
                                No skill badges found. Time to earn some!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                            {/* RENDER THE ACHIEVEMENT CARD */}
                            {badges.map((badge) => (
                                <AchievementCard
                                    key={badge.id}
                                    id={badge.id}
                                    name={badge.name}
                                    description={badge.description}
                                    isVerified={badge.is_verified} 
                                    fullName={badge.full_name}
                                    awardedAt={badge.awarded_at}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <Footer />
            </div>
        </div>
    );
};

export default StudentSkillBadgesPage;