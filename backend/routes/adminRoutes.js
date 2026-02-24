const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const { readUsers, writeUsers } = require('../helpers/userHelpers');
const { readMessages, writeMessages } = require('../helpers/messageHelpers');
const { authenticate, adminOnly } = require('../middleware/auth');

// GET /api/admin/stats - Get statistics
router.get('/stats', authenticate, adminOnly, (req, res) => {
    try {
        const users = readUsers();
        const messages = readMessages();
        const adminUser = users.find(u => u.role === 'admin');

        const totalUsers = users.filter(u => u.role !== 'admin').length;
        const totalMessages = messages.length;
        const unreadMessages = adminUser ? messages.filter(m =>
            m.receiverId === adminUser.id && !m.read
        ).length : 0;
        const onlineUsers = global.onlineUsers ? Object.keys(global.onlineUsers).length : 0;

        // Count conversations today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const conversationsToday = messages.filter(m =>
            new Date(m.createdAt) >= today
        ).length;

        res.json({
            totalUsers,
            totalMessages,
            unreadMessages,
            onlineUsers,
            conversationsToday
        });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Server error retrieving statistics' });
    }
});

// GET /api/admin/users - List all users
router.get('/users', authenticate, adminOnly, (req, res) => {
    try {
        const users = readUsers();
        const userList = users
            .filter(u => u.role !== 'admin')
            .map(({ password, ...user }) => user);
        res.json(userList);
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Server error retrieving users' });
    }
});

// DELETE /api/admin/users/:userId - Delete user
router.delete('/users/:userId', authenticate, adminOnly, (req, res) => {
    try {
        const { userId } = req.params;
        const users = readUsers();
        const adminUser = users.find(u => u.role === 'admin');

        // Delete user
        const updatedUsers = users.filter(u => u.id !== userId);
        writeUsers(updatedUsers);

        // Delete all messages involving this user
        let messages = readMessages();
        messages = messages.filter(m =>
            m.senderId !== userId && m.receiverId !== userId
        );
        writeMessages(messages);

        res.json({ message: 'User and associated messages deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Server error deleting user' });
    }
});

// POST /api/admin/messages/send - Admin send message
router.post('/messages/send', authenticate, adminOnly, (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!content || content.trim().length === 0) {
            return res.status(400).json({ error: 'Message content required' });
        }

        if (!receiverId) {
            return res.status(400).json({ error: 'Receiver ID required' });
        }

        const users = readUsers();
        const receiver = users.find(u => u.id === receiverId);
        if (!receiver) {
            return res.status(404).json({ error: 'Receiver not found' });
        }

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
        console.error('Admin send message error:', error);
        res.status(500).json({ error: 'Server error sending message' });
    }
});

module.exports = router;
