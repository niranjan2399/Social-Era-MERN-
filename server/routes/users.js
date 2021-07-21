const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json({ message: err });
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json({ message: "Profile Updated" });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can update only on your account" });
  }
});

// delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Account has been deleted" });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  } else {
    return res
      .status(403)
      .json({ message: "You can delete only your account" });
  }
});

// get user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

// follow user
router.put("/:id/follow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (!currentUser.following.includes(req.params.id)) {
        await user.updateOne({ $push: { followers: req.body.userId } });
        await currentUser.updateOne({ $push: { following: req.params.id } });
        res.status(200).json({ message: "User followed" });
      } else {
        res.status(403).json({ message: "You already follow this user" });
      }
    } catch {}
  } else {
    res.status(500).json({ message: "You cannot follow Yourself" });
  }
});

// unfollow user
router.put("/:id/unfollow", async (req, res) => {
  if (req.params.id !== req.body.userId) {
    try {
      const user = await User.findById(req.params.id);
      const currentUser = await User.findById(req.body.userId);
      if (currentUser.following.includes(req.params.id)) {
        await user.updateOne({ $pull: { followers: req.body.userId } });
        await currentUser.updateOne({ $pull: { following: req.params.id } });
        res.status(200).json({ message: "User unfollowed" });
      } else {
        res.status(403).json({ message: "You don't follow this user" });
      }
    } catch {}
  } else {
    res.status(500).json({ message: "You cannot unfollow Yourself" });
  }
});

// get friends
router.get("/friends/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const followings = await Promise.all(
      user.following.map((following) => {
        return User.findById(following);
      })
    );
    const data = [];
    followings.map((following) => {
      const { _id, firstName, profilePicture } = following;
      data.push({ _id, firstName, profilePicture });
    });
    res.json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
