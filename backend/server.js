// server.js

const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import database connection
const pool = require('./config/database');

// Import routes
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

const app = express();
const PORT = process.env.PORT || 5000;

const path = require('path');

// Serve uploads folder correctly
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors({
    origin: 'http://localhost:3000', // React frontend port
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api', userProfileRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/mentor_projects', mentorProjectRoutes);
app.use('/api/companies', companiesRoutes);
app.use('/api/mentorreviews', mentorReviewRoutes);
app.use('/api/students', studentsRoutes);
app.use('/api/mentors', mentorsRoutes);
app.use('/api/company-profiles', companyProfilesRoutes);
app.use("/api/testimonials", testimonialsRouter);

app.use("/api/stats", statsRoutes);

app.use('/api/students', searchStudent);

app.use('/api/form', formRoute);
app.use('/api/skill-badges', skillBadgesRoutes);

app.use('/api/courses', coursesRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check available at: http://localhost:${PORT}/health`);
});
