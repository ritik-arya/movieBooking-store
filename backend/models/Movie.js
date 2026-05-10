const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    description: { type: String, required: true },
    genre:       [{ type: String, required: true }],
    duration:    { type: Number, required: true },   // minutes
    releaseDate: { type: Date, required: true },
    language:    { type: String, default: 'English' },
    rating:      { type: Number, default: 0, min: 0, max: 10 },
    cast:        [{ name: String, role: String }],
    director:    { type: String, default: '' },
    poster:      { type: String, default: '' },
    trailer:     { type: String, default: '' },
    status:      { type: String, enum: ['now_showing', 'coming_soon', 'ended'], default: 'now_showing' },
    badge:       { type: String, default: '' },
    emoji:       { type: String, default: '🎬' },
    pgRating:    { type: String, enum: ['U', 'UA', 'A', 'S'], default: 'UA' },
  },
  { timestamps: true }
);

movieSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Movie', movieSchema);
