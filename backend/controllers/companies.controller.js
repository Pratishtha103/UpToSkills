const pool = require('../config/database');

const getCompanies = async (req, res) => {
  try {
    const companies = await pool.query(`SELECT * FROM companies`);
    if (!companies.rows.length) {
      return res.status(404).send('No companies found');
    }
    return res.status(200).json(companies.rows);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return res.status(500).send("Server error");
  }
};

const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`DELETE FROM companies WHERE id = $1 RETURNING *`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.json({ success: true, message: "Company removed successfully" });
  } catch (error) {
    console.error("Error deleting company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCompanies, deleteCompany };
