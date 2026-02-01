'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Conversation {
    partnerId: string;
    partner: {
        _id: string;
        email: string;
        role: string;
    };
    lastMessage: {
        content: string;
        createdAt: string;
    };
    unreadCount: number;
}

export default function MessagesPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchConversations();
    }, []);

    const fetchConversations = async () => {
        try {
            const { data } = await api.get('/messages/conversations');
            setConversations(data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const openChat = (partnerId: string) => {
        router.push(`/dashboard/messages/${partnerId}`);
    };

    const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

    if (loading) {
        return <div>Loading conversations...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <p className="text-muted-foreground">
                    {totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up!'}
                </p>
            </div>

            <div className="space-y-2">
                {conversations.length === 0 ? (
                    <Card className="p-8 text-center text-muted-foreground">
                        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No conversations yet</p>
                    </Card>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.partnerId}
                            onClick={() => openChat(conv.partnerId)}
                            className={`
                                rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md
                                ${conv.unreadCount > 0 ? 'bg-primary/5 border-primary/20' : 'bg-card hover:bg-muted/50'}
                            `}
                        >
                            <div className="flex items-start gap-3">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-semibold text-primary">
                                        {conv.partner.email[0].toUpperCase()}
                                    </span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <h3 className={`text-base truncate ${conv.unreadCount > 0 ? 'font-semibold' : 'font-medium'}`}>
                                            {conv.partner.email}
                                        </h3>
                                        {conv.unreadCount > 0 && (
                                            <Badge variant="default">{conv.unreadCount}</Badge>
                                        )}
                                    </div>

                                    <p className="text-sm text-muted-foreground truncate mb-1">
                                        {conv.lastMessage.content.substring(0, 80)}...
                                    </p>

                                    <span className="text-xs text-muted-foreground">
                                        {formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}


