const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { verifyToken } = require("../middlewares/verifyToken");

router.use(verifyToken);

// controllers
const {
  addBookmark,
  removeBookmark,
  getBookmarks,
  suggestFriends,
  sendFriendRequest,
  removeFriendRequest,
  addFriend,
  removeFriend,
} = require("../controllers/user");

// update user details
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
    res.status(500).json({ message: err });
  }
});

// get friends
router.get("/friends/:id", async (req, res) => {
  try {
    const { friends } = await User.findById(req.params.id)
      .select("friends")
      .populate("friends");

    const data = [];
    friends.map((friend) => {
      const { _id, firstName, lastName, profilePicture } = friend;
      data.push({ _id, firstName, profilePicture, lastName });
    });

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// handle friend / unfriend
router.put("/send-friend-request/:id", sendFriendRequest);
router.put("/remove-friend-request/:id", removeFriendRequest);
router.put("/add-friend/:id", addFriend);
router.put("/remove-friend/:id", removeFriend);

// handle bookmarks
router.get("/bookmarks/:id", getBookmarks);
router.put("/add-bookmark/:id", addBookmark);
router.put("/remove-bookmark/:id", removeBookmark);

// get all users
router.get("/suggestions/:id", suggestFriends);

module.exports = router;
