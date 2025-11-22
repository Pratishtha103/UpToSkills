// StatsGrid.jsx - CORRECTED VERSION
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Star, TrendingUp } from "lucide-react";
import axios from "axios";

function StatsGrid({ studentId }) {
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ Get studentId from localStorage if not passed as prop
  const effectiveStudentId = studentId || localStorage.getItem('id') || localStorage.getItem('studentId');

  // ------------------------------
  // Fetch Enrollments
  // ------------------------------
  useEffect(() => {
    if (!effectiveStudentId) {
      console.warn("StatsGrid: No student ID available");
      setLoading(false);
      return;
    }

    const fetchEnrollment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/enrollments/count/${effectiveStudentId}`
        );
        setEnrolledCount(res.data.count);
      } catch (error) {
        console.error("Error fetching enrollment:", error);
        setEnrolledCount(0);
      }
    };

    fetchEnrollment();
  }, [effectiveStudentId]);

  // ------------------------------
  // ✅ FIXED: Fetch Projects Count with CORRECT endpoint
  // ------------------------------
  useEffect(() => {
    if (!effectiveStudentId) return;

    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // ✅ Use the SAME endpoint as ProjectShowcase
        const res = await axios.get(
          `http://localhost:5000/api/projects/assigned/${effectiveStudentId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        // ✅ Handle the response structure correctly
        if (res.data.success && Array.isArray(res.data.data)) {
          setProjectCount(res.data.data.length);
        } else if (Array.isArray(res.data)) {
          setProjectCount(res.data.length);
        } else {
          setProjectCount(0);
        }
      } catch (error) {
        console.error("Error fetching project count:", error);
        setProjectCount(0);
      }
    };

    fetchProjects();
  }, [effectiveStudentId]);

  // ------------------------------
  // Fetch Skill Badges Count
  // ------------------------------
  useEffect(() => {
    if (!effectiveStudentId) return;

    const fetchBadgeCount = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          console.error("No authentication token found");
          setBadgeCount(0);
          return;
        }

        const res = await axios.get(
          'http://localhost:5000/api/skill-badges',
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (res.data.success && Array.isArray(res.data.data)) {
          setBadgeCount(res.data.data.length);
        } else {
          setBadgeCount(0);
        }
      } catch (error) {
        console.error("Error fetching badge count:", error);
        setBadgeCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchBadgeCount();
  }, [effectiveStudentId]);

  // ------------------------------
  // Stats Data
  // ------------------------------
  const stats = [
    { 
      title: "Programs Enrolled", 
      value: enrolledCount, 
      icon: CheckCircle, 
      color: "primary", 
      delay: 0.1 
    },
    { 
      title: "My Projects", 
      value: projectCount, 
      icon: Calendar, 
      color: "secondary", 
      delay: 0.2 
    }, 
    { 
      title: "Tasks in Progress", 
      value: "64%", 
      icon: Star, 
      color: "accent", 
      delay: 0.3 
    },
    { 
      title: "Skill Badges Earned", 
      value: loading ? "..." : badgeCount, 
      icon: TrendingUp, 
      color: "success", 
      delay: 0.4 
    },
  ];

  const gradientClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600",
    secondary: "bg-gradient-to-r from-orange-500 to-yellow-500",
    accent: "bg-gradient-to-r from-indigo-500 to-purple-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
  };

  // ✅ Show warning if no student ID
  if (!effectiveStudentId) {
    return (
      <section className="mb-8">
        <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <p className="text-yellow-800 dark:text-yellow-300">
            ⚠️ Please log in to view your progress statistics.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <motion.h2
        className="text-2xl font-bold text-foreground mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        Your Progress
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <motion.div
            key={stat.title}
            className="stat-card p-6 flex items-center gap-4 bg-white dark:bg-gray-800 
                       border border-gray-200 dark:border-gray-700 rounded-xl shadow-md 
                       hover:shadow-lg transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className={`p-3 rounded-2xl ${gradientClasses[stat.color]}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>

            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsGrid;

// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { CheckCircle, Calendar, Star, TrendingUp } from "lucide-react";
// import axios from "axios";

// function StatsGrid({ studentId }) {
//   const [enrolledCount, setEnrolledCount] = useState(0);
//   const [projectCount, setProjectCount] = useState(0);
//   const [badgeCount, setBadgeCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // ✅ Get studentId from localStorage if not passed as prop
//   const effectiveStudentId =
//     studentId || localStorage.getItem("id") || localStorage.getItem("studentId");

//   // ------------------------------
//   // Fetch Enrollments
//   // ------------------------------
//   useEffect(() => {
//     if (!effectiveStudentId) {
//       console.warn("StatsGrid: No student ID available");
//       setLoading(false);
//       return;
//     }

//     const fetchEnrollment = async () => {
//       try {
//         const res = await axios.get(
//           `http://localhost:5000/api/enrollments/count/${effectiveStudentId}`
//         );
//         setEnrolledCount(res.data.count);
//       } catch (error) {
//         console.error("Error fetching enrollment:", error);
//         setEnrolledCount(0);
//       }
//     };

//     fetchEnrollment();
//   }, [effectiveStudentId]);

//   // ------------------------------
//   // Fetch Projects Count
//   // ------------------------------
//   useEffect(() => {
//     if (!effectiveStudentId) return;

//     const fetchProjects = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         const res = await axios.get(
//           `http://localhost:5000/api/projects/assigned/${effectiveStudentId}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.data.success && Array.isArray(res.data.data)) {
//           setProjectCount(res.data.data.length);
//         } else if (Array.isArray(res.data)) {
//           setProjectCount(res.data.length);
//         } else {
//           setProjectCount(0);
//         }
//       } catch (error) {
//         console.error("Error fetching project count:", error);
//         setProjectCount(0);
//       }
//     };

//     fetchProjects();
//   }, [effectiveStudentId]);

//   // ------------------------------
//   // Fetch Skill Badges Count
//   // ------------------------------
//   useEffect(() => {
//     if (!effectiveStudentId) return;

//     const fetchBadgeCount = async () => {
//       try {
//         const token = localStorage.getItem("token");

//         if (!token) {
//           console.error("No authentication token found");
//           setBadgeCount(0);
//           return;
//         }

//         const res = await axios.get(
//           "http://localhost:5000/api/skill-badges",
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//           }
//         );

//         if (res.data.success && Array.isArray(res.data.data)) {
//           setBadgeCount(res.data.data.length);
//         } else {
//           setBadgeCount(0);
//         }
//       } catch (error) {
//         console.error("Error fetching badge count:", error);
//         setBadgeCount(0);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBadgeCount();
//   }, [effectiveStudentId]);

//   // ------------------------------
//   // Stats Data
//   // ------------------------------
//   const stats = [
//     {
//       title: "Programs Enrolled",
//       subtitle: "Active learning tracks",
//       value: enrolledCount,
//       icon: CheckCircle,
//       color: "primary",
//       chip: enrolledCount > 0 ? "Keep it up!" : "Start your first program",
//       delay: 0.05,
//     },
//     {
//       title: "My Projects",
//       subtitle: "Assigned to you",
//       value: projectCount,
//       icon: Calendar,
//       color: "secondary",
//       chip: projectCount > 0 ? "Projects in progress" : "No projects yet",
//       delay: 0.1,
//     },
//     {
//       title: "Tasks in Progress",
//       subtitle: "Current completion rate",
//       value: "64%",
//       icon: Star,
//       color: "accent",
//       chip: "Stay consistent",
//       delay: 0.15,
//     },
//     {
//       title: "Skill Badges Earned",
//       subtitle: "Recognized achievements",
//       value: loading ? "..." : badgeCount,
//       icon: TrendingUp,
//       color: "success",
//       chip: badgeCount > 0 ? "Nice streak!" : "Earn your first badge",
//       delay: 0.2,
//     },
//   ];

//   const gradientClasses = {
//     primary:
//       "bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 shadow-blue-500/30",
//     secondary:
//       "bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 shadow-amber-500/30",
//     accent:
//       "bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-600 shadow-indigo-500/30",
//     success:
//       "bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 shadow-emerald-500/30",
//   };

//   // ✅ Show warning if no student ID
//   if (!effectiveStudentId) {
//     return (
//       <section className="mb-8">
//         <div className="p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200/80 dark:border-yellow-800/70 flex items-center gap-3">
//           <span className="text-2xl">⚠️</span>
//           <div>
//             <p className="text-yellow-900 dark:text-yellow-200 font-semibold">
//               Please log in to view your progress.
//             </p>
//             <p className="text-sm text-yellow-800/80 dark:text-yellow-300/80">
//               Your enrolled programs, projects, and badges will appear here
//               after you sign in.
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="mb-8">
//       <div className="mb-4 flex items-center justify-between gap-3">
//         <motion.h2
//           className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground"
//           initial={{ opacity: 0, x: -16 }}
//           animate={{ opacity: 1, x: 0 }}
//         >
//           Your Progress
//         </motion.h2>
//         <motion.span
//           className="hidden sm:inline-flex items-center rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground bg-muted/40 backdrop-blur"
//           initial={{ opacity: 0, y: -8 }}
//           animate={{ opacity: 1, y: 0 }}
//         >
//           Updated in real time
//         </motion.span>
//       </div>

//       <motion.p
//         className="text-sm text-muted-foreground mb-6 max-w-xl"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ delay: 0.1 }}
//       >
//         Get a quick snapshot of your learning journey, including enrolled
//         programs, projects, and the skill badges you have earned so far.
//       </motion.p>

//       <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
//         {stats.map((stat) => (
//           <motion.div
//             key={stat.title}
//             className="group relative overflow-hidden rounded-2xl border border-border bg-gradient-to-b from-background via-background/95 to-muted/60 dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900/60 shadow-sm hover:shadow-lg transition-shadow duration-300"
//             initial={{ opacity: 0, y: 18 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: stat.delay, duration: 0.45, type: "spring" }}
//             whileHover={{ y: -4 }}
//           >
//             {/* Glow background */}
//             <div
//               className={`pointer-events-none absolute inset-x-6 -top-10 h-24 rounded-3xl opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-80 ${gradientClasses[stat.color]}`}
//             />

//             <div className="relative p-5 flex flex-col gap-4">
//               <div className="flex items-start justify-between gap-3">
//                 <div>
//                   <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground/80">
//                     {stat.title}
//                   </p>
//                   <p className="mt-1 text-[13px] text-muted-foreground">
//                     {stat.subtitle}
//                   </p>
//                 </div>

//                 <div
//                   className={`shrink-0 rounded-2xl p-3 shadow-md ${gradientClasses[stat.color]} text-white flex items-center justify-center`}
//                 >
//                   <stat.icon className="w-5 h-5" />
//                 </div>
//               </div>

//               <div className="flex items-baseline justify-between gap-3">
//                 <motion.span
//                   className="text-3xl font-semibold tracking-tight text-foreground"
//                   layout
//                 >
//                   {stat.value}
//                 </motion.span>
//                 <span className="inline-flex items-center rounded-full border border-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground bg-background/70 backdrop-blur-sm">
//                   {stat.chip}
//                 </span>
//               </div>

//               {/* Subtle bottom bar */}
//               <div className="mt-1 h-px w-full bg-gradient-to-r from-transparent via-border/80 to-transparent" />
//             </div>
//           </motion.div>
//         ))}
//       </div>
//     </section>
//   );
// }

// export default StatsGrid;
