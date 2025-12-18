// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const path = require('path');

/* ================= UTILS ================= */
const { ensureNotificationsTable } = require('./utils/ensureNotificationsTable');
const { ensureAdminBootstrap } = require('./utils/ensureAdminBootstrap');
const { ensureProgramAssignmentsTable } = require('./utils/ensureProgramAssignmentsTable');

/* ================= DATABASE ================= */
const pool = require('./config/database');

/* ================= APP INIT ================= */
const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN ||
  process.env.CLIENT_URL ||
  'http://localhost:3000';

const ALLOWED_ORIGINS = FRONTEND_ORIGIN
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

if (!ALLOWED_ORIGINS.length) {
  ALLOWED_ORIGINS.push('http://localhost:3000');
}

const httpServer = http.createServer(app);

/* ================= SOCKET.IO ================= */
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
  },
});

app.set('io', io);

/* ================= DB BOOTSTRAP ================= */
(async () => {
  try {
    await ensureNotificationsTable();
    console.log('✅ Notifications table ready');

    await ensureAdminBootstrap();
    console.log('✅ Admin table ready');

    await ensureProgramAssignmentsTable();
    console.log('✅ program_assignments table ready');
  } catch (err) {
    console.error('❌ DB bootstrap failed', err);
    process.exit(1);
  }
})();

/* ================= SOCKET AUTH ================= */
const NOTIFICATION_ROLES = new Set(['student', 'mentor', 'admin', 'company']);

io.on('connection', (socket) => {
  const { role, recipientId } = socket.handshake.auth || {};

  if (!role || !NOTIFICATION_ROLES.has(role)) {
    socket.emit('notifications:error', { message: 'Invalid role supplied' });
    return socket.disconnect(true);
  }

  socket.join(role);
  if (recipientId) socket.join(`${role}:${recipientId}`);

  socket.emit('notifications:ready', {
    role,
    recipientId: recipientId || null,
  });
});

/* ================= NOTIFICATION CLEANUP ================= */
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000;

async function cleanupOldReadNotifications() {
  try {
    const res = await pool.query(`
      DELETE FROM notifications
      WHERE is_read = TRUE
      AND created_at < NOW() - INTERVAL '7 days'
      RETURNING id
    `);

    if (res.rowCount) {
      console.log(`🧹 Cleaned ${res.rowCount} old notifications`);
    }
  } catch (err) {
    console.error('❌ Notification cleanup error:', err.message);
  }
}

setTimeout(() => {
  cleanupOldReadNotifications();
  setInterval(cleanupOldReadNotifications, CLEANUP_INTERVAL_MS);
}, 1000);

/* ================= ROUTE IMPORTS ================= */
const userProfileRoutes = require('./routes/userProfile');
const testimonialsRouter = require('./routes/testimonials');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const mentorProjectRoutes = require('./routes/mentorProjects');
const mentorReviewRoutes = require('./routes/mentorReviews');
const companyProfilesRoutes = require('./routes/companyProfilesRoute');
const statsRoutes = require('./routes/stats');
const studentsRoutes = require('./routes/students');
const mentorsRoutes = require('./routes/mentors');
const companiesRouter = require('./routes/companiesRoute');
const searchCompaniesRouter = require('./routes/searchcompanies');
const searchProjectRoutes = require('./routes/searchproject');
const searchStudent = require('./routes/searchStudents');
const formRoute = require('./routes/formRoutes');
const skillBadgesRoutes = require('./routes/skillBadges');
const coursesRoutes = require('./routes/coursesRoute');
const interviewRoutes = require('./routes/interviews');
const notificationRoutes = require('./routes/notifications');
const studentProjectsRoutes = require('./routes/studentProjects');

/* ================= MIDDLEWARE ================= */
app.use(
  cors({

    origin: ALLOWED_ORIGINS,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/* ================= ROUTES ================= */
const authRoutes = require('./routes/auth');
const userProfileRoutes = require('./routes/userProfile');
const testimonialsRoutes = require('./routes/testimonials');
const projectsRoutes = require('./routes/projects');
const studentProjectsRoutes = require('./routes/studentProjects');
const mentorProjectRoutes = require('./routes/mentorProjects');
const mentorReviewRoutes = require('./routes/mentorReviews');
const companyProfilesRoutes = require('./routes/companyProfilesRoute');
const companiesRoutes = require('./routes/companiesRoute');
const statsRoutes = require('./routes/stats');
const studentsRoutes = require('./routes/students');
const mentorsRoutes = require('./routes/mentors');
const searchCompaniesRoutes = require('./routes/searchcompanies');
const searchStudentsRoutes = require('./routes/searchStudents');
const searchProjectRoutes = require('./routes/searchproject');
const coursesRoutes = require('./routes/coursesRoute');
const assignedProgramsRoutes = require('./routes/assignedPrograms');
const interviewsRoutes = require('./routes/interviews');
const skillBadgesRoutes = require('./routes/skillBadges');
const formRoutes = require('./routes/formRoutes');
const notificationRoutes = require('./routes/notifications');
const enrollmentsRoutes = require('./routes/enrollments');

/* ================= API ================= */
app.use('/api/auth', authRoutes);
app.use('/api', userProfileRoutes);

app.use('/api/projects', projectsRoutes);
app.use('/api/student-projects', studentProjectsRoutes);

app.use('/api/mentor_projects', mentorProjectRoutes);
app.use('/api/mentorreviews', mentorReviewRoutes);

app.use('/api/company-profiles', companyProfilesRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/searchcompanies', searchCompaniesRoutes);

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/stats', statsRoutes);

app.use('/api/courses', coursesRoutes);
app.use('/api/assigned-programs', assignedProgramsRoutes);

app.use('/api/students', studentsRoutes);
app.use('/api/searchStudents', searchStudentsRoutes);
app.use('/api/mentors', mentorsRoutes);

app.use('/api/interviews', interviewsRoutes);
app.use('/api/skill-badges', skillBadgesRoutes);

app.use('/api/form', formRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/enrollments', enrollmentsRoutes);
app.use('/api/searchproject', searchProjectRoutes);

/* ================= HEALTH ================= */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running successfully',
    timestamp: new Date().toISOString(),
  });
});

/* ================= 404 ================= */
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/* ================= ERROR HANDLER ================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'Internal server error',
  });
});

/* ================= START ================= */
httpServer.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Health: http://localhost:${PORT}/health`);
});
