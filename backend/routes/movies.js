const express = require('express');
const router  = express.Router();
const Movie   = require('../models/Movie');
const { protect, adminOnly } = require('../middleware/auth');

// GET /api/movies
router.get('/', async (req, res) => {
  try {
    const { genre, status = 'now_showing', search, page = 1, limit = 20 } = req.query;
    const query = { status };
    if (genre)  query.genre  = { $in: [genre] };
    if (search) query.$text  = { $search: search };

    const [movies, total] = await Promise.all([
      Movie.find(query).skip((page - 1) * limit).limit(+limit).sort({ createdAt: -1 }),
      Movie.countDocuments(query),
    ]);
    res.json({ movies, total, page: +page, pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/movies/:id
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/movies  (admin)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// PUT /api/movies/:id  (admin)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (err) { res.status(400).json({ message: err.message }); }
});

// DELETE /api/movies/:id  (admin)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json({ message: 'Movie deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
