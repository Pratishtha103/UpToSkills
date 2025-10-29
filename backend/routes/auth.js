// ========================================
// auth.js - Authentication Routes
// ========================================
const express = require('express');
const pool = require('../config/database'); // PostgreSQL connection pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verifyToken= require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';



// ---------------- HELPERS ----------------
function validateEmail(email) {
  const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return re.test(email);
}

function validateRole(role) {
  const roles = ['admin', 'student', 'company', 'mentor'];
  return roles.includes(role.toLowerCase());
}

// ---------------- REGISTER ----------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email format' });
    }
    if (!validateRole(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    if (role.toLowerCase() === 'admin') {
      return res.status(400).json({ success: false, message: 'Admin registration is not allowed' });
    }

    // Choose table
    let tableName;
    if (role.toLowerCase() === 'company') {
      tableName = 'companies';
    } else if (role.toLowerCase() === 'mentor') {
      tableName = 'mentors';
    } else {
      tableName = 'students';
    }

    // Check if user exists
    const existing = await pool.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let insertQuery, values;
    if (role.toLowerCase() === 'company') {
      insertQuery = `
        INSERT INTO companies (company_name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, company_name AS name, email
      `;
      values = [name, email, phone, hashedPassword];
    } else if (role.toLowerCase() === 'mentor') {
      insertQuery = `
        INSERT INTO mentors (full_name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name AS name, email
      `;
      values = [name, email, phone, hashedPassword];
    } else {
      insertQuery = `
        INSERT INTO students (full_name, email, phone, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id, full_name AS name, email
      `;
      values = [name, email, phone, hashedPassword];
    }

    const result = await pool.query(insertQuery, values);
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: { ...result.rows[0], role: role.toLowerCase() }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

// ---------------- LOGIN ----------------
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ success: false, message: 'Email, password and role are required' });
    }
    if (!validateRole(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    // Choose table
    let tableName;
    if (role.toLowerCase() === 'admin') {
      tableName = 'admins';
    } else if (role.toLowerCase() === 'student') {
      tableName = 'students';
    } else if (role.toLowerCase() === 'mentor') {
      tableName = 'mentors';
    } else {
      tableName = 'companies';
    }

    const userResult = await pool.query(`SELECT * FROM ${tableName} WHERE email = $1`, [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    // Build JWT payload (IMPORTANT: nested under `user`)
    const payload = {
      user: {
        id: user.id,
        role: role.toLowerCase(),
        email: user.email,
        name: user.full_name || user.company_name
      }
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.full_name || user.company_name,
        email: user.email,
        role: role.toLowerCase()
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

// ---------------- SETUP ADMIN TABLE ----------------
router.get('/setup-admin-table', async (req, res) => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;

  try {
    await pool.query(createTableQuery);
    res.json({ success: true, message: "✅ Admins table created (or already exists)" });
  } catch (error) {
    console.error("❌ Error creating admins table:", error);
    res.status(500).json({ success: false, message: "Error creating admins table" });
  }
});

router.get("/getStudent", verifyToken,
  async (req, res) => {
  try {
    const userId = req.user.id; // decoded from token

    const query = 'SELECT * FROM students WHERE id = $1';
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
})


module.exports = router;