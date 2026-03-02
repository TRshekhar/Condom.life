# condom.life 🌐

> The world's most honest public opinion platform for protection reviews.

A full-stack web application where users can:
- **Write honest reviews** about their favourite condoms with star ratings
- **Filter by region** — All, Asia, America, Africa, Australia, Europe, Russia, India, Middle East, Latin America
- **Browse brands** with community ratings and review counts
- **Like reviews** from other users
- **View global insights** — top brands, region breakdown, platform stats

---

## Tech Stack

| Layer     | Technology                             |
|-----------|----------------------------------------|
| Backend   | Node.js + Express                      |
| Database  | SQLite via `better-sqlite3`            |
| Frontend  | React 18 + React Router v6             |
| Styling   | Tailwind CSS + Custom CSS              |
| Fonts     | Playfair Display + DM Sans (Google)    |

---

## Project Structure

```
condom-life/
├── backend/
│   ├── server.js          # Express app + middleware
│   ├── db.js              # SQLite setup, schema & seeds
│   ├── routes/
│   │   ├── reviews.js     # CRUD for reviews + likes
│   │   ├── brands.js      # Brand listing & stats
│   │   └── stats.js       # Global platform metrics
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.jsx          # Router + layout
│   │   ├── api.js           # Axios API client
│   │   ├── index.css        # Global styles + Tailwind
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── ReviewCard.jsx
│   │   │   ├── RegionFilter.jsx
│   │   │   └── StarRating.jsx
│   │   └── pages/
│   │       ├── Home.jsx       # Review feed with filters
│   │       ├── WriteReview.jsx
│   │       ├── Brands.jsx
│   │       └── Stats.jsx
│   ├── tailwind.config.js
│   └── package.json
└── package.json
```

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- npm v9+

### 1. Install all dependencies

```bash
# From root directory
npm run install:all
```

Or manually:
```bash
cd backend && npm install
cd ../frontend && npm install && npm install --save-dev tailwindcss autoprefixer postcss
```

### 2. Start the backend

```bash
# Terminal 1
cd backend
npm run dev     # uses nodemon for hot reload
# OR
npm start       # production
```

The API starts at **http://localhost:5000**

### 3. Start the frontend

```bash
# Terminal 2
cd frontend
npm start
```

The app opens at **http://localhost:3000**

---

## API Reference

### Reviews

| Method | Endpoint                  | Description                          |
|--------|---------------------------|--------------------------------------|
| GET    | `/api/reviews`            | Get all reviews (filterable)         |
| GET    | `/api/reviews/:id`        | Get single review                    |
| POST   | `/api/reviews`            | Post a new review                    |
| POST   | `/api/reviews/:id/like`   | Toggle like on a review              |

**GET /api/reviews query params:**

| Param    | Values                         | Default   |
|----------|--------------------------------|-----------|
| `region` | All, Asia, America, Europe...  | All       |
| `sort`   | newest, top_rated, most_liked  | newest    |
| `search` | any string                     | —         |
| `brand`  | brand name substring           | —         |
| `page`   | number                         | 1         |
| `limit`  | number (max 50)                | 10        |

**POST /api/reviews body:**
```json
{
  "username": "SafeInSeoul",
  "brand_name": "Okamoto",
  "title": "Barely there — and that's the point",
  "content": "I've tried dozens...",
  "rating": 5,
  "region": "Asia"
}
```

### Brands

| Method | Endpoint                   | Description           |
|--------|----------------------------|-----------------------|
| GET    | `/api/brands`              | All brands with stats |
| GET    | `/api/brands/:slug/stats`  | Single brand details  |

### Stats

| Method | Endpoint     | Description         |
|--------|--------------|---------------------|
| GET    | `/api/stats` | Global platform stats |

---

## Database Schema

```sql
CREATE TABLE brands (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT DEFAULT 'standard',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
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

CREATE TABLE review_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  review_id INTEGER NOT NULL,
  ip_address TEXT NOT NULL,
  UNIQUE(review_id, ip_address),
  FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);
```

---

## Features

- ✅ **Region-based filtering** — filter reviews by geographic region
- ✅ **Sort options** — Newest, Top Rated, Most Liked
- ✅ **Search** — across brand name, title, and content
- ✅ **Star ratings** — interactive 1–5 star input and display
- ✅ **Like system** — IP-based (one like per user per review, toggleable)
- ✅ **Brand directory** — filterable by category with avg. ratings
- ✅ **Global insights** — top brands, region heatmap, platform metrics
- ✅ **Rate limiting** — 200 req/15min global, 10 reviews/hour write
- ✅ **Seeded data** — 8 sample reviews from across the globe
- ✅ **15 pre-seeded brands** — Durex, Trojan, Skyn, Okamoto, and more
- ✅ **Pagination** — 9 reviews per page
- ✅ **Loading skeletons** — smooth UX during data fetching
- ✅ **Mobile responsive** — works on all screen sizes

---

## Environment Variables (Optional)

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
FRONTEND_URL=http://localhost:3000
```

---

## Deployment Notes

- The SQLite database file (`condom_life.db`) is created automatically in the `backend/` folder on first run.
- For production, consider migrating to PostgreSQL or MySQL by swapping `better-sqlite3` for `pg` or `mysql2`.
- Build the frontend with `npm run build` in the `frontend/` folder for static hosting.

---

*Built with ❤️ for a healthier, more open world.*