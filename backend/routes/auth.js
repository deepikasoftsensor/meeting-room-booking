const express = require('express');
const jwt = require('jsonwebtoken');
const Company = require('../models/Company');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

function signToken(user) {
  return jwt.sign(
    { id: user._id, companyId: user.companyId, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
}

router.post('/signup/company', async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;
    if (!companyName || !name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const company = await Company.create({ name: companyName });
    const user = await User.create({ companyId: company._id, name, email, password, role: 'admin' });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id, name, email, role: 'admin',
        companyId: company._id,
        company: { id: company._id, name: company.name, inviteCode: company.inviteCode }
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/signup/join', async (req, res) => {
  try {
    const { inviteCode, name, email, password } = req.body;
    if (!inviteCode || !name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });
    const company = await Company.findOne({ inviteCode: inviteCode.toUpperCase() });
    if (!company) return res.status(404).json({ message: 'Invalid invite code' });
    const user = await User.create({ companyId: company._id, name, email, password, role: 'member' });
    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user._id, name, email, role: 'member',
        companyId: company._id,
        company: { id: company._id, name: company.name }
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    // Find user by email across all companies
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ message: 'Invalid email or password' });

    const company = await Company.findById(user.companyId);
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, companyId: user.companyId,
        company: {
          id: company._id, name: company.name,
          inviteCode: user.role === 'admin' ? company.inviteCode : undefined
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const company = await Company.findById(req.user.companyId);
    res.json({
      user: {
        id: user._id, name: user.name, email: user.email,
        role: user.role, companyId: user.companyId,
        company: {
          id: company._id, name: company.name,
          inviteCode: user.role === 'admin' ? company.inviteCode : undefined
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
