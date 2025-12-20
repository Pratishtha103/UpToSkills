const express = require('express');
const bcrypt = require('bcryptjs');
const pool = require('../config/database');
const router = express.Router();

// ✅ POST /api/forgot-password - Reset password for any user type
router.post('/forgot-password', async (req, res) => {
  console.log('🔐 Forgot password endpoint called');
  console.log('Request body:', req.body);
  
  try {
    const { email, password } = req.body;
    
    // ========== VALIDATION ==========
    if (!email || !email.trim()) {
      console.log('❌ Email missing');
      return res.status(400).json({
        success: false,
        message: 'Email or username is required'
      });
    }

    if (!password || !password.trim()) {
      console.log('❌ Password missing');
      return res.status(400).json({
        success: false,
        message: 'Password is required'
      });
    }

    const emailTrimmed = email.trim().toLowerCase();
    console.log('📧 Looking for user:', emailTrimmed);
    
    // ========== FIND USER ==========
    // Try students table first
    let userType = null;
    let userId = null;
    let userName = null;
    let userEmail = null;

    try {
      const studentResult = await pool.query(
        'SELECT id, email, username FROM students WHERE LOWER(email) = $1 OR LOWER(username) = $1 LIMIT 1',
        [emailTrimmed]
      );

      if (studentResult.rows.length > 0) {
        userType = 'student';
        userId = studentResult.rows[0].id;
        userName = studentResult.rows[0].username;
        userEmail = studentResult.rows[0].email;
        console.log('✅ Found student:', userId);
      }
    } catch (err) {
      console.warn('⚠ Error searching students:', err.message);
    }

    // Try mentors table if not found
    if (!userType) {
      try {
        const mentorResult = await pool.query(
          'SELECT id, email, username FROM mentors WHERE LOWER(email) = $1 OR LOWER(username) = $1 LIMIT 1',
          [emailTrimmed]
        );

        if (mentorResult.rows.length > 0) {
          userType = 'mentor';
          userId = mentorResult.rows[0].id;
          userName = mentorResult.rows[0].username;
          userEmail = mentorResult.rows[0].email;
          console.log('✅ Found mentor:', userId);
        }
      } catch (err) {
        console.warn('⚠ Error searching mentors:', err.message);
      }
    }

    // Try companies table if not found
    if (!userType) {
      try {
        const companyResult = await pool.query(
          'SELECT id, email, username FROM companies WHERE LOWER(email) = $1 OR LOWER(username) = $1 LIMIT 1',
          [emailTrimmed]
        );

        if (companyResult.rows.length > 0) {
          userType = 'company';
          userId = companyResult.rows[0].id;
          userName = companyResult.rows[0].username;
          userEmail = companyResult.rows[0].email;
          console.log('✅ Found company:', userId);
        }
      } catch (err) {
        console.warn('⚠ Error searching companies:', err.message);
      }
    }

    // If user not found in any table
    if (!userType) {
      console.log('❌ User not found in any table');
      return res.status(404).json({
        success: false,
        message: 'User not found with this email or username'
      });
    }

    // ========== HASH PASSWORD ==========
    console.log('🔐 Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('✅ Password hashed');

    // ========== UPDATE PASSWORD ==========
    console.log(`📝 Updating ${userType} password...`);
    
    let updateResult;
    
    if (userType === 'student') {
      updateResult = await pool.query(
        'UPDATE students SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, username',
        [hashedPassword, userId]
      );
    } else if (userType === 'mentor') {
      updateResult = await pool.query(
        'UPDATE mentors SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, username',
        [hashedPassword, userId]
      );
    } else if (userType === 'company') {
      updateResult = await pool.query(
        'UPDATE companies SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id, email, username',
        [hashedPassword, userId]
      );
    }

    if (!updateResult || updateResult.rows.length === 0) {
      console.log('❌ Failed to update password');
      return res.status(500).json({
        success: false,
        message: 'Failed to update password'
      });
    }

    console.log('✅ Password updated successfully for', userType, userId);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
      userId: updateResult.rows[0].id,
      userType: userType
    });

  } catch (error) {
    console.error('❌ FORGOT PASSWORD ERROR:');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Server error during password reset',
      error: error.message
    });
  }
});

module.exports = router;