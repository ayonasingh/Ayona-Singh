const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const messagesFile = path.join(dataDir, 'messages.json');

// Read messages from JSON
const readMessages = () => {
    if (!fs.existsSync(messagesFile)) return [];
    return JSON.parse(fs.readFileSync(messagesFile, 'utf-8'));
};

// Write messages to JSON
const writeMessages = (messages) => {
    fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
};

// Get conversation between two users
const getConversation = (userId1, userId2) => {
    const messages = readMessages();
    return messages.filter(m => 
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
    ).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
};

// Get last message for a user
const getLastMessage = (userId, adminId) => {
    const messages = readMessages();
    const userMessages = messages.filter(m =>
        (m.senderId === userId && m.receiverId === adminId) ||
        (m.senderId === adminId && m.receiverId === userId)
    );
    return userMessages.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
    )[0] || null;
};

// Get unread count for messages from a user
const getUnreadCount = (fromUserId, toUserId) => {
    const messages = readMessages();
    return messages.filter(m =>
        m.senderId === fromUserId &&
        m.receiverId === toUserId &&
        !m.read
    ).length;
};

module.exports = {
    readMessages,
    writeMessages,
    getConversation,
    getLastMessage,
    getUnreadCount
};
