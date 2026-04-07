-- Enable settings
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- =========================
-- TABLES
-- =========================

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

-- =========================
-- SEED DATA: BRANDS
-- =========================

INSERT OR IGNORE INTO brands (name, slug, category) VALUES
('Durex', 'durex', 'premium'),
('Trojan', 'trojan', 'standard'),
('Skyn', 'skyn', 'latex-free'),
('Lifestyles', 'lifestyles', 'standard'),
('ONE Condoms', 'one-condoms', 'premium'),
('Kimono', 'kimono', 'ultra-thin'),
('Okamoto', 'okamoto', 'ultra-thin'),
('Manix', 'manix', 'standard'),
('Pasante', 'pasante', 'standard'),
('Four Seasons', 'four-seasons', 'standard'),
('Moods', 'moods', 'standard'),
('Kohinoor', 'kohinoor', 'standard'),
('Carefree', 'carefree', 'standard'),
('Love Plus', 'love-plus', 'ultra-thin'),
('Jissbon', 'jissbon', 'standard');

-- =========================
-- SEED DATA: REVIEWS
-- =========================

INSERT OR IGNORE INTO reviews 
(username, brand_id, brand_name, title, content, rating, region, likes)
VALUES
('SafeInSeoul', 7, 'Okamoto',
 'Barely there — and that''s the whole point',
 'I''ve tried dozens of brands over the years and Okamoto consistently wins on feel. The 003 Platinum series is genuinely remarkable. My partner and I both forget we''re using one.',
 5, 'Asia', 25),

('MumbaiBoy88', 12, 'Kohinoor',
 'Reliable and affordable — a classic for a reason',
 'Kohinoor is reliable, widely available, and affordable. Not the thinnest but very dependable.',
 4, 'India', 18),

('BerlinRoamer', 3, 'Skyn',
 'A revelation for latex-sensitive people',
 'Skyn Original changed the game for me. The material feels more natural than latex.',
 5, 'Europe', 32),

('ChicagoNights', 2, 'Trojan',
 'Dependable but not exciting',
 'Trojan is trusted and widely available. Not the thinnest but always reliable.',
 4, 'America', 21),

('NairobiVibes', 1, 'Durex',
 'Durex Invisible — improved experience',
 'The Invisible range feels more natural and less clinical. Good improvement.',
 4, 'Africa', 19),

('SydneySurfer', 10, 'Four Seasons',
 'Underrated but high quality',
 'Four Seasons offers great quality at a reasonable price. Easily available locally.',
 5, 'Australia', 27),

('TokyoDrifter', 6, 'Kimono',
 'Precision engineering',
 'Kimono MicroThin offers excellent quality and reliability. Very well designed.',
 5, 'Asia', 34),

('ParisianHeart', 8, 'Manix',
 'Stylish and effective',
 'Manix products are thoughtfully designed and feel premium.',
 4, 'Europe', 22);