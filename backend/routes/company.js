const express = require("express");
const User = require("../models/User");
const Company = require("../models/Company");
const MeetingRoom = require("../models/MeetingRoom");
const Booking = require("../models/Booking");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

// ==================================
// Dashboard Statistics
// ==================================

router.get("/dashboard", async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const today = new Date().toISOString().split("T")[0];

    const [
      totalMembers,
      totalRooms,
      availableRooms,
      todayBookings,
      company,
    ] = await Promise.all([
      User.countDocuments({ companyId }),
      MeetingRoom.countDocuments({ companyId }),
      MeetingRoom.countDocuments({
        companyId,
        isAvailable: true,
      }),
      Booking.countDocuments({
        companyId,
        date: today,
        status: "confirmed",
      }),
      Company.findById(companyId),
    ]);

    res.json({
      company,
      stats: {
        totalMembers,
        totalRooms,
        availableRooms,
        todayBookings,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================
// Get Company
// ==================================

router.get("/", async (req, res) => {
  try {
    const company = await Company.findById(req.user.companyId);

    res.json({
      company,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================
// Members
// ==================================

router.get("/members", async (req, res) => {
  try {
    const members = await User.find({
      companyId: req.user.companyId,
    }).select("-password");

    res.json({
      members,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

// ==================================
// Invite Member
// ==================================

router.post("/invite", authorize("admin"), async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    const existing = await User.findOne({
      email: email.toLowerCase(),
      companyId: req.user.companyId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Member already exists",
      });
    }

    const user = await User.create({
      companyId: req.user.companyId,
      name,
      email: email.toLowerCase(),
      password,
      role: role === "admin" ? "admin" : "member",
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
});

module.exports = router;