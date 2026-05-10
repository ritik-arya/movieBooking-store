const express  = require('express');
const router   = express.Router();
const Showtime = require('../models/Showtime');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/showtimes?movieId=&date=
router.get('/', async (req, res) => {
  try {
    const { movieId, date } = req.query;
    const query = { isActive: true };
    if (movieId) query.movie = movieId;
    if (date) {
      const s = new Date(date); s.setHours(0,0,0,0);
      const e = new Date(date); e.setHours(23,59,59,999);
      query.date = { $gte: s, $lte: e };
    }
    const showtimes = await Showtime.find(query)
      .populate('movie', 'title duration emoji')
      .sort({ date: 1, startTime: 1 });
    res.json(showtimes);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/showtimes/:id  (full seat map)
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/showtimes  (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const showtime = await Showtime.create(req.body);
    res.status(201).json(showtime);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
