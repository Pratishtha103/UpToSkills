// backend/scripts/addStatusColumn.js
// Run this script to add the status column to the students table
// Usage: node backend/scripts/addStatusColumn.js

const pool = require('../config/database');

const addStatusColumn = async () => {
  try {
    console.log('Adding status column to students table...');
    
    // Add status column if it doesn't exist
    await pool.query(`
      ALTER TABLE students 
      ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'Active'
    `);
    
    console.log('✅ Status column added successfully!');
    console.log('Default value is "Active" for all existing students.');
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error adding status column:', err.message);
    process.exit(1);
  }
};

addStatusColumn();