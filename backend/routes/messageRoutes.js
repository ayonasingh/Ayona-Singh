const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { readMessages, writeMessages, getConversation } = require('../helpers/messageHelpers');
const { findUserById } = require('../helpers/userHelpers');
const { authenticate } = require('../middleware/auth');

const MAX_MESSAGE_LENGTH = parseInt(process.env.MAX_MESSAGE_LENGTH) || 1000;

// POST /api/messages/send
router.post('/send', authenticate, (req, res) => {
    try {
        const { receiverId, content } = req.body;

        // Validation
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Message content required' });
        }

        if (content.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({ 
                error: `Message too long. Maximum ${MAX_MESSAGE_LENGTH} characters` 
            });
        }

        if (!receiverId) {
            return res.status(400).json({ error: 'Receiver ID required' });
        }

        // Validate receiver exists
        const receiver = findUserById(receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

        // Create message
        const newMessage = {
            id: uuidv4(),
            senderId: req.user.id,
            receiverId,
            content: content.trim(),
            read: false,
            createdAt: new Date().toISOString()
        };

        const messages = readMessages();
        messages.push(newMessage);
        writeMessages(messages);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Server error sending message' });
    }
});

// GET /api/messages - Get user's messages
router.get('/', authenticate, (req, res) => {
    try {
        const messages = readMessages();
        const userMessages = messages.filter(m =>
            m.senderId === req.user.id || m.receiverId === req.user.id
        ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        res.json(userMessages);
    } catch (error) {
        console.error('Get messages error:', error);
        res.status(500).json({ error: 'Server error retrieving messages' });
    }
});

// GET /api/messages/:userId - Get conversation with specific user
router.get('/:userId', authenticate, (req, res) => {
    try {
        const { userId } = req.params;
        const conversation = getConversation(req.user.id, userId);
        res.json(conversation);
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Server error retrieving conversation' });
    }
});

// PUT /api/messages/:messageId/read - Mark message as read
router.put('/:messageId/read', authenticate, (req, res) => {
    try {
        const { messageId } = req.params;
        const messages = readMessages();
        const messageIndex = messages.findIndex(m => m.id === messageId);

        if (messageIndex === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Only receiver can mark as read
        if (messages[messageIndex].receiverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        messages[messageIndex].read = true;
        writeMessages(messages);

        res.json(messages[messageIndex]);
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Server error marking message as read' });
    }
});

module.exports = router;
