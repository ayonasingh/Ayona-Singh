const express = require('express');
const router = express.Router();
const { readUsers } = require('../helpers/userHelpers');
const { 
    readMessages, 
    writeMessages, 
    getConversation, 
    getLastMessage, 
    getUnreadCount 
} = require('../helpers/messageHelpers');
const { authenticate, adminOnly } = require('../middleware/auth');

// GET /api/conversations - List all conversations (admin only)
router.get('/', authenticate, adminOnly, (req, res) => {
    try {
        const users = readUsers();
        const adminUser = users.find(u => u.role === 'admin');
        
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        const conversations = users
            .filter(u => u.role !== 'admin')
            .map(user => {
                const lastMessage = getLastMessage(user.id, adminUser.id);
                const unreadCount = getUnreadCount(user.id, adminUser.id);
                
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        createdAt: user.createdAt,
                        lastLogin: user.lastLogin
                    },
                    lastMessage,
                    unreadCount,
                    isOnline: global.onlineUsers && global.onlineUsers[user.id] ? true : false
                };
            })
            .filter(conv => conv.lastMessage !== null)
            .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });

        res.json(conversations);
    } catch (error) {
        console.error('Get conversations error:', error);
        res.status(500).json({ error: 'Server error retrieving conversations' });
    }
});

// GET /api/conversations/:userId - Get specific conversation (admin only)
router.get('/:userId', authenticate, adminOnly, (req, res) => {
    try {
        const { userId } = req.params;
        const users = readUsers();
        const user = users.find(u => u.id === userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const adminUser = users.find(u => u.role === 'admin');
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        const messages = getConversation(adminUser.id, userId);

        // Mark user messages as read
        const allMessages = readMessages();
        let updated = false;
        allMessages.forEach(m => {
            if (m.senderId === userId && m.receiverId === adminUser.id && !m.read) {
                m.read = true;
                updated = true;
            }
        });
        if (updated) {
            writeMessages(allMessages);
        }

        res.json({
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin
            },
            messages
        });
    } catch (error) {
        console.error('Get conversation error:', error);
        res.status(500).json({ error: 'Server error retrieving conversation' });
    }
});

// DELETE /api/conversations/:userId - Delete conversation (admin only)
router.delete('/:userId', authenticate, adminOnly, (req, res) => {
    try {
        const { userId } = req.params;
        const { deleteUser } = req.query;

        const users = readUsers();
        const adminUser = users.find(u => u.role === 'admin');
        
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        // Delete all messages between admin and user
        let messages = readMessages();
        messages = messages.filter(m =>
            !((m.senderId === userId && m.receiverId === adminUser.id) ||
              (m.senderId === adminUser.id && m.receiverId === userId))
        );
        writeMessages(messages);

        // Optionally delete user account
        if (deleteUser === 'true') {
            const updatedUsers = users.filter(u => u.id !== userId);
            const { writeUsers } = require('../helpers/userHelpers');
            writeUsers(updatedUsers);
        }

        res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
        console.error('Delete conversation error:', error);
        res.status(500).json({ error: 'Server error deleting conversation' });
    }
});

// GET /api/conversations/search - Search conversations (admin only)
router.get('/search/query', authenticate, adminOnly, (req, res) => {
    try {
        const { q, unread } = req.query;
        const users = readUsers();
        const adminUser = users.find(u => u.role === 'admin');
        
        if (!adminUser) {
            return res.status(404).json({ error: 'Admin user not found' });
        }

        let filteredUsers = users.filter(u => u.role !== 'admin');

        // Search by username or email
        if (q) {
            const query = q.toLowerCase();
            filteredUsers = filteredUsers.filter(u =>
                u.username.toLowerCase().includes(query) ||
                u.email.toLowerCase().includes(query)
            );
        }

        const conversations = filteredUsers
            .map(user => {
                const lastMessage = getLastMessage(user.id, adminUser.id);
                const unreadCount = getUnreadCount(user.id, adminUser.id);
                
                return {
                    user: {
                        id: user.id,
                        username: user.username,
                        email: user.email,
                        createdAt: user.createdAt,
                        lastLogin: user.lastLogin
                    },
                    lastMessage,
                    unreadCount,
                    isOnline: global.onlineUsers && global.onlineUsers[user.id] ? true : false
                };
            })
            .filter(conv => {
                if (unread === 'true') {
                    return conv.unreadCount > 0;
                }
                return conv.lastMessage !== null;
            })
            .sort((a, b) => {
                if (!a.lastMessage) return 1;
                if (!b.lastMessage) return -1;
                return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
            });

        res.json(conversations);
    } catch (error) {
        console.error('Search conversations error:', error);
        res.status(500).json({ error: 'Server error searching conversations' });
    }
});

module.exports = router;
