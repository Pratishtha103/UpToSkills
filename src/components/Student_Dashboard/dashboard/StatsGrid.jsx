import { motion } from "framer-motion";
import { CheckCircle, Calendar, Star, TrendingUp } from "lucide-react";

function StatsGrid() {
  const stats = [
    { title: "Attendance", value: "80%", icon: CheckCircle, color: "primary", delay: 0.1 },
    { title: "Tasks Completed", value: "258+", icon: Calendar, color: "secondary", delay: 0.2 },
    { title: "Tasks in Progress", value: "64%", icon: Star, color: "accent", delay: 0.3 },
    { title: "Reward Points", value: "245", icon: TrendingUp, color: "success", delay: 0.4 },
  ];

  // helper function to map gradient color names
  const gradientClasses = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600",
    secondary: "bg-gradient-to-r from-orange-500 to-yellow-500",
    accent: "bg-gradient-to-r from-indigo-500 to-purple-500",
    success: "bg-gradient-to-r from-green-500 to-emerald-500",
  };

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
            className="stat-card p-6 flex items-center gap-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
          >
            {/* icon */}
            <div className={`p-3 rounded-2xl ${gradientClasses[stat.color]}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>

            {/* text */}
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
