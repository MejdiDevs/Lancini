'use client';

import { useState, useEffect, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Button } from '@/components/ui/Button';
import { Bot, User, Send, StopCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    role: 'interviewer' | 'candidate';
    content: string;
    timestamp: string;
}

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: jobId } = use(params);
    const router = useRouter();

    const [sessionId, setSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false); // Initial loading
    const [processing, setProcessing] = useState(false); // AI thinking
    const [error, setError] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startInterview();
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, processing]);

    const startInterview = async () => {
        try {
            setLoading(true);
            const { data } = await api.post('/interview/start', { jobId });
            setSessionId(data.sessionId);
            setMessages([{
                role: 'interviewer',
                content: data.question,
                timestamp: new Date().toISOString()
            }]);
        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || 'Failed to start interview');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !sessionId || processing) return;

        const userMsg: Message = {
            role: 'candidate',
            content: input,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setProcessing(true);

        try {
            const { data } = await api.post('/interview/answer', {
                sessionId,
                answer: userMsg.content
            });

            setMessages(prev => [...prev, {
                role: 'interviewer', // Backend returns 'response' which is the text
                content: data.response,
                timestamp: new Date().toISOString()
            }]);

        } catch (err) {
            console.error(err);
            // Handle error (maybe toast)
        } finally {
            setProcessing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (isoString?: string) => {
        if (!isoString) return '';
        return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-[#133D6F] rounded-full animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Preparing your interview environment...</p>
                <p className="text-sm text-gray-400 mt-2">Analyzing job description & CV</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
                <div className="bg-red-100 p-4 rounded-full mb-4">
                    <StopCircle className="h-8 w-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Unavailable to Start</h3>
                <p className="text-gray-600 max-w-md mb-6">{error}</p>
                <Button onClick={() => router.back()} variant="outline">
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Go Back
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-32px)] bg-gray-50 rounded-2xl border border-gray-200 shadow-md overflow-hidden mx-auto max-w-7xl w-full relative">
            {/* Header */}
            <div className="bg-white border-b px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => router.back()} className="-ml-2">
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Bot className="h-5 w-5 text-[#133D6F]" />
                            AI Interviewer
                        </h1>
                        <p className="text-xs text-gray-500">Practice Mode • {jobId ? 'Job Specific' : 'General'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-orange-100 text-[#EC6D0A] text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                        Live Session
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Welcome Note */}
                    <div className="text-center text-xs text-gray-400 py-4">
                        Messages are processed by AI. Code formatting is supported.
                    </div>

                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={cn(
                                "flex gap-4 w-full max-w-2xl",
                                msg.role === 'candidate' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1",
                                msg.role === 'candidate' ? "bg-white border-gray-200" : "bg-[#133D6F] border-[#133D6F] text-white"
                            )}>
                                {msg.role === 'candidate' ? <User className="h-5 w-5 text-gray-600" /> : <Bot className="h-5 w-5" />}
                            </div>

                            {/* Bubble */}
                            <div className={cn(
                                "p-4 rounded-2xl shadow-sm text-[15px] leading-relaxed relative group",
                                msg.role === 'candidate'
                                    ? "bg-white text-gray-800 border-gray-100 rounded-tr-sm"
                                    : "bg-white border text-gray-800 border-gray-200 rounded-tl-sm"
                            )}>
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                                <span className={cn(
                                    "text-[10px] absolute bottom-2 opacity-0 group-hover:opacity-100 transition-opacity",
                                    msg.role === 'candidate' ? "left-2 text-gray-400" : "right-2 text-gray-400"
                                )}>
                                    {formatTime(msg.timestamp)}
                                </span>
                            </div>
                        </div>
                    ))}

                    {processing && (
                        <div className="flex gap-4 w-full max-w-2xl">
                            <div className="w-8 h-8 rounded-full bg-[#133D6F] flex items-center justify-center shrink-0 text-white mt-1">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-2">
                                <div className="w-2 h-2 bg-[#133D6F] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-2 h-2 bg-[#133D6F] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-2 h-2 bg-[#133D6F] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-4 md:p-6 shrink-0 z-20" style={{ paddingBottom: '10px' }}>
                <div className="max-w-3xl mx-auto relative flex items-end gap-2 bg-gray-50 border border-gray-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-[#133D6F] transition-all shadow-sm">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your answer here..."
                        className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-2.5 px-4 text-gray-700 placeholder:text-gray-400"
                        rows={1}
                        disabled={processing}
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!input.trim() || processing}
                        className={cn(
                            "rounded-full w-10 h-10 p-0 shrink-0 transition-all",
                            input.trim() ? "bg-[#133D6F] hover:bg-[#112b4d] text-white" : "bg-gray-200 text-gray-400"
                        )}
                    >
                        <Send className="h-5 w-5 ml-0.5" />
                    </Button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400">
                        Pro tip: Be specific and use the STAR method (Situation, Task, Action, Result).
                    </p>
                </div>
            </div>
        </div>
    );
}
