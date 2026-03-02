const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/brands — list all brands with avg rating
router.get("/", (req, res) => {
  try {
    const brands = db
      .prepare(
        `SELECT 
        b.id, b.name, b.slug, b.category,
        COUNT(r.id) as review_count,
        ROUND(AVG(r.rating), 1) as avg_rating
      FROM brands b
      LEFT JOIN reviews r ON r.brand_id = b.id
      GROUP BY b.id
      ORDER BY review_count DESC, b.name ASC`
      )
      .all();
    res.json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch brands" });
  }
});

// GET /api/brands/:slug/stats
router.get("/:slug/stats", (req, res) => {
  try {
    const brand = db
      .prepare(
        `SELECT b.*, 
        COUNT(r.id) as review_count,
        ROUND(AVG(r.rating), 1) as avg_rating,
        SUM(CASE WHEN r.rating = 5 THEN 1 ELSE 0 END) as five_star,
        SUM(CASE WHEN r.rating = 4 THEN 1 ELSE 0 END) as four_star,
        SUM(CASE WHEN r.rating = 3 THEN 1 ELSE 0 END) as three_star,
        SUM(CASE WHEN r.rating = 2 THEN 1 ELSE 0 END) as two_star,
        SUM(CASE WHEN r.rating = 1 THEN 1 ELSE 0 END) as one_star
      FROM brands b
      LEFT JOIN reviews r ON r.brand_id = b.id
      WHERE b.slug = ?
      GROUP BY b.id`
      )
      .get(req.params.slug);

    if (!brand) {
      return res.status(404).json({ success: false, error: "Brand not found" });
    }

    res.json({ success: true, data: brand });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch brand" });
  }
});

module.exports = router;