import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Star, TrendingUp } from 'lucide-react';

function StatsGrid() {
  const stats = [
    { title: "Attendance", value: "80%", icon: CheckCircle, color: "primary", delay: 0.1 },
    { title: "Tasks Completed", value: "258+", icon: Calendar, color: "secondary", delay: 0.2 },
    { title: "Tasks in Progress", value: "64%", icon: Star, color: "accent", delay: 0.3 },
    { title: "Reward Points", value: "245", icon: TrendingUp, color: "success", delay: 0.4 },
  ];

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
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="stat-card p-6 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: stat.delay, duration: 0.5 }}
          >
            <div className={`p-3 rounded-2xl bg-gradient-${stat.color}`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-muted-foreground">{stat.title}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default StatsGrid;
