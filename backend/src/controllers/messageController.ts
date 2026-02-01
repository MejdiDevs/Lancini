import { Request, Response } from 'express';
import Message from '../models/Message';
import User from '../models/User';
import mongoose from 'mongoose';

// Get all conversations (grouped by participants)
export const getConversations = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;

        // Find all messages where user is sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: userId }, { receiverId: userId }]
        }).populate('senderId receiverId', 'email role').sort({ createdAt: -1 });

        // Group by conversation partner
        const conversationsMap = new Map();

        messages.forEach(msg => {
            const partnerId = msg.senderId._id.toString() === userId.toString()
                ? msg.receiverId._id.toString()
                : msg.senderId._id.toString();

            if (!conversationsMap.has(partnerId)) {
                const partner = msg.senderId._id.toString() === userId.toString()
                    ? msg.receiverId
                    : msg.senderId;

                conversationsMap.set(partnerId, {
                    partnerId,
                    partner: {
                        _id: (partner as any)._id,
                        email: (partner as any).email,
                        role: (partner as any).role
                    },
                    lastMessage: msg,
                    unreadCount: 0
                });
            }

            // Count unread messages
            if (msg.receiverId._id.toString() === userId.toString() && !msg.read) {
                conversationsMap.get(partnerId).unreadCount++;
            }
        });

        const conversations = Array.from(conversationsMap.values());
        res.json(conversations);
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get messages with a specific user
export const getConversationMessages = async (req: Request, res: Response) => {
    try {
        const userId = req.user._id;
        const partnerId = req.params.partnerId;

        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId }
            ]
        }).populate('senderId receiverId', 'email role').sort({ createdAt: 1 });

        // Mark messages as read
        await Message.updateMany(
            { senderId: partnerId, receiverId: userId, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        console.error('Error fetching conversation:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Get all messages for current user (legacy - keep for now)
export const getMyMessages = async (req: Request, res: Response) => {
    try {
        const messages = await Message.find({ receiverId: req.user._id })
            .populate('senderId', 'email role')
            .sort({ createdAt: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server Error fetching messages' });
    }
};

// Send a message to a specific user
export const sendMessage = async (req: Request, res: Response) => {
    try {
        const { receiverId, content } = req.body;

        const message = await Message.create({
            senderId: req.user._id,
            receiverId,
            subject: 'Chat Message', // For chat, subject is not really used
            content
        });

        const populatedMessage = await Message.findById(message._id)
            .populate('senderId receiverId', 'email role');

        res.status(201).json(populatedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server Error sending message' });
    }
};

// Mark as read
export const markAsRead = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Message.findByIdAndUpdate(id, { read: true });
        res.json({ message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};
