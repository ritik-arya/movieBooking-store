# 🎬 CineMax - Movie Ticket Booking System (MERN)

## Quick Start

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (local or MongoDB Atlas)

---

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI
npm run seed      # Seeds movies, showtimes, admin & demo user
npm run dev       # Starts backend on http://localhost:5000
```

### 3. Frontend Setup (new terminal)
```bash
cd frontend
npm install
npm start         # Starts React app on http://localhost:3000
```

---

## Demo Credentials (after seeding)
| Role  | Email                | Password  |
|-------|----------------------|-----------|
| Admin | admin@cinemax.com    | admin123  |
| User  | demo@cinemax.com     | demo1234  |

---

## Project Structure
```
cinemax-app/
├── backend/
│   ├── models/         # Mongoose schemas
│   ├── routes/         # Express route handlers
│   ├── middleware/     # JWT auth middleware
│   ├── seed.js         # Database seeder
│   ├── server.js       # Express entry point
│   └── .env.example
└── frontend/
    ├── public/
    └── src/
        ├── components/ # Reusable UI components
        ├── pages/      # Route pages
        ├── context/    # React context (Auth)
        └── utils/      # API helper
```

## Features
- Browse movies with genre filters & search
- Interactive seat map (Standard + Premium seats)
- Real-time seat availability
- JWT-based authentication
- Booking history
- Cancellation with seat release
- Admin-protected routes
