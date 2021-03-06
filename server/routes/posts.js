const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs");
const path = require("path");
const { verifyToken } = require("../middlewares/verifyToken");

router.use(verifyToken);

// create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get timeline posts
router.get("/timeline/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const userPosts = await Post.find({ userId: user._id }).populate(
      "userId",
      "firstName lastName profilePicture"
    );
    const friendsPosts = await Promise.all(
      user.friends.map((friend) => {
        return Post.find({ userId: friend }).populate(
          "userId",
          "firstName lastName profilePicture"
        );
      })
    );
    res.status(200).json(userPosts.concat(...friendsPosts));
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get profile posts
router.get("/profile/:id", async (req, res) => {
  try {
    const profilePosts = await Post.find({ userId: req.params.id }).populate(
      "userId",
      "firstName lastName profilePicture"
    );
    res.json(profilePosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId.equals(req.body.userId)) {
      await post.updateOne({ $set: req.body });
      res.status(200).json({ message: "post has been updated" });
    } else {
      res
        .status(403)
        .json({ message: "You don't have right to update this post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// delete a post
router.delete("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id);
  const image = post.img;

  try {
    if (post.userId.equals(req.body.userId)) {
      if (image) {
        fs.unlink(path.join("public/images", image), (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log("Deleted file");
          }
        });
      }
      await post.deleteOne();
      res.status(200).json({ message: "post has been deleted" });
    } else {
      res
        .status(403)
        .json({ message: "You don't have right to delete this post" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// like /dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.body.userId)) {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json({ message: "The post has been disliked" });
    } else {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json({ message: "The post has been liked" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
