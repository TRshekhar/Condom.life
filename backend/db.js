const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "condom_life.db");
const db = new Database(DB_PATH);

// Enable WAL mode for better performance
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

// --- Schema ---
db.exec(`
  CREATE TABLE IF NOT EXISTS brands (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    category TEXT DEFAULT 'standard',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    brand_id INTEGER NOT NULL,
    brand_name TEXT NOT NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
    region TEXT NOT NULL DEFAULT 'Global',
    likes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (brand_id) REFERENCES brands(id)
  );

  CREATE TABLE IF NOT EXISTS review_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL,
    ip_address TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(review_id, ip_address),
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
  );
`);

// Seed popular condom brands
const seedBrands = db.prepare(
  "INSERT OR IGNORE INTO brands (name, slug, category) VALUES (?, ?, ?)"
);

const brands = [
  ["Durex", "durex", "premium"],
  ["Trojan", "trojan", "standard"],
  ["Skyn", "skyn", "latex-free"],
  ["Lifestyles", "lifestyles", "standard"],
  ["ONE Condoms", "one-condoms", "premium"],
  ["Kimono", "kimono", "ultra-thin"],
  ["Okamoto", "okamoto", "ultra-thin"],
  ["Manix", "manix", "standard"],
  ["Pasante", "pasante", "standard"],
  ["Four Seasons", "four-seasons", "standard"],
  ["Moods", "moods", "standard"],
  ["Kohinoor", "kohinoor", "standard"],
  ["Carefree", "carefree", "standard"],
  ["Love Plus", "love-plus", "ultra-thin"],
  ["Jissbon", "jissbon", "standard"],
];

brands.forEach(([name, slug, category]) =>
  seedBrands.run(name, slug, category)
);

// Seed sample reviews
const seedReviews = [
  {
    username: "SafeInSeoul",
    brand_name: "Okamoto",
    brand_id: 7,
    title: "Barely there — and that's the whole point",
    content:
      "I've tried dozens of brands over the years and Okamoto consistently wins on feel. The 003 Platinum series is genuinely remarkable. My partner and I both forget we're using one, which honestly is the highest compliment I can give. Highly recommend for couples who prioritize sensation.",
    rating: 5,
    region: "Asia",
  },
  {
    username: "MumbaiBoy88",
    brand_name: "Kohinoor",
    brand_id: 12,
    title: "Reliable and affordable — a classic for a reason",
    content:
      "Kohinoor is what my older brother introduced me to when I first became sexually active. Years later, I still keep coming back. It's not the thinnest or fanciest, but it's consistently reliable, widely available in local pharmacies, and priced for real people. The Xtra Time variant is a bonus.",
    rating: 4,
    region: "India",
  },
  {
    username: "BerlinRoamer",
    brand_name: "Skyn",
    brand_id: 3,
    title: "A revelation for latex-sensitive people",
    content:
      "Developed a latex sensitivity in my late 20s and was dreading the switch. Skyn Original completely changed the game. The polyisoprene material feels warmer and more natural than latex ever did. My only gripe is the price point, but for what it offers to those of us with sensitivities, it is absolutely worth every euro.",
    rating: 5,
    region: "Europe",
  },
  {
    username: "ChicagoNights",
    brand_name: "Trojan",
    brand_id: 2,
    title: "The American classic — dependable but not exciting",
    content:
      "Trojan is the go-to for a reason: it's everywhere, it's trusted, and it works. The ENZ has been the standard for decades. That said, I've moved toward thinner options lately. Still keep a box in the drawer for emergencies. If you want no-nonsense reliability, Trojan delivers every single time.",
    rating: 4,
    region: "America",
  },
  {
    username: "NairobiVibes",
    brand_name: "Durex",
    brand_id: 1,
    title: "Durex Invisible — finally something that doesn't feel industrial",
    content:
      "In Nairobi, Durex has become the aspirational choice, and after trying the Invisible range I understand why. The feel is genuinely different — less clinical, more intimate. Distribution has improved significantly in East Africa over the past few years. My only wish is for better local pricing.",
    rating: 4,
    region: "Africa",
  },
  {
    username: "SydneySurfer",
    brand_name: "Four Seasons",
    brand_id: 10,
    title: "Proudly Australian and genuinely good",
    content:
      "Four Seasons doesn't get enough credit internationally. The Naked Ultra Thin series rivals anything coming out of Japan at a fraction of the import cost. Easy to find at Coles and Woolies, which is a massive plus. Supports local manufacturing too. My mates and I all swear by it.",
    rating: 5,
    region: "Australia",
  },
  {
    username: "TokyoDrifter",
    brand_name: "Kimono", 
    brand_id: 6,
    title: "Precision engineering in a very small package",
    content:
      "The Japanese approach to everything is meticulous and Kimono is no exception. MicroThin has been my daily driver for two years. The quality control is exceptional — I've never had a failure. The fit is also notably more anatomically considerate than most Western brands. Worth importing if your country doesn't carry it.",
    rating: 5,
    region: "Asia",
  },
  {
    username: "ParisianHeart",
    brand_name: "Manix",
    brand_id: 8,
    title: "L'amour français — actually worth the hype",
    content:
      "Manix is the de facto choice in French pharmacies and once you try the Skyn version, you won't question why. The texture on the Crystal variant adds something without being gimmicky. Very French in the best way: thoughtfully designed, not trying too hard. Would love to see wider international distribution.",
    rating: 4,
    region: "Europe",
  },
];

const insertReview = db.prepare(`
  INSERT OR IGNORE INTO reviews (username, brand_id, brand_name, title, content, rating, region, likes)
  VALUES (@username, @brand_id, @brand_name, @title, @content, @rating, @region, @likes)
`);

const countReviews = db.prepare("SELECT COUNT(*) as count FROM reviews").get();
if (countReviews.count === 0) {
  seedReviews.forEach((review) => {
    insertReview.run({ ...review, likes: Math.floor(Math.random() * 40) + 1 });
  });
}

module.exports = db;