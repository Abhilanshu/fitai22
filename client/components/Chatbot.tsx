'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import api from '@/lib/api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', content: string }[]>([
        { role: 'bot', content: "Hi! I'm FitAI. Ask me anything about workouts, nutrition, or your fitness goals." }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setInput('');
        setLoading(true);

        try {
            const res = await api.post('/chat', { message: userMsg });
            setMessages(prev => [...prev, { role: 'bot', content: res.data.reply }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I'm having trouble connecting right now. Please try again later." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            {isOpen && (
                <div className="mb-4 w-[350px] h-[500px] bg-zinc-900 border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
                    {/* Header */}
                    <div className="bg-blue-600 p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <Bot className="text-white" size={24} />
                            <div>
                                <h3 className="font-bold text-white">FitAI Assistant</h3>
                                <p className="text-xs text-blue-100">Always here to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-gray-800 text-gray-200 rounded-bl-none'
                                    }`}>
                                    <p className="text-sm">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 p-3 rounded-2xl rounded-bl-none flex gap-1">
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-75" />
                                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-4 bg-black border-t border-gray-800 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-grow bg-zinc-900 text-white text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-800"
                        />
                        <button
                            type="submit"
                            disabled={loading || !input.trim()}
                            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-gray-800 rotate-90' : 'bg-blue-600 hover:scale-110'
                    }`}
            >
                {isOpen ? <X className="text-white" /> : <MessageSquare className="text-white" />}
            </button>
        </div>
    );
}
