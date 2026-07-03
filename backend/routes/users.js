const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.put("/me", async (req, res) => {
  try {
    const { name, password } = req.body;

    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      message: "Profile updated",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;