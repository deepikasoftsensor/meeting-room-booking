const express = require('express');
const MeetingRoom = require('../models/MeetingRoom');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();
router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const rooms = await MeetingRoom.find({ companyId: req.user.companyId });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authorize('admin'), async (req, res) => {
  try {
    const { name, capacity, location } = req.body;
    if (!name || !capacity || !location)
      return res.status(400).json({ message: 'name, capacity and location are required' });
    const room = await MeetingRoom.create({
      companyId: req.user.companyId,
      name, capacity, location,
      createdBy: req.user.id
    });
    req.io.to(req.user.companyId).emit('room:create', { room });
    res.status(201).json({ room });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authorize('admin'), async (req, res) => {
  try {
    const room = await MeetingRoom.findOneAndUpdate(
      { _id: req.params.id, companyId: req.user.companyId },
      req.body,
      { new: true }
    );
    if (!room) return res.status(404).json({ message: 'Room not found' });
    req.io.to(req.user.companyId).emit('room:update', { room });
    res.json({ room });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authorize('admin'), async (req, res) => {
  try {
    const room = await MeetingRoom.findOneAndDelete({
      _id: req.params.id, companyId: req.user.companyId
    });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    req.io.to(req.user.companyId).emit('room:delete', { roomId: room._id });
    res.json({ message: 'Room deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
