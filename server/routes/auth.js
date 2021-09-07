if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const JWT_SECRET = process.env.JWT;

const User = require("../models/User");

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
    let user = await User.findOne({ email: req.body.email }).populate(
      "friendRequests"
    );
    console.log(user);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }

    const validatePassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validatePassword) {
      return res.status(400).json({ message: "wrong password" });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET);

    res
      .cookie("token", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      })
      .json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
