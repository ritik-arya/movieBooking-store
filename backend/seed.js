const mongoose = require('mongoose');
require('dotenv').config();
const Movie    = require('./models/Movie');
const Showtime = require('./models/Showtime');
const User     = require('./models/User');
const { dark } = require('./Assets/Dark');

const MOVIES = [
  {
    
    title: "Dune: Awakening",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["sci-fi", "adventure"],
    duration: 166,
    rating: 8.7,
    badge: "hot",
    releaseDate: new Date("2024-03-01"),
    director: "Denis Villeneuve",
    pgRating: "UA",
    status: "now_showing",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    cast: [
      { name: "Timothée Chalamet", role: "Paul Atreides" },
      { name: "Zendaya", role: "Chani" }
    ]
  },
  {
    
    title: "The Dark Horizon",
    poster: dark,
    genre: ["action", "thriller"],
    duration: 148,
    rating: 8.2,
    badge: "new",
    releaseDate: new Date("2024-04-15"),
    director: "Christopher Nolan",
    pgRating: "UA",
    status: "now_showing",
    description: "A new villain rises from the shadows of Gotham.",
    cast: [
      { name: "Christian Bale", role: "Bruce Wayne" },
      { name: "Tom Hardy", role: "Villain" }
    ]
  },
  {
    
    title: "Stellar Drift",
    poster: "/cinemax-aap/backend/Assets/dune.jpeg",
    genre: ["sci-fi", "drama"],
    duration: 132,
    rating: 7.9,
    badge: "new",
    releaseDate: new Date("2024-02-20"),
    director: "Ridley Scott",
    pgRating: "U",
    status: "now_showing",
    description: "Explorers travel through a wormhole to save humanity.",
    cast: [
      { name: "Matthew McConaughey", role: "Cooper" },
      { name: "Anne Hathaway", role: "Brand" }
    ]
  },
  {
    
    title: "The Verdict",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["drama"],
    duration: 125,
    rating: 7.6,
    badge: "",
    releaseDate: new Date("2024-01-10"),
    director: "Steven Spielberg",
    pgRating: "U",
    status: "now_showing",
    description: "A judge faces moral dilemmas in a landmark case.",
    cast: [
      { name: "Meryl Streep", role: "Judge" },
      { name: "Cate Blanchett", role: "Prosecutor" }
    ]
  },
  {
    
    title: "Midnight Chase",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["thriller", "action"],
    duration: 118,
    rating: 7.8,
    badge: "hot",
    releaseDate: new Date("2024-03-28"),
    director: "J.J. Abrams",
    pgRating: "UA",
    status: "now_showing",
    description: "A rogue agent races to stop global disaster.",
    cast: [
      { name: "Tom Cruise", role: "Ethan" },
      { name: "Henry Cavill", role: "Villain" }
    ]
  },
  {
    
    title: "Laugh Riot",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["comedy"],
    duration: 105,
    rating: 7.3,
    badge: "",
    releaseDate: new Date("2024-04-01"),
    director: "Seth Rogen",
    pgRating: "UA",
    status: "now_showing",
    description: "Friends get into hilarious chaos on a road trip.",
    cast: [
      { name: "Ryan Reynolds", role: "Jake" },
      { name: "Kevin Hart", role: "Mike" }
    ]
  },
  {
    
    title: "Neon Requiem",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["drama", "music"],
    duration: 140,
    rating: 8.1,
    badge: "new",
    releaseDate: new Date("2024-05-10"),
    director: "Darren Aronofsky",
    pgRating: "A",
    status: "now_showing",
    description: "A musician battles demons to find redemption.",
    cast: [
      { name: "Joaquin Phoenix", role: "Marcus" },
      { name: "Lady Gaga", role: "Luna" }
    ]
  },
  {
    
    title: "Iron Frontier",
    poster: "https://images.unsplash.com/photo-1710267224163-0ee7e0d7a7ce?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    genre: ["action", "sci-fi"],
    duration: 155,
    rating: 7.4,
    badge: "soon",
    releaseDate: new Date("2024-06-20"),
    director: "James Cameron",
    pgRating: "UA",
    status: "coming_soon",
    description: "Heroes unite to stop a cosmic threat.",
    cast: [
      { name: "Chris Hemsworth", role: "Thor" },
      { name: "Scarlett Johansson", role: "Black Widow" }
    ]
  }
];


const TIMES = ['10:30 AM', '1:15 PM', '4:00 PM', '7:30 PM', '10:45 PM'];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cinemax');
  console.log('✅ Connected to MongoDB');

  await Movie.deleteMany({});
  await Showtime.deleteMany({});
  await User.deleteMany({});

  // Users
  await User.create([
    { name: 'Admin',     email: 'admin@cinemax.com', password: 'admin123', role: 'admin' },
    { name: 'Demo User', email: 'demo@cinemax.com',  password: 'demo1234', role: 'user'  },
  ]);
  console.log('✅ Users seeded');

  // Movies
  const movies = await Movie.insertMany(MOVIES);
  console.log(`✅ ${movies.length} movies seeded`);

  // Showtimes – next 7 days × every movie × every timeslot
  const today = new Date();
  const showtimeData = [];
  movies.forEach((movie) => {
    for (let d = 0; d < 7; d++) {
      const date = new Date(today);
      date.setDate(today.getDate() + d);
      TIMES.forEach((time) => {
        showtimeData.push({ movie: movie._id, date, startTime: time });
      });
    }
  });
  await Showtime.insertMany(showtimeData);
  console.log(`✅ ${showtimeData.length} showtimes seeded`);

  console.log('\n🎬 Seed complete!');
  console.log('   Admin →  admin@cinemax.com  /  admin123');
  console.log('   User  →  demo@cinemax.com   /  demo1234');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
