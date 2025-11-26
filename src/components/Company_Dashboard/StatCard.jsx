// src/components/Company_Dashboard/StatCard.jsx
import { motion } from "framer-motion";
import { useRef, useState } from "react";

const accentClasses = {
  primary: "bg-blue-500",
  secondary: "bg-orange-500",
  success: "bg-green-500",
  warning: "bg-yellow-500",
};

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "primary",
  delay = 0,
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition(() => ({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }));
  };

  const displayValue = typeof value === "number" ? value.toLocaleString() : value;

  return (
    <motion.div
      ref={divRef}
      className="relative stat-card rounded-xl bg-card p-4 border border-border shadow-sm transition-all duration-300 ease-out"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ scale: 1.02 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(0.6)}
      onMouseLeave={() => setOpacity(0)}
    >
      {/* Subtle spotlight */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out rounded-xl"
        style={{
          opacity,
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(59,130,246,0.08), transparent 60%)`,
          transition: "background 0.12s ease-out",
        }}
      />

      <div className="flex items-center justify-between relative z-10 gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground mb-1 truncate">{title}</p>
          <p className="text-sm font-medium text-muted-foreground mt-1 truncate">{displayValue}</p>
          {subtitle && <p className="text-sm text-muted-foreground mt-1 truncate">{subtitle}</p>}
        </div>

        <div className="flex flex-col items-end gap-3">
          {Icon ? <Icon className="w-6 h-6 text-muted-foreground" /> : null}
        </div>
      </div>
    </motion.div>
  );
}
