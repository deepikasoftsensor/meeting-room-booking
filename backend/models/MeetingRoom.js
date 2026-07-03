const mongoose = require('mongoose');

const meetingRoomSchema = new mongoose.Schema({
  companyId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  name:        { type: String, required: true },
  capacity:    { type: Number, required: true },
  location:    { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
  createdBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MeetingRoom', meetingRoomSchema);