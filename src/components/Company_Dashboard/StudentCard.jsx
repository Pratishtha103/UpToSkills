// src/components/Company_Dashboard/StudentCard.jsx
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "../Company_Dashboard/ui/badge";
import { Button } from "../Company_Dashboard/ui/button";
import { Card } from "../Company_Dashboard/ui/card";
import { Star, MapPin, Calendar, ExternalLink } from "lucide-react";

/* --------- Utility for badge colours by skill level -------- */
const skillLevelColors = {
  Beginner: "bg-warning text-warning-foreground",
  Intermediate: "bg-primary text-primary-foreground",
  Advanced: "bg-success text-success-foreground",
};

export default function StudentCard({
  student: initialStudent = null,
  studentId = null,
  onViewProfile = () => {},
  onContact = () => {},
  delay = 0,
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [student, setStudent] = useState(initialStudent);

  useEffect(() => {
    if (initialStudent) {
      setStudent(initialStudent);
      return;
    }

    // If no student object passed, but a studentId is provided, fetch that student's profile.
    // If neither provided, skip fetching (keeps behavior minimal and predictable).
    const url = studentId ? `/api/profile/${studentId}` : null;
    if (!url) return;

    const fetchProfile = async () => {
      try {
        const res = await fetch(url, { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const found = data?.data ?? data?.student ?? data;
        if (!found) throw new Error("No student data returned");

        setStudent({
          id: found.student_id ?? found.id ?? studentId,
          name:
            found.student_name ??
            [found.first_name, found.last_name].filter(Boolean).join(" ") ??
            "Unknown",
          domain: found.domains_of_interest
            ? (() => {
                try {
                  const parsed = JSON.parse(found.domains_of_interest);
                  return Array.isArray(parsed) ? parsed.join(", ") : String(parsed);
                } catch {
                  return String(found.domains_of_interest);
                }
              })()
            : found.domain ?? "Not specified",
          rating: found.rating ?? 4.5,
          skillLevel: found.skillLevel ?? "Intermediate",
          experience: found.experience ?? "1 year",
          location: found.location ?? "Unknown",
          lastActive: found.updated_at
            ? new Date(found.updated_at).toLocaleDateString()
            : found.last_active ?? "Recently active",
          badges: found.badges ?? ["Team Player", "Fast Learner"],
        });
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    fetchProfile();
  }, [initialStudent, studentId]);

  if (!student) {
    return (
      <div className="p-6 border rounded shadow bg-muted text-muted-foreground">
        Loading student...
      </div>
    );
  }

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition((prev) => ({
      x: prev.x + (e.clientX - rect.left - prev.x) * 0.2,
      y: prev.y + (e.clientY - rect.top - prev.y) * 0.2,
    }));
  };

  // ====== only changed: robust display name + initials derived from it ======
  const displayName =
    student.full_name ||
    student.name ||
    student.student_name ||
    student.profile_full_name ||
    "Unknown Student";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  // =======================================================================

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
    >
      <Card
        ref={divRef}
        className="relative p-6 h-full flex flex-col hover:shadow-elegant transition-all duration-300 overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setOpacity(0.6)}
        onMouseLeave={() => setOpacity(0)}
      >
        {/* Blue spotlight that follows the cursor */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300 ease-in-out"
          style={{
            opacity,
            background: `radial-gradient(circle at ${position.x}px ${position.y}px, rgba(0,102,255,0.3), transparent 80%)`,
            transition: "background 0.1s ease-out",
          }}
        />

        {/* ---------- Card Content ---------- */}
        <div className="relative z-10">
          {/* Header: avatar, name, domain, rating */}
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-primary bg-slate-300 rounded-full flex items-center justify-center text-black font-semibold">
              {initials}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg text-foreground truncate">
                {displayName}
              </h3>
              <p className="text-muted-foreground text-sm">{student.domain}</p>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-sm font-medium">{student.rating}</span>
              </div>
            </div>
          </div>

          {/* Skill level, experience, location, last active, badges */}
          <div className="space-y-3 mb-4 flex-1">
            <div className="flex items-center gap-2">
              <Badge className={skillLevelColors[student.skillLevel]}>
                {student.skillLevel}
              </Badge>
              <Badge variant="outline">{student.experience}</Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{student.location}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Last active: {student.lastActive}</span>
            </div>

            <div className="flex flex-wrap gap-1">
              {(student.badges ?? []).slice(0, 3).map((badge) => (
                <Badge key={badge} variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              ))}
              {(student.badges ?? []).length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{student.badges.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewProfile(student)}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Profile
            </Button>
            <Button
              size="sm"
              className="btn-primary flex-1"
              onClick={() => onContact(student.id)}
            >
              Contact
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
