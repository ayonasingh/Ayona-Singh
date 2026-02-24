const { authenticateSocket } = require('../helpers/authHelpers');
const { readMessages, writeMessages } = require('../helpers/messageHelpers');
const { findUserById } = require('../helpers/userHelpers');
const { v4: uuidv4 } = require('uuid');

// Store online users: { userId: socketId }
global.onlineUsers = {};

// Store typing status: { userId: { targetUserId: timeout } }
const typingStatus = {};

const initializeSocket = (io) => {
    io.on('connection', (socket) => {
        console.log('New socket connection:', socket.id);

        // Authenticate socket
        socket.on('authenticate', (token) => {
            const user = authenticateSocket(token);
            if (!user) {
                socket.emit('error', { message: 'Authentication failed' });
                socket.disconnect();
                return;
            }

            socket.userId = user.id;
            socket.userRole = user.role;
            global.onlineUsers[user.id] = socket.id;

            socket.emit('authenticated', { userId: user.id });
            
            // Broadcast user online status
            io.emit('user_online', { userId: user.id });
            
            console.log(`User ${user.id} authenticated and online`);
        });

        // Send message
        socket.on('send_message', async (data) => {
            if (!socket.userId) {
                socket.emit('error', { message: 'Not authenticated' });
                return;
            }

            const { receiverId, content } = data;

            if (!content || content.trim().length === 0) {
                socket.emit('error', { message: 'Message content required' });
                return;
            }

            // Validate receiver
            const receiver = findUserById(receiverId);
            if (!receiver) {
                socket.emit('error', { message: 'Receiver not found' });
                return;
            }

            // Create message
            const newMessage = {
                id: uuidv4(),
                senderId: socket.userId,
                receiverId,
                content: content.trim(),
                read: false,
                createdAt: new Date().toISOString()
            };

            const messages = readMessages();
            messages.push(newMessage);
            writeMessages(messages);

            // Send to sender
            socket.emit('message_sent', newMessage);

            // Send to receiver if online
            const receiverSocketId = global.onlineUsers[receiverId];
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('new_message', newMessage);
            }

            console.log(`Message sent from ${socket.userId} to ${receiverId}`);
        });

        // Typing start
        socket.on('typing_start', (data) => {
            if (!socket.userId) return;

            const { receiverId } = data;
            const receiverSocketId = global.onlineUsers[receiverId];
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('typing', { userId: socket.userId });
            }

            // Clear existing timeout
            if (typingStatus[socket.userId] && typingStatus[socket.userId][receiverId]) {
                clearTimeout(typingStatus[socket.userId][receiverId]);
            }

            // Set auto-clear after 3 seconds
            if (!typingStatus[socket.userId]) {
                typingStatus[socket.userId] = {};
            }
            
            typingStatus[socket.userId][receiverId] = setTimeout(() => {
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('stop_typing', { userId: socket.userId });
                }
            }, 3000);
        });

        // Typing stop
        socket.on('typing_stop', (data) => {
            if (!socket.userId) return;

            const { receiverId } = data;
            const receiverSocketId = global.onlineUsers[receiverId];
            
            if (receiverSocketId) {
                io.to(receiverSocketId).emit('stop_typing', { userId: socket.userId });
            }

            // Clear timeout
            if (typingStatus[socket.userId] && typingStatus[socket.userId][receiverId]) {
                clearTimeout(typingStatus[socket.userId][receiverId]);
                delete typingStatus[socket.userId][receiverId];
            }
        });

        // Mark message as read
        socket.on('mark_read', (data) => {
            if (!socket.userId) return;

            const { messageId } = data;
            const messages = readMessages();
            const messageIndex = messages.findIndex(m => m.id === messageId);

            if (messageIndex !== -1 && messages[messageIndex].receiverId === socket.userId) {
                messages[messageIndex].read = true;
                writeMessages(messages);

                // Notify sender
                const senderSocketId = global.onlineUsers[messages[messageIndex].senderId];
                if (senderSocketId) {
                    io.to(senderSocketId).emit('message_read', { messageId });
                }
            }
        });

        // Disconnect
        socket.on('disconnect', () => {
            if (socket.userId) {
                delete global.onlineUsers[socket.userId];
                
                // Clear typing timeouts
                if (typingStatus[socket.userId]) {
                    Object.values(typingStatus[socket.userId]).forEach(timeout => {
                        clearTimeout(timeout);
                    });
                    delete typingStatus[socket.userId];
                }

                // Broadcast user offline status
                io.emit('user_offline', { userId: socket.userId });
                
                console.log(`User ${socket.userId} disconnected and offline`);
            }
        });
    });
};

module.exports = initializeSocket;
