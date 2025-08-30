const Message = require('../models/Message');
const User = require('../models/User');
const admin = require('../config/firebaseAdmin');

// Send a message to another user
exports.sendMessage = async (req, res) => {
  try {
    const { receiverUid, content, projectId } = req.body;
    const senderUid = req.user.uid; // From verifyToken middleware

    if (!receiverUid || !content) {
      return res.status(400).json({ message: 'Receiver UID and content are required.' });
    }

    const newMessage = new Message({
      participants: [senderUid, receiverUid].sort(), // Sort to create a consistent conversation ID
      sender: senderUid,
      content,
      projectId: projectId || null,
    });

    await newMessage.save();

    // --- Real-time Notifications ---
    // 1. Send FCM notification for push alerts
    const receiverProfile = await User.findOne({ firebaseUid: receiverUid });
    if (receiverProfile?.fcmToken) {
      await admin.messaging().send({
        token: receiverProfile.fcmToken,
        notification: {
          title: `New message from ${req.user.name || 'a user'}`,
          body: content.length > 100 ? `${content.substring(0, 97)}...` : content,
        },
        data: { // #FIX: Custom data should be inside a 'data' object
          messageId: newMessage._id.toString(),
          senderUid: senderUid,
          type: 'newMessage'
        },
      });
    }

    // 2. Emit socket.io event for live in-app chat
    req.io?.to(receiverUid).emit('newMessage', newMessage);

    res.status(201).json(newMessage);

  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Failed to send message.' });
  }
};

// #IMPROVEMENT: Get messages for a specific one-on-one conversation
exports.getConversationMessages = async (req, res) => {
  try {
    const { otherUserUid } = req.params;
    const currentUserUid = req.user.uid;

    const messages = await Message.find({
      participants: { $all: [currentUserUid, otherUserUid].sort() }
    })
    .populate({ path: 'sender', model: 'User', select: 'name profilePhoto' }) // Populate sender details
    .sort({ createdAt: 'asc' });

    res.status(200).json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Failed to fetch messages.' });
  }
};

// #IMPROVEMENT: Get a list of all active conversations for the logged-in user
exports.getConversations = async (req, res) => {
    try {
        const currentUserUid = req.user.uid;

        // This is an advanced MongoDB query to get the last message of each conversation
        const conversations = await Message.aggregate([
            { $match: { participants: currentUserUid } },
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: "$participants",
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            { $replaceRoot: { newRoot: "$lastMessage" } },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'participants',
                    foreignField: 'firebaseUid',
                    as: 'participantDetails'
                }
            },
        ]);

        res.status(200).json(conversations);
    } catch (err) {
        console.error('Get conversations error:', err);
        res.status(500).json({ message: 'Failed to fetch conversations.' });
    }
};