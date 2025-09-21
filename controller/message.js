const Message = require("../model/message");

exports.createMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    const newMessage = await Message.create({ sender, receiver, message });
    res.status(201).json({ success: true, message: newMessage });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.query;

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
    }).populate("sender receiver", "name email");

    res.json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
