const express = require("express");
const router = express.Router();
const pool = require("../config/database");
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
router.post("/", async (req, res) => {
  try {
    const { candidateName, position, date, time } = req.body;

    if (!candidateName || !position || !date || !time) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      `INSERT INTO interviews (candidate_name, role, date, time, status)
       VALUES ($1, $2, $3, $4, 'Scheduled')
       RETURNING *`,
      [candidateName, position, date, time]
    );

    const createdInterview = result.rows[0];
    const slotLabel = formatInterviewSlot(createdInterview.date, createdInterview.time);
    const ioInstance = req.app.get("io");

    try {
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
            message: `Your interview for ${position} is set for ${slotLabel}.`,
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
    } catch (studentNotifyError) {
      console.error("Student interview notification error", studentNotifyError);
    }

    try {
      await notifyAdmins({
        title: "Interview scheduled",
        message: `${candidateName} has an interview for ${position} on ${slotLabel}.`,
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
