const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId:      { type: String, unique: true },
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    showtime:       { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
    movie:          { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
    seats: [{
      seatId: String,
      type:   { type: String, enum: ['standard', 'premium'] },
      price:  Number,
    }],
    totalAmount:    { type: Number, required: true },
    convenienceFee: { type: Number, default: 30 },
    paymentMethod:  { type: String, enum: ['card', 'upi', 'wallet', 'netbanking'], default: 'card' },
    paymentStatus:  { type: String, enum: ['pending', 'paid', 'refunded', 'failed'], default: 'pending' },
    status:         { type: String, enum: ['confirmed', 'cancelled', 'expired'], default: 'confirmed' },
  },
  { timestamps: true }
);

bookingSchema.pre('save', function (next) {
  if (!this.bookingId) {
    const ts  = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).substring(2, 5).toUpperCase();
    this.bookingId = `BK${ts}${rnd}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
