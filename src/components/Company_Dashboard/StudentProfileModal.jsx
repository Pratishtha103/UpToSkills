// src/components/Company_Dashboard/StudentProfileModal.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  X,
  Star,
  MapPin,
  Calendar,
  ExternalLink,
  Link as LinkIcon,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

/**
 * StudentProfileModal
 *
 * Expects backend SELECT to return fields (from your SQL):
 *  s.id,
 *  s.full_name,
 *  s.email,
 *  s.phone,
 *  s.created_at,
 *  u.id AS user_detail_id,
 *  u.full_name AS profile_full_name,
 *  u.contact_number,
 *  u.linkedin_url,
 *  u.github_url,
 *  u.why_hire_me,
 *  u.profile_completed,
 *  u.ai_skill_summary,
 *  u.domains_of_interest,
 *  u.others_domain,
 *  u.created_at AS profile_created_at,
 *  u.updated_at AS profile_updated_at
 */
export default function StudentProfileModal({
  open,
  onClose,
  student: initialStudent = null,
  fetchFresh = false,
}) {
  const [student, setStudent] = useState(initialStudent);
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Helper: normalize domains_of_interest into array of strings
  const normalizeDomains = (raw) => {
    if (!raw) return [];
    if (Array.isArray(raw)) return raw;
    if (typeof raw === "string") {
      const trimmed = raw.trim();
      // JSON array string
      if (trimmed.startsWith("[")) {
        try {
          const parsed = JSON.parse(trimmed);
          return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
        } catch {
          // fallthrough to comma split
        }
      }
      // comma separated
      if (trimmed.includes(",")) {
        return trimmed.split(",").map((s) => s.trim()).filter(Boolean);
      }
      // single value
      if (trimmed.length) return [trimmed];
    }
    // fallback
    return [String(raw)];
  };

  useEffect(() => {
    setStudent(initialStudent);

    if (fetchFresh && initialStudent?.id) {
      const fetchProfile = async () => {
        setLoading(true);
        try {
          const res = await fetch(`${API_BASE}/api/students/${initialStudent.id}`, {
            credentials: "include",
            headers: { Accept: "application/json" },
          });
          if (!res.ok) {
            const text = await res.text().catch(() => "");
            throw new Error(`Failed to fetch profile: ${res.status} ${text}`);
          }
          const json = await res.json();
          const data = json?.data ?? json;

          // Map backend fields to a consistent shape for UI
          const mapped = {
            id: data.id ?? initialStudent.id,
            // prefer profile_full_name (from user_details) over student table name
            full_name: data.profile_full_name || data.full_name || data.student_name || initialStudent.full_name || initialStudent.name,
            email: data.email || initialStudent.email,
            phone: data.phone || initialStudent.phone || data.contact_number,
            contact_number: data.contact_number || initialStudent.contact_number,
            linkedin_url: data.linkedin_url || null,
            github_url: data.github_url || null,
            why_hire_me: data.why_hire_me || data.why_hire || "",
            profile_completed: data.profile_completed === true || data.profile_completed === 't' || data.profile_completed === 1,
            ai_skill_summary: data.ai_skill_summary || initialStudent.ai_skill_summary || initialStudent.ai_skills || "",
            domains_of_interest: normalizeDomains(data.domains_of_interest || initialStudent.domains_of_interest || data.others_domain),
            created_at: data.profile_created_at || data.created_at || initialStudent.created_at,
            updated_at: data.profile_updated_at || data.updated_at || initialStudent.updated_at,
            // keep raw for debugging if needed
            __raw: data,
          };

          setStudent((prev) => ({ ...(prev || {}), ...mapped }));
        } catch (err) {
          console.error("StudentProfileModal fetch error:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }
  }, [initialStudent, fetchFresh, API_BASE]);

  if (!open) return null;

  // Safe guard: ensure student object exists
  const s = student || {};
  const initials = (s.full_name || "US")
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const joinedDate = s.created_at ? new Date(s.created_at).toLocaleDateString() : "—";
  const updatedDate = s.updated_at ? new Date(s.updated_at).toLocaleDateString() : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* modal */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-3xl mx-4 bg-card rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 16, scale: 0.995 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.18 }}
      >
        <div className="p-6">
          {/* header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white font-semibold text-xl">
                {initials}
              </div>

              <div className="min-w-0">
                <h3 className="font-semibold text-xl truncate">{s.full_name}</h3>
                <p className="text-sm text-muted-foreground truncate">{(s.domains_of_interest && s.domains_of_interest[0]) || "Domain not set"}</p>
                <div className="flex items-center gap-2 mt-2 text-sm">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  <span className="font-medium">{s.rating ?? "N/A"}</span>
                  <span className="text-xs text-muted-foreground ml-2">Joined: {joinedDate}</span>
                  {updatedDate && (
                    <span className="text-xs text-muted-foreground ml-2">Updated: {updatedDate}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* body */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* LEFT: basic contact and metadata */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Location</div>
                  <div className="text-sm">{s.location || "Unknown"}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Email</div>
                  <div className="text-sm">
                    {s.email ? (
                      <a href={`mailto:${s.email}`} className="underline">
                        {s.email}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">Phone</div>
                  <div className="text-sm">
                    {s.phone || s.contact_number ? (
                      <a href={`tel:${s.phone || s.contact_number}`} className="underline">
                        {s.phone || s.contact_number}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Domains / Badges</div>
                <div className="flex flex-wrap gap-2">
                  {(s.domains_of_interest || []).length === 0 ? (
                    <Badge variant="outline">No domains</Badge>
                  ) : (
                    (s.domains_of_interest || []).map((d, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {d}
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Profile status</div>
                <div className="text-sm">{s.profile_completed ? "Completed" : "Incomplete"}</div>
              </div>
            </div>

            {/* RIGHT: AI summary, why hire, links */}
            <div className="space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">AI Summary</div>
                <div className="text-sm whitespace-pre-line">{s.ai_skill_summary || "No AI summary provided."}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Why hire me</div>
                <div className="text-sm whitespace-pre-line">{s.why_hire_me || "Not provided."}</div>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground mb-2">Links</div>
                <div className="flex flex-col gap-2 text-sm">
                  {s.linkedin_url ? (
                    <a href={s.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                      <LinkIcon className="w-4 h-4" /> LinkedIn
                    </a>
                  ) : (
                    <span className="text-muted-foreground">LinkedIn: N/A</span>
                  )}

                  {s.github_url ? (
                    <a href={s.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 underline">
                      <ExternalLink className="w-4 h-4" /> GitHub
                    </a>
                  ) : (
                    <span className="text-muted-foreground">GitHub: N/A</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {loading && (
            <div className="mt-4 text-sm text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Loading fresh data…
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
