const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

// Database connection
const pool = require('./config/database');

// Initialize Express app FIRST
const app = express();
const PORT = process.env.PORT || 5000;

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
const companiesRoutes = require('./routes/companies.route');
const searchStudent = require('./routes/searchStudents');
const formRoute = require('./routes/formRoutes');
const skillBadgesRoutes = require('./routes/skillBadges');
const coursesRoutes = require('./routes/courses.route');
const interviewRoutes = require('./routes/interviews');

// Middleware setup
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'], // React frontend ports
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount routes in proper order
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
app.use('/api/companies', companiesRoutes);
app.use('/api/enrollments', require('./routes/enrollmentRoutes'));
app.use('/api/test', require('./routes/testEnrollment'));
app.use('/api/debug', require('./routes/debugRoutes'));
app.use('/api/interviews', interviewRoutes);

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
        message: 'Route not found'
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
app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/health`);
    // console.log('DB_PASSWORD:', process.env.DB_PASSWORD);
    // console.log('Type:', typeof process.env.DB_PASSWORD);

});
