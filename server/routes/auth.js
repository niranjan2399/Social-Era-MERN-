const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// register
router.post("/register", async (req, res) => {
  try {
    //   hashing passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //   creating new user
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: hashedPassword,
      email: req.body.email,
      gender: req.body.gender,
    });

    await newUser.save();
    res.send("user created");
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
});

// login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json({ message: "user not found" });

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validatePassword && res.status(400).json({ message: "wrong password" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
