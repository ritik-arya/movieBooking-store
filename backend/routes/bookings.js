const express  = require('express');
const router   = express.Router();
const mongoose = require('mongoose');
const Booking  = require('../models/Booking');
const Showtime = require('../models/Showtime');
const { protect, adminOnly } = require('../middleware/auth');

// POST /api/bookings  – atomic seat reservation
router.post('/', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { showtimeId, seatIds, paymentMethod } = req.body;
    if (!showtimeId || !seatIds?.length)
      return res.status(400).json({ message: 'showtimeId and seatIds required' });

    const showtime = await Showtime.findById(showtimeId).session(session);
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });

    const reserved = [];
    for (const sid of seatIds) {
      const seat = showtime.seats.find((s) => s.seatId === sid);
      if (!seat)               { await session.abortTransaction(); return res.status(400).json({ message: `Seat ${sid} not found` }); }
      if (seat.status !== 'available') { await session.abortTransaction(); return res.status(409).json({ message: `Seat ${sid} already taken` }); }
      reserved.push(seat);
    }

    reserved.forEach((s) => { s.status = 'booked'; s.bookedBy = req.user._id; });
    showtime.availableSeats -= seatIds.length;
    await showtime.save({ session });

    const subtotal = reserved.reduce((sum, s) => sum + s.price, 0);
    const [booking] = await Booking.create([{
      user: req.user._id, showtime: showtimeId, movie: showtime.movie,
      seats: reserved.map((s) => ({ seatId: s.seatId, type: s.type, price: s.price })),
      totalAmount: subtotal + 30,
      convenienceFee: 30,
      paymentMethod: paymentMethod || 'card',
      paymentStatus: 'paid',
      status: 'confirmed',
    }], { session });

    await session.commitTransaction();

    const populated = await Booking.findById(booking._id)
      .populate('movie',    'title emoji duration')
      .populate('showtime', 'date startTime theater');
    res.status(201).json(populated);
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// GET /api/bookings/my
router.get('/my', protect, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie',    'title emoji genre duration')
      .populate('showtime', 'date startTime theater format')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/bookings/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
      .populate('movie').populate('showtime');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// POST /api/bookings/:id/cancel
router.post('/:id/cancel', protect, async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id }).session(session);
    if (!booking)                        return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'confirmed')  return res.status(400).json({ message: 'Cannot cancel this booking' });

    const showtime = await Showtime.findById(booking.showtime).session(session);
    if (showtime) {
      booking.seats.forEach(({ seatId }) => {
        const s = showtime.seats.find((x) => x.seatId === seatId);
        if (s) { s.status = 'available'; s.bookedBy = null; }
      });
      showtime.availableSeats += booking.seats.length;
      await showtime.save({ session });
    }

    booking.status        = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save({ session });
    await session.commitTransaction();
    res.json({ message: 'Booking cancelled, refund initiated', booking });
  } catch (err) {
    await session.abortTransaction();
    res.status(500).json({ message: err.message });
  } finally {
    session.endSession();
  }
});

// GET /api/bookings  (admin – all bookings)
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const [bookings, total] = await Promise.all([
      Booking.find()
        .populate('user',  'name email')
        .populate('movie', 'title')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit).limit(+limit),
      Booking.countDocuments(),
    ]);
    res.json({ bookings, total });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;
