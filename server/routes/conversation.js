const router = require("express").Router();
const Conversation = require("../models/Conversation");
const Message = require("../models/Message");

router.post("/", async (req, res) => {
  const conversation = new Conversation({
    member: [req.body.senderId, req.body.receiverId],
  });
  try {
    const savedConversation = await conversation.save();
    const initMessage = new Message({
      conversationId: savedConversation._id,
    });
    await initMessage.save();
    res.json(savedConversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const conversation = await Conversation.find({
      member: { $in: [req.params.id] },
    });
    res.json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:conversationId", async (req, res) => {
  try {
    await Conversation.findByIdAndDelete({
      _id: req.params.conversationId,
    });
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
