const express = require("express");
const router = express.Router();
const {
  listNotifications,
  countNotifications,
  createNotification,
  markNotificationRead,
  markAllRead,
} = require("../controllers/notifications.controller");

router.get("/", listNotifications);
router.get("/count", countNotifications);
router.post("/", createNotification);
router.patch("/:id/read", markNotificationRead);
router.patch("/read-all", markAllRead);

module.exports = router;
