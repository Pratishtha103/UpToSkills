const pool = require('../config/database');

// GET all company profiles
const getCompanyProfiles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM company_profiles');
    if (!result.rows.length) return res.status(404).send('No company profiles found');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// GET company profile by ID
const getCompanyProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM company_profiles WHERE id=$1',
      [id]
    );
    if (!result.rows.length) return res.status(404).send('Company profile not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

// UPDATE company profile by ID
const updateCompanyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, industry, contact } = req.body;

    let logo_url;
    if (req.file) {
      logo_url = `/uploads/${req.file.filename}`;
    } else {
      const oldLogo = await pool.query(
        'SELECT logo_url FROM company_profiles WHERE id=$1',
        [id]
      );
      logo_url = oldLogo.rows[0]?.logo_url || null;
    }

    const result = await pool.query(
      `UPDATE company_profiles
         SET name=$1,
             website=$2,
             industry=$3,
             contact=$4,
             logo_url=$5,
             updated_at=NOW()
       WHERE id=$6
       RETURNING *`,
      [name, website, industry, contact, logo_url, id]
    );

    if (!result.rows.length) return res.status(404).send('Company profile not found');
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
// POST /api/company-profiles
const addCompanyProfile = async (req, res) => {
  try {
    const { name, website, industry, contact } = req.body;
    const logo_url = req.file ? `/uploads/${req.file.filename}` : null;

    const result = await pool.query(
      `INSERT INTO company_profiles (name, website, industry, contact, logo_url)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, website, industry, contact, logo_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


module.exports = {
  getCompanyProfiles,
  getCompanyProfileById,
  addCompanyProfile,
  updateCompanyProfile
};
