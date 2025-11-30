// ========================================
// auth.js - Authentication Routes
// ========================================
const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const { ensureWelcomeNotification, pushNotification, notifyAdmins } = require('../utils/notificationService');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ---------------- HELPERS ----------------
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const validateRole = (role) => {
  const roles = ['admin', 'student', 'company', 'mentor'];
  return roles.includes(role.toLowerCase());
};

const formatRoleLabel = (role = '') =>
  role.charAt(0).toUpperCase() + role.slice(1);

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, username } = req.body;

    if (!name || !email || !phone || !password || !role || !username) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!validateEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    if (!validateRole(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });

    const normalizedRole = role.toLowerCase();

    if (normalizedRole === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin registration is not allowed' });
    }

    // Choose table
    let tableName =
      normalizedRole === "company"
        ? "companies"
        : normalizedRole === "mentor"
          ? "mentors"
          : "students";

    // Check existing email
    const existingEmail = await pool.query(
      `SELECT * FROM ${tableName} WHERE email = $1`,
      [email]
    );

    if (existingEmail.rows.length > 0)
      return res.status(400).json({ success: false, message: 'Email already exists' });

    // Check existing username
    const existingUsername = await pool.query(
      `SELECT * FROM ${tableName} WHERE username = $1`,
      [username]
    );

    if (existingUsername.rows.length > 0)
      return res.status(400).json({ success: false, message: 'Username already taken' });

    const hashedPassword = await bcrypt.hash(password, 10);

    let insertQuery, values;

    if (normalizedRole === 'company') {
      insertQuery = `
        INSERT INTO companies (company_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, company_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];

    } else if (normalizedRole === 'mentor') {
      insertQuery = `
        INSERT INTO mentors (full_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];

    } else {
      insertQuery = `
        INSERT INTO students (full_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, full_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];
    }

    const ioInstance = req.app.get('io');
    const result = await pool.query(insertQuery, values);
    const newUser = { ...result.rows[0], role: normalizedRole };

    // Welcome Notification
    try {
      await pushNotification({
        role: normalizedRole,
        recipientRole: normalizedRole,
        recipientId: newUser.id,
        type: 'welcome',
        title: `Welcome to UpToSkills, ${newUser.name || name}!`,
        message: 'You are all set. Explore the dashboard to get started.',
        metadata: {
          username: newUser.username,
          email: newUser.email,
          role: normalizedRole,
        },
        io: ioInstance,
      });
    } catch (welcomeError) {
      console.error('Welcome notification error:', welcomeError);
    }

    // Notify Admins
    try {
      await notifyAdmins({
        title: `New ${formatRoleLabel(normalizedRole)} registered`,
        message: `${newUser.name || name || 'A user'} just joined as a ${normalizedRole}.`,
        type: 'user_register',
        metadata: {
          role: normalizedRole,
          userId: newUser.id,
          email: newUser.email,
        },
        io: ioInstance,
      });
    } catch (adminNotifyError) {
      console.error('Admin notification error (registration):', adminNotifyError);
    }

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser,
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === '23505') {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });
    }

    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({
        success: false,
        message: 'Email/Username, password and role are required'
      });

    const normalizedRole = role.toLowerCase();

    // Choose table
    let tableName =
      normalizedRole === "admin"
        ? "admins"
        : normalizedRole === "student"
          ? "students"
          : normalizedRole === "mentor"
            ? "mentors"
            : "companies";

    // Admin → ONLY email login
    let loginQuery =
      normalizedRole === "admin"
        ? `SELECT * FROM admins WHERE LOWER(email) = LOWER($1)`
        : `SELECT * FROM ${tableName}
           WHERE LOWER(email) = LOWER($1)
           OR LOWER(username) = LOWER($1)`;

    const userResult = await pool.query(loginQuery, [email]);

    if (userResult.rows.length === 0)
      return res.status(400).json({ success: false, message: "Incorrect email/username or password" });

    const user = userResult.rows[0];

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({
        success: false,
        message: "Incorrect email/username or password"
      });

    // DETECT REAL ROLE
    const realRole =
      tableName === "students"
        ? "student"
        : tableName === "mentors"
          ? "mentor"
          : tableName === "companies"
            ? "company"
            : "admin";

    // BLOCK ROLE MISMATCH
    if (realRole !== normalizedRole) {
      return res.status(401).json({
        success: false,
        message: "Incorrect role selected. You cannot log in as this role."
      });
    }

    const displayName =
      user.full_name ||
      user.company_name ||
      user.name ||
      (normalizedRole === 'admin' ? 'Admin' : null) ||
      user.email;

    // Build JWT
    const payload = {
      user: {
        id: user.id,
        role: normalizedRole,
        email: user.email,
        name: displayName
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    const ioInstance = req.app.get('io');

    // Send Welcome Notification
    await ensureWelcomeNotification({
      role: normalizedRole,
      recipientId: user.id,
      name: displayName,
      io: ioInstance,
    });

    // Login Notification
    try {
      const timestamp = new Date();
      const friendlyTime = timestamp.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      await pushNotification({
        role: normalizedRole,
        recipientRole: normalizedRole,
        recipientId: user.id,
        type: 'login',
        title: 'New login detected',
        message: `You signed in on ${friendlyTime}. If this wasn't you, please reset your password.`,
        metadata: {
          timestamp: timestamp.toISOString(),
          ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.ip,
          userAgent: req.get('user-agent') || 'unknown',
        },
        io: ioInstance,
      });
    } catch (notificationError) {
      console.error('Login notification error:', notificationError);
    }

    // Admin Notification
    try {
      await notifyAdmins({
        title: `${formatRoleLabel(normalizedRole)} signed in`,
        message: `${displayName} logged in at ${new Date().toLocaleTimeString('en-US')}.`,
        type: 'user_login',
        metadata: {
          role: normalizedRole,
          userId: user.id,
          email: user.email,
        },
        io: ioInstance,
      });
    } catch (adminNotifyLoginError) {
      console.error('Admin notification error (login):', adminNotifyLoginError);
    }

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: displayName,
        email: user.email,
        role: normalizedRole
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// ---------------- GET STUDENT (token) ----------------
router.get('/getStudent', verifyToken, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM students WHERE id = $1",
      [req.user.id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
