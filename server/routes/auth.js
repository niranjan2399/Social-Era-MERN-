if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const JWT_PRIVATE_KEY = fs.readFileSync(path.resolve("jwtRSA256-private.pem"));

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

    const user = await newUser.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_PRIVATE_KEY,
      {
        algorithm: "RS256",
        expiresIn: "1m",
      }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      maxAge: 60 * 1000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 432000000,
      httpOnly: true,
    });

    const { password, ...data } = user._doc;

    res.json(data);
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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_PRIVATE_KEY,
      {
        algorithm: "RS256",
        expiresIn: "1m",
      }
    );

    const refreshToken = jwt.sign({ id: user._id }, JWT_PRIVATE_KEY, {
      algorithm: "RS256",
      expiresIn: "5d",
    });

    res.cookie("token", token, {
      maxAge: 60 * 1000,
      httpOnly: true,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 432000000,
      httpOnly: true,
    });

    // res.json(user);
    const { password, ...data } = user._doc;
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/logout/:id", (req, res) => {
  try {
    res.cookie("token", "", -1);
    res.cookie("refreshToken", "", -1);
    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
