'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ArrowLeft, Send, Check, CheckCheck } from 'lucide-react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';

interface Message {
    _id: string;
    senderId: {
        _id: string;
        email: string;
    };
    receiverId: {
        _id: string;
        email: string;
    };
    content: string;
    read: boolean;
    createdAt: string;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuthStore();
    const partnerId = params.id as string;

    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [partnerId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await api.get(`/messages/conversation/${partnerId}`);
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await api.post('/messages', {
                receiverId: partnerId,
                content: newMessage
            });
            setMessages([...messages, data]);
            setNewMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatMessageDate = (date: Date) => {
        if (isToday(date)) return 'Today';
        if (isYesterday(date)) return 'Yesterday';
        return format(date, 'MMMM d, yyyy');
    };

    const partnerEmail = messages[0]?.senderId._id === user?._id
        ? messages[0]?.receiverId.email
        : messages[0]?.senderId.email;

    if (loading) {
        return (
            <div className="flex items-center justify-center" style={{ height: 'calc(100vh - 80px)' }}>
                <div className="text-muted-foreground">Loading chat...</div>
            </div>
        );
    }

    let currentDate: Date | null = null;

    return (
        <div className="flex flex-col h-[calc(100vh-32px)] bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden mx-auto max-w-7xl w-full">
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b bg-card shadow-sm flex-shrink-0">
                <Button variant="ghost" size="sm" onClick={() => router.back()}>
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#EC6D0A] to-[#d66209] flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-semibold text-white">
                        {partnerEmail?.[0]?.toUpperCase() || 'C'}
                    </span>
                </div>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold">{partnerEmail || 'Chat'}</h2>
                    <p className="text-xs text-muted-foreground">
                        {messages.length} message{messages.length !== 1 ? 's' : ''}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1 bg-muted/20">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <div className="text-6xl mb-4">💬</div>
                            <p>No messages yet</p>
                            <p className="text-sm">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId._id === user?._id;
                        const msgDate = new Date(msg.createdAt);
                        const showDateSeparator = !currentDate || !isSameDay(currentDate, msgDate);

                        if (showDateSeparator) {
                            currentDate = msgDate;
                        }

                        const showTime = index === messages.length - 1 ||
                            !isSameDay(msgDate, new Date(messages[index + 1]?.createdAt)) ||
                            messages[index + 1]?.senderId._id !== msg.senderId._id;

                        return (
                            <div key={msg._id}>
                                {/* Date Separator */}
                                {showDateSeparator && (
                                    <div className="flex items-center justify-center my-4">
                                        <div className="bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-muted-foreground border shadow-sm">
                                            {formatMessageDate(msgDate)}
                                        </div>
                                    </div>
                                )}

                                {/* Message Bubble */}
                                <div className={`flex mb-1 ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                    <div className={`flex flex-col max-w-[75%] sm:max-w-[60%]`}>
                                        <div
                                            className={`
                                                relative px-4 py-2 rounded-2xl shadow-sm
                                                ${isMe
                                                    ? 'bg-gradient-to-br from-[#EC6D0A] to-[#d66209] text-white rounded-br-md'
                                                    : 'bg-card border text-foreground rounded-bl-md'
                                                }
                                            `}
                                        >
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                                {msg.content}
                                            </p>
                                        </div>

                                        {/* Time & Read Receipt */}
                                        {showTime && (
                                            <div className={`flex items-center gap-1 mt-1 px-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                                <span className="text-xs text-muted-foreground">
                                                    {format(msgDate, 'h:mm a')}
                                                </span>
                                                {isMe && (
                                                    <div className="text-muted-foreground">
                                                        {msg.read ? (
                                                            <CheckCheck className="h-3.5 w-3.5 text-[#EC6D0A]" />
                                                        ) : (
                                                            <Check className="h-3.5 w-3.5" />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="flex gap-2 p-4 border-t bg-card shadow-lg flex-shrink-0">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-background"
                    disabled={sending}
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="px-4"
                >
                    {sending ? (
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </form>
        </div>
    );
}
