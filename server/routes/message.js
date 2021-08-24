const router = require("express").Router();
const { verifyToken } = require("../middlewares/verifyToken");
const Message = require("../models/Message");

router.use(verifyToken);

router.post("/", async (req, res) => {
  const message = new Message(req.body);
  try {
    const newMessage = await message.save();
    res.json(newMessage);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:conversationId", async (req, res) => {
  try {
    await Message.findOneAndUpdate(
      { conversationId: req.params.conversationId },
      { $push: { messages: req.body } }
    );
    res.json({ message: "Message Sent" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:conversationId", async (req, res) => {
  try {
    const messages = await Message.findOne({
      conversationId: req.params.conversationId,
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:conversationId", async (req, res) => {
  try {
    await Message.findOneAndDelete({
      conversationId: req.params.conversationId,
    });
    res.json({ message: "Messages deleted" });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
