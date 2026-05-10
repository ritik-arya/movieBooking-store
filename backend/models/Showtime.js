const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatId:   { type: String, required: true },
  row:      { type: String, required: true },
  number:   { type: Number, required: true },
  type:     { type: String, enum: ['standard', 'premium'], default: 'standard' },
  price:    { type: Number, required: true },
  status:   { type: String, enum: ['available', 'booked', 'reserved'], default: 'available' },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
});

const showtimeSchema = new mongoose.Schema(
  {
    movie:          { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    theater:        { type: String, default: 'CineMax Multiplex - Screen 1' },
    date:           { type: Date, required: true },
    startTime:      { type: String, required: true },
    format:         { type: String, enum: ['2D', '3D', 'IMAX', '4DX'], default: '2D' },
    language:       { type: String, default: 'English' },
    seats:          [seatSchema],
    totalSeats:     { type: Number, default: 80 },
    availableSeats: { type: Number, default: 80 },
    isActive:       { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Auto-generate seats on first save
showtimeSchema.pre('save', function (next) {
  if (this.isNew && this.seats.length === 0) {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const premiumRows = ['G', 'H'];
    rows.forEach((row) => {
      for (let n = 1; n <= 10; n++) {
        const isPremium = premiumRows.includes(row);
        this.seats.push({
          seatId: `${row}${n}`,
          row,
          number: n,
          type: isPremium ? 'premium' : 'standard',
          price: isPremium ? 380 : 220,
          status: 'available',
        });
      }
    });
    this.totalSeats = 80;
    this.availableSeats = 80;
  }
  next();
});

module.exports = mongoose.model('Showtime', showtimeSchema);
