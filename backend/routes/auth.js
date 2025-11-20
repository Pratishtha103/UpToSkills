// ========================================
// auth.js - Authentication Routes
// ========================================
const express = require('express');
const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// ---------------- HELPERS ----------------
const validateEmail = (email) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);

const validateRole = (role) => {
  const roles = ['admin', 'student', 'company', 'mentor'];
  return roles.includes(role.toLowerCase());
};

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role, username } = req.body;

    if (!name || !email || !phone || !password || !role || !username)
      return res.status(400).json({ success: false, message: 'All fields are required' });

    if (!validateEmail(email))
      return res.status(400).json({ success: false, message: 'Invalid email format' });

    if (!validateRole(role))
      return res.status(400).json({ success: false, message: 'Invalid role' });

    if (role.toLowerCase() === 'admin')
      return res.status(400).json({ success: false, message: 'Admin registration not allowed' });

    let tableName = role === "company"
      ? "companies"
      : role === "mentor"
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

    let insertQuery = "";
    let values = [];

    if (role === "company") {
      insertQuery = `
        INSERT INTO companies (company_name, email, phone, password, username)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, company_name AS name, email, username`;
      values = [name, email, phone, hashedPassword, username];

    } else if (role === "mentor") {
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

    const result = await pool.query(insertQuery, values);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      user: { ...result.rows[0], role }
    });

  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === '23505')
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists'
      });

    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const identifier = email; // email or username

    if (!identifier || !password || !role)
      return res.status(400).json({
        success: false,
        message: 'Email/Username, password and role are required'
      });

    if (!validateRole(role))
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });

    let tableName =
      role === "admin"
        ? "admins"
        : role === "student"
          ? "students"
          : role === "mentor"
            ? "mentors"
            : "companies";

    // Admin → ONLY email login
    let loginQuery =
      role === "admin"
        ? `SELECT * FROM admins WHERE LOWER(email) = LOWER($1)`
        : `SELECT * FROM ${tableName}
           WHERE LOWER(email) = LOWER($1)
           OR LOWER(username) = LOWER($1)`;

    const userResult = await pool.query(loginQuery, [identifier]);

    if (userResult.rows.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email/username or password" });

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, message: "Incorrect email/username or password" });

    const payload = {
      user: {
        id: user.id,
        role,
        email: user.email,
        username: user.username,
        name: user.full_name || user.company_name || user.username
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: payload.user
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
