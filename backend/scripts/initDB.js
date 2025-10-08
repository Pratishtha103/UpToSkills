// scripts/initDB.js
require('dotenv').config();
const pool = require('../config/database');

(async () => {
  try {
    // Create all required tables if they do not exist
    // Order matters due to foreign key constraints

    await pool.query(`
      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        company_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS company_profiles (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        website TEXT,
        industry TEXT,
        contact TEXT,
        logo_url TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentors (
        id SERIAL PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS skill_badges (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS programs (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone VARCHAR(15),
        education TEXT,
        programexp TEXT,
        course TEXT,
        resume_path TEXT,
        resume_data BYTEA,
        resume_mime TEXT,
        resume_filename TEXT,
        date TEXT,
        time TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        program_id INTEGER REFERENCES programs(id),
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(15) NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS user_details (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        full_name VARCHAR(255),
        contact_number VARCHAR(15),
        linkedin_url TEXT,
        github_url TEXT,
        why_hire_me TEXT,
        profile_completed BOOLEAN DEFAULT FALSE,
        ai_skill_summary TEXT,
        domains_of_interest TEXT[],
        others_domain TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        date DATE NOT NULL,
        status VARCHAR(10) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS mentor_projects (
        id SERIAL PRIMARY KEY,
        project_title TEXT NOT NULL,
        mentor_id INTEGER REFERENCES mentors(id),
        mentor_name TEXT NOT NULL,
        total_students INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        title TEXT NOT NULL,
        description TEXT,
        tech_stack TEXT,
        contributions TEXT,
        is_open_source BOOLEAN DEFAULT false,
        github_pr_link TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_assignments (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id),
        student_id INTEGER REFERENCES students(id),
        assigned_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_badges (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        badge_id INTEGER REFERENCES skill_badges(id),
        awarded_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);


    console.log('✅ All tables checked/created successfully');
  } catch (err) {
    console.error('❌ Failed to initialize DB:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
})();
