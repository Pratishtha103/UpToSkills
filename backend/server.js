// backend/server.js
const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const path = require('path');
const { ensureNotificationsTable } = require('./utils/ensureNotificationsTable');
const { ensureAdminBootstrap } = require('./utils/ensureAdminBootstrap');
const { ensureProgramAssignmentsTable } = require('./utils/ensureProgramAssignmentsTable');

// Database connection
const pool = require('./config/database');

// Initialize Express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || process.env.CLIENT_URL || 'http://localhost:3000';
const ALLOWED_ORIGINS = FRONTEND_ORIGIN.split(',').map((origin) => origin.trim()).filter(Boolean);
if (!ALLOWED_ORIGINS.length) {
    ALLOWED_ORIGINS.push('http://localhost:3000');
}
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        credentials: true,
    },
});

app.set('io', io);

ensureNotificationsTable()
    .then(() => console.log('✅ Notifications table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure notifications schema', err);
        process.exit(1);
    });

ensureAdminBootstrap()
    .then(() => console.log('✅ Admin table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure admin bootstrap', err);
        process.exit(1);
    });

ensureProgramAssignmentsTable()
    .then(() => console.log('✅ program_assignments table ready'))
    .catch((err) => {
        console.error('❌ Failed to ensure program_assignments table', err);
        process.exit(1);
    });

const NOTIFICATION_ROLES = new Set(['student', 'mentor', 'admin', 'company']);

io.on('connection', (socket) => {
    const { role, recipientId } = socket.handshake.auth || {};

    if (!role || !NOTIFICATION_ROLES.has(role)) {
        socket.emit('notifications:error', { message: 'Invalid role supplied' });
        return socket.disconnect(true);
    }

    socket.join(role);
    if (recipientId) {
        socket.join(`${role}:${recipientId}`);
    }

    socket.emit('notifications:ready', {
        role,
        recipientId: recipientId || null,
    });
});

// Scheduled cleanup: remove notifications that have been read and are older than 7 weeks.
// Unread notifications are retained indefinitely.
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000; // run once per day
async function cleanupOldReadNotifications() {
    try {
        const res = await pool.query(
            `DELETE FROM notifications WHERE is_read = TRUE AND created_at < NOW() - INTERVAL '7 weeks' RETURNING id`);
        if (res && res.rowCount) {
            console.log(`🧹 Cleaned up ${res.rowCount} read notification(s) older than 7 weeks`);
        } else {
            console.log('🧹 Notification cleanup ran: no old read notifications found');
        }
    } catch (err) {
        console.error('❌ Error during notification cleanup:', err && err.message ? err.message : err);
    }
}

// Start cleanup timer after server starts. Also run once immediately on startup.
setTimeout(() => {
    cleanupOldReadNotifications();
    setInterval(cleanupOldReadNotifications, CLEANUP_INTERVAL_MS);
}, 1000);

// Import routers
const userProfileRoutes = require('./routes/userProfile');
const authRoutes = require('./routes/auth');
const projectsRoutes = require('./routes/projects');
const mentorProjectRoutes = require('./routes/mentor_projects');
const mentorReviewRoutes = require('./routes/mentorReviews');
const companyProfilesRoutes = require('./routes/companyProfiles.route');
const statsRoutes = require("./routes/stats");
const testimonialsRouter = require("./routes/testimonials");
const studentsRoutes = require('./routes/students');
const mentorsRoutes = require('./routes/mentors');
const companiesRouter = require("./routes/companies.route");
const searchCompaniesRouter = require("./routes/searchcompanies");
const searchProjectRoutes = require('./routes/searchproject');
const searchStudent = require('./routes/searchStudents');
const formRoute = require('./routes/formRoutes');
const skillBadgesRoutes = require('./routes/skillBadges');
const coursesRoutes = require('./routes/courses.route');
const interviewRoutes = require('./routes/interviews');
const notificationRoutes = require('./routes/notifications');


// ✅ MIDDLEWARE SETUP FIRST (CRITICAL for req.body to work)
app.use(cors({
    origin: ALLOWED_ORIGINS,
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.post('/api/forgot-password', async (req, res) => {
    console.log('🔑 Forgot password route hit');
    
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const updateQuery = `
            UPDATE students 
            SET password = $1, updated_at = NOW() 
            WHERE email = $2
            RETURNING id
        `;
        
        const updateResult = await pool.query(updateQuery, [hashedPassword, email]);

        if (updateResult.rowCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'Student account not found'
            });
        }

        console.log('✅ Password reset successful');
        res.status(200).json({
            success: true,
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('❌ Forgot password error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
});


// Mount routes in proper order (AFTER forgot-password route)
app.use('/api/auth', authRoutes);
app.use('/api', userProfileRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/mentor_projects', mentorProjectRoutes);
app.use('/api/mentorreviews', mentorReviewRoutes);
app.use('/api/company-profiles', companyProfilesRoutes);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/stats', statsRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/searchStudents', searchStudent);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/form', formRoute);
app.use('/api/skill-badges', skillBadgesRoutes);
app.use('/api/courses', coursesRoutes);
// Assigned programs route (assign/lookup programs to mentors)
app.use('/api/assigned-programs', require('./routes/assignedPrograms'));
app.use('/api/interviews', interviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use("/api/enrollments", require("./routes/enrollments"));
app.use('/api/companies', companiesRouter);
app.use('/api/searchcompanies', searchCompaniesRouter);
app.use('/api/searchproject', searchProjectRoutes);
// Add this line with other routes (around line 20-30)
app.use('/api/student-projects', require('./routes/studentProjects'));


// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString()
    });
});

// 404 handler for unmatched routes
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Global error handler middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start the server last
httpServer.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
});
