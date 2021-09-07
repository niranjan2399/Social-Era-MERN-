const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      max: 15,
    },
    password: {
      type: String,
      require: true,
      min: 6,
    },
    profilePicture: {
      type: String,
      default: "",
    },
    coverPicture: {
      type: String,
      default: "",
    },
    notifications: {
      type: Number,
      default: 0,
    },
    friends: [
      {
        type: ObjectId,
      },
    ],
    friendRequests: [
      {
        type: ObjectId,
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    desc: {
      type: String,
      max: 50,
    },
    city: {
      type: String,
      max: 10,
    },
    relationship: {
      type: String,
      enum: ["Single", "Committed", "Complicated"],
    },
    bookmarks: [
      {
        type: ObjectId,
        ref: "post",
      },
    ],
  },
  { timestamps: true }
);

UserSchema.index({
  firstName: "text",
  lastName: "text",
  email: "text",
});

module.exports = mongoose.model("user", UserSchema);
