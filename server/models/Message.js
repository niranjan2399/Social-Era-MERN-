const mongoose = require("mongoose");

const MessageSchema = mongoose.Schema(
  {
    conversationId: {
      type: String,
    },
    messages: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("message", MessageSchema);
