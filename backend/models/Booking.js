const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  roomId:    { type: mongoose.Schema.Types.ObjectId, ref: 'MeetingRoom', required: true },
  bookedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date:      { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:   { type: String, required: true },
  purpose:   { type: String, required: true },
  status:    { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);