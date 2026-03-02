const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/stats — global platform stats
router.get("/", (req, res) => {
  try {
    const totalReviews = db
      .prepare("SELECT COUNT(*) as count FROM reviews")
      .get();
    const avgRating = db
      .prepare("SELECT ROUND(AVG(rating), 2) as avg FROM reviews")
      .get();
    const totalBrands = db
      .prepare("SELECT COUNT(*) as count FROM brands WHERE id IN (SELECT DISTINCT brand_id FROM reviews)")
      .get();
    const regionBreakdown = db
      .prepare(
        "SELECT region, COUNT(*) as count FROM reviews GROUP BY region ORDER BY count DESC"
      )
      .all();
    const topBrands = db
      .prepare(
        `SELECT brand_name, ROUND(AVG(rating), 1) as avg_rating, COUNT(*) as reviews
       FROM reviews GROUP BY brand_name ORDER BY avg_rating DESC, reviews DESC LIMIT 5`
      )
      .all();
    const recentActivity = db
      .prepare(
        `SELECT DATE(created_at) as date, COUNT(*) as count 
       FROM reviews 
       WHERE created_at >= datetime('now', '-30 days')
       GROUP BY DATE(created_at) ORDER BY date ASC`
      )
      .all();

    res.json({
      success: true,
      data: {
        totalReviews: totalReviews.count,
        avgRating: avgRating.avg || 0,
        totalBrands: totalBrands.count,
        regionBreakdown,
        topBrands,
        recentActivity,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch stats" });
  }
});

module.exports = router;