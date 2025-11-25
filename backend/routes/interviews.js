//interviews.js
const express = require("express");
const router = express.Router();
const pool = require("../config/database");
const verifyToken = require("../middleware/auth");
const { pushNotification, notifyAdmins } = require("../utils/notificationService");

const formatInterviewSlot = (date, time) => {
  try {
    const slot = new Date(`${date}T${time}`);
    if (!Number.isNaN(slot.getTime())) {
      return slot.toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    }
  } catch (err) {
    // ignore formatting errors
  }
  return `${date} ${time}`;
};

// ✅ GET all interviews (sorted by date & time)
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM interviews ORDER BY date, time ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    res.status(500).json({ error: "Server error while fetching interviews" });
  }
});

// ✅ POST - Add new interview
router.post("/", verifyToken, async (req, res) => {
  try {
    const { candidateName, position, date, time, candidateId } = req.body;

    if (!candidateName || !position || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert candidate_id as nullable column (value may be null)
    const result = await pool.query(
      `INSERT INTO interviews (candidate_name, role, date, time, status, candidate_id)
       VALUES ($1, $2, $3, $4, 'Scheduled', $5)
       RETURNING *`,
      [candidateName, position, date, time, candidateId ?? null]
    );

    const createdInterview = result.rows[0];
      const slotLabel = formatInterviewSlot(createdInterview.date, createdInterview.time);
      // also provide explicit readable date and time to avoid ambiguous concatenation in messages
      let readableDate = String(createdInterview.date);
      let readableTime = String(createdInterview.time);
      try {
        const dt = new Date(`${createdInterview.date}T${createdInterview.time}`);
        if (!Number.isNaN(dt.getTime())) {
          readableDate = dt.toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" });
          readableTime = dt.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
        }
      } catch (err) {
        // fall back to raw strings
      }
    const ioInstance = req.app.get("io");

    // Notify the company/user who scheduled this interview (if authenticated)
    try {
      const actor = req.user || null;
      if (actor && actor.id) {
        await pushNotification({
          role: "company",
          recipientRole: "company",
          recipientId: actor.id,
          type: "interview",
          title: "Interview scheduled",
            message: `You scheduled an interview for ${candidateName} on ${readableDate} at ${readableTime}.`,
          metadata: {
            interviewId: createdInterview.id,
            candidateName,
            position,
            date: createdInterview.date,
            time: createdInterview.time,
          },
          io: ioInstance,
        });
      }
    } catch (companyNotifyError) {
      console.error("Company notification error (interview)", companyNotifyError);
    }

    try {
      // If caller supplied a candidateId, prefer it for notifications instead of name matching
      if (candidateId) {
        // Verify student exists
        const studentRow = await pool.query("SELECT id FROM students WHERE id = $1 LIMIT 1", [candidateId]);
        if (studentRow.rows.length) {
          await pushNotification({
            role: "student",
            recipientRole: "student",
            recipientId: studentRow.rows[0].id,
            type: "interview",
            title: "Interview scheduled",
              message: `Your interview for ${position} is scheduled for ${readableDate} at ${readableTime}.`,
            metadata: {
              interviewId: createdInterview.id,
              candidateName: candidateName?.trim(),
              position,
              date: createdInterview.date,
              time: createdInterview.time,
            },
            io: ioInstance,
          });
        }
      } else {
        const trimmedCandidate = candidateName?.trim();
        if (trimmedCandidate) {
          const studentMatch = await pool.query(
            "SELECT id, full_name FROM students WHERE TRIM(full_name) ILIKE $1 LIMIT 1",
            [trimmedCandidate]
          );

          if (studentMatch.rows.length) {
            await pushNotification({
              role: "student",
              recipientRole: "student",
              recipientId: studentMatch.rows[0].id,
              type: "interview",
              title: "Interview scheduled",
                message: `Your interview for ${position} is scheduled for ${readableDate} at ${readableTime}.`,
              metadata: {
                interviewId: createdInterview.id,
                candidateName: trimmedCandidate,
                position,
                date: createdInterview.date,
                time: createdInterview.time,
              },
              io: ioInstance,
            });
          }
        }
      }
    } catch (studentNotifyError) {
      console.error("Student interview notification error", studentNotifyError);
    }

    try {
      await notifyAdmins({
        title: "Interview scheduled",
          message: `${candidateName} has an interview for ${position} on ${readableDate} at ${readableTime}.`,
        type: "interview",
        metadata: {
          interviewId: createdInterview.id,
          candidateName,
          position,
        },
        io: ioInstance,
      });
    } catch (adminInterviewError) {
      console.error("Admin notification error (interview)", adminInterviewError);
    }

    res.status(201).json(createdInterview);
  } catch (error) {
    console.error("Error adding interview:", error);
    res.status(500).json({ error: "Server error while adding interview" });
  }
});

// ✅ PUT - Update (Reschedule) interview
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time } = req.body;

    if (!date || !time) {
      return res.status(400).json({ error: "Date and time are required" });
    }

    const result = await pool.query(
      "UPDATE interviews SET date = $1, time = $2 WHERE id = $3 RETURNING *",
      [date, time, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating interview:", error);
    res.status(500).json({ error: "Server error while updating interview" });
  }
});

// ✅ DELETE - Remove interview
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("DELETE FROM interviews WHERE id = $1 RETURNING *", [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Interview not found" });
    }

    res.json({ message: "Interview deleted successfully" });
  } catch (error) {
    console.error("Error deleting interview:", error);
    res.status(500).json({ error: "Server error while deleting interview" });
  }
});

module.exports = router;
