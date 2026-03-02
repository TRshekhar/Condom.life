const express = require("express");
const router = express.Router();
const db = require("../db");

const VALID_REGIONS = [
  "All",
  "Asia",
  "America",
  "Africa",
  "Australia",
  "Europe",
  "Russia",
  "India",
  "Middle East",
  "Latin America",
  "Global",
];

const VALID_SORT = ["newest", "top_rated", "most_liked"];

// GET /api/reviews
router.get("/", (req, res) => {
  try {
    const {
      region = "All",
      sort = "newest",
      brand,
      page = 1,
      limit = 10,
      search,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const offset = (pageNum - 1) * limitNum;

    let whereClauses = [];
    let params = [];

    if (region && region !== "All") {
      whereClauses.push("r.region = ?");
      params.push(region);
    }

    if (brand) {
      whereClauses.push("LOWER(r.brand_name) LIKE LOWER(?)");
      params.push(`%${brand}%`);
    }

    if (search) {
      whereClauses.push(
        "(LOWER(r.title) LIKE LOWER(?) OR LOWER(r.content) LIKE LOWER(?) OR LOWER(r.brand_name) LIKE LOWER(?))"
      );
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereSQL =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const sortMap = {
      newest: "r.created_at DESC",
      top_rated: "r.rating DESC, r.created_at DESC",
      most_liked: "r.likes DESC, r.created_at DESC",
    };
    const orderSQL = sortMap[sort] || sortMap.newest;

    const countStmt = db.prepare(
      `SELECT COUNT(*) as total FROM reviews r ${whereSQL}`
    );
    const { total } = countStmt.get(...params);

    const reviewsStmt = db.prepare(`
      SELECT 
        r.id, r.username, r.brand_name, r.title, r.content,
        r.rating, r.region, r.likes, r.created_at
      FROM reviews r
      ${whereSQL}
      ORDER BY ${orderSQL}
      LIMIT ? OFFSET ?
    `);
    const reviews = reviewsStmt.all(...params, limitNum, offset);

    res.json({
      success: true,
      data: reviews,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
});

// GET /api/reviews/:id
router.get("/:id", (req, res) => {
  try {
    const review = db
      .prepare(
        `SELECT r.id, r.username, r.brand_name, r.title, r.content, r.rating, r.region, r.likes, r.created_at
       FROM reviews r WHERE r.id = ?`
      )
      .get(req.params.id);

    if (!review) {
      return res
        .status(404)
        .json({ success: false, error: "Review not found" });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch review" });
  }
});

// POST /api/reviews
router.post("/", (req, res) => {
  try {
    const { username, brand_name, title, content, rating, region } = req.body;

    // Validation
    const errors = [];
    if (!username || username.trim().length < 2)
      errors.push("Username must be at least 2 characters");
    if (!brand_name || brand_name.trim().length < 1)
      errors.push("Brand name is required");
    if (!title || title.trim().length < 5)
      errors.push("Title must be at least 5 characters");
    if (!content || content.trim().length < 20)
      errors.push("Review must be at least 20 characters");
    if (!rating || isNaN(rating) || rating < 1 || rating > 5)
      errors.push("Rating must be between 1 and 5");
    if (!region || !VALID_REGIONS.includes(region))
      errors.push("Invalid region");

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // Find or create brand
    let brand = db
      .prepare("SELECT id FROM brands WHERE LOWER(name) = LOWER(?)")
      .get(brand_name.trim());
    if (!brand) {
      const result = db
        .prepare(
          "INSERT INTO brands (name, slug, category) VALUES (?, ?, 'standard')"
        )
        .run(
          brand_name.trim(),
          brand_name.trim().toLowerCase().replace(/\s+/g, "-")
        );
      brand = { id: result.lastInsertRowid };
    }

    const result = db
      .prepare(
        `INSERT INTO reviews (username, brand_id, brand_name, title, content, rating, region)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        username.trim(),
        brand.id,
        brand_name.trim(),
        title.trim(),
        content.trim(),
        parseInt(rating),
        region
      );

    const newReview = db
      .prepare("SELECT * FROM reviews WHERE id = ?")
      .get(result.lastInsertRowid);
    res
      .status(201)
      .json({ success: true, data: newReview, message: "Review posted!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Failed to post review" });
  }
});

// POST /api/reviews/:id/like
router.post("/:id/like", (req, res) => {
  try {
    const reviewId = parseInt(req.params.id);
    const ip =
      req.ip || req.connection.remoteAddress || req.headers["x-forwarded-for"];

    const existing = db
      .prepare(
        "SELECT id FROM review_likes WHERE review_id = ? AND ip_address = ?"
      )
      .get(reviewId, ip);

    if (existing) {
      // Unlike
      db.prepare(
        "DELETE FROM review_likes WHERE review_id = ? AND ip_address = ?"
      ).run(reviewId, ip);
      db.prepare("UPDATE reviews SET likes = MAX(0, likes - 1) WHERE id = ?").run(reviewId);
      const review = db
        .prepare("SELECT likes FROM reviews WHERE id = ?")
        .get(reviewId);
      return res.json({
        success: true,
        liked: false,
        likes: review.likes,
      });
    }

    // Like
    db.prepare(
      "INSERT INTO review_likes (review_id, ip_address) VALUES (?, ?)"
    ).run(reviewId, ip);
    db.prepare("UPDATE reviews SET likes = likes + 1 WHERE id = ?").run(
      reviewId
    );
    const review = db
      .prepare("SELECT likes FROM reviews WHERE id = ?")
      .get(reviewId);
    res.json({ success: true, liked: true, likes: review.likes });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to like review" });
  }
});

module.exports = router;