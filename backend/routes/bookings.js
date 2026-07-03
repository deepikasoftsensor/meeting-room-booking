const express = require('express');
const Booking = require('../models/Booking');
const MeetingRoom = require('../models/MeetingRoom');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');
const { sendBookingConfirmation, sendCancellationEmail } = require('../utils/email');

const router = express.Router();
router.use(authenticate);

function toMins(t) { const [h, m] = t.split(':').map(Number); return h * 60 + m; }
function overlaps(s1, e1, s2, e2) { return toMins(s1) < toMins(e2) && toMins(s2) < toMins(e1); }

router.get('/', async (req, res) => {
  try {
    const filter = { companyId: req.user.companyId };
    if (req.user.role !== 'admin') filter.bookedBy = req.user.id;
    const bookings = await Booking.find(filter)
      .populate('roomId', 'name location capacity')
      .populate('bookedBy', 'name email')
      .sort({ date: -1, startTime: 1 });
    res.json({ bookings });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', async (req, res) => {
  try {
    const { roomId, date, startTime, endTime, purpose } = req.body;
    if (!roomId || !date || !startTime || !endTime || !purpose)
      return res.status(400).json({ message: 'All fields are required' });
    if (toMins(endTime) <= toMins(startTime))
      return res.status(400).json({ message: 'End time must be after start time' });

    // Past booking check
    const bookingEnd = new Date(`${date}T${endTime}`);
    if (bookingEnd < new Date())
      return res.status(400).json({ message: 'Cannot book a slot in the past' });

    const room = await MeetingRoom.findOne({ _id: roomId, companyId: req.user.companyId });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    if (!room.isAvailable) return res.status(400).json({ message: 'Room is not available' });

    const existing = await Booking.find({ roomId, date, status: 'confirmed' });
    if (existing.some(b => overlaps(startTime, endTime, b.startTime, b.endTime)))
      return res.status(409).json({ message: 'Room already booked for this time slot' });

    let booking = await Booking.create({
      companyId: req.user.companyId, roomId,
      bookedBy: req.user.id, date, startTime, endTime, purpose
    });
    booking = await booking.populate([
      { path: 'roomId', select: 'name location capacity' },
      { path: 'bookedBy', select: 'name email' }
    ]);

    // Send email confirmation
    const booker = await User.findById(req.user.id);
    sendBookingConfirmation({
      to: booker.email,
      name: booker.name,
      roomName: room.name,
      date, startTime, endTime, purpose
    });

    req.io.to(req.user.companyId).emit('booking:create', { booking });
    res.status(201).json({ booking });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.bookedBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Cannot cancel others bookings' });
    if (booking.status === 'cancelled') return res.status(400).json({ message: 'Already cancelled' });

    // Past booking check
    const bookingEnd = new Date(`${booking.date}T${booking.endTime}`);
    if (bookingEnd < new Date())
      return res.status(400).json({ message: 'Cannot modify past bookings' });

    booking.status = 'cancelled';
    await booking.save();

    const populated = await booking.populate([
      { path: 'roomId', select: 'name location capacity' },
      { path: 'bookedBy', select: 'name email' }
    ]);

    // Send cancellation email
    const booker = await User.findById(booking.bookedBy);
    if (booker) {
      sendCancellationEmail({
        to: booker.email,
        name: booker.name,
        roomName: populated.roomId?.name,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime
      });
    }

    req.io.to(req.user.companyId).emit('booking:cancel', { bookingId: booking._id });
    res.json({ booking: populated });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, companyId: req.user.companyId });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.bookedBy.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not allowed' });
    const bookingEnd = new Date(`${booking.date}T${booking.endTime}`);
    if (bookingEnd < new Date()) return res.status(400).json({ message: 'Cannot modify past bookings' });
    if (req.body.purpose) booking.purpose = req.body.purpose;
    await booking.save();
    req.io.to(req.user.companyId).emit('booking:update', { booking });
    res.json({ booking });
  } catch (err) { res.status(400).json({ message: err.message }); }
});

module.exports = router;
