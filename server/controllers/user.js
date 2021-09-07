const User = require("../models/User");

exports.sendFriendRequest = async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  try {
    const friend = await User.findOneAndUpdate(
      { _id: friendId },
      {
        $addToSet: { friendRequests: userId },
      }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.removeFriendRequest = async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  try {
    const friend = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { friendRequests: friendId },
      }
    );

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.addFriend = async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      $addToSet: { friends: friendId },
    });
    const friend = await User.findByIdAndUpdate(friendId, {
      $addToSet: { friends: userId },
    });
    res.json({ ok: true, friend });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.removeFriend = async (req, res) => {
  const { userId } = req.body;
  const friendId = req.params.id;

  try {
    const user = await User.findByIdAndUpdate(userId, {
      $pull: { friends: friendId },
    });
    const friend = await User.findByIdAndUpdate(friendId, {
      $pull: { friends: userId },
    });

    res.json({ ok: true, friend });
  } catch (err) {
    res.status(400).json(err);
    console.log(err);
  }
};

exports.addBookmark = async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $addToSet: {
        bookmarks: postId,
      },
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.removeBookmark = async (req, res) => {
  const { userId } = req.body;
  const postId = req.params.id;

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, {
      $pull: {
        bookmarks: postId,
      },
    });

    res.json({ ok: true });
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.suggestFriends = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });

    const friends = await User.find({
      _id: { $nin: [req.params.id, ...user.friends] },
    })
      .limit(5)
      .select(
        "firstName lastName profilePicture email city gender friendRequests"
      );

    res.json(friends);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.getBookmarks = async (req, res) => {
  try {
    const { bookmarks } = await User.findOne({ _id: req.params.id }).populate(
      "bookmarks"
    );
    res.json(bookmarks);
  } catch (err) {
    res.status(400).json(err);
  }
};
