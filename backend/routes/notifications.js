const express = require("express");
const router = express.Router();
const {
  listNotifications,
  createNotification,
  markNotificationRead,
  markAllRead,
} = require("../controllers/notifications.controller");

router.get("/", listNotifications);
router.post("/", createNotification);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllRead);

module.exports = router;
