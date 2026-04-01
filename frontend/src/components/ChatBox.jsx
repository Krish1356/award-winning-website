import React, { useState, useEffect, useRef } from 'react';
import { getTable, insertIntoTable } from '../lib/mockDB';
import { X, Send } from 'lucide-react';
import Button from './ui/Button';

const ChatBox = ({ queryId, currentUser, onClose, title = "Chat" }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const fetchMessages = () => {
            const allMessages = getTable('chat_messages').filter(m => m.query_id === queryId);
            setMessages(allMessages);
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 1000); // Polling every 1s
        return () => clearInterval(interval);
    }, [queryId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const msgObj = {
            id: 'msg_' + Date.now(),
            query_id: queryId,
            sender_id: currentUser.id,
            text: newMessage.trim(),
            created_at: new Date().toISOString()
        };

        insertIntoTable('chat_messages', msgObj);
        setNewMessage('');
        
        // Optimistic update
        setMessages(prev => [...prev, msgObj]);
    };

    return (
        <div className="fixed bottom-4 right-4 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-t-xl rounded-b-xl shadow-2xl flex flex-col z-50 border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ height: '450px' }}>
            {/* Header */}
            <div className="bg-purple-600 text-white p-3 flex justify-between items-center rounded-t-xl">
                <h3 className="font-semibold text-sm truncate">{title}</h3>
                <button onClick={onClose} className="hover:bg-purple-700 p-1 rounded-full transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900 border-x border-gray-200 dark:border-gray-700">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 text-sm italic text-center">
                        No messages yet.<br/>Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const isMe = msg.sender_id === currentUser.id;
                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-lg p-3 text-sm shadow-sm ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-white border border-gray-200 text-gray-800 dark:bg-gray-800 dark:border-gray-600 dark:text-white rounded-bl-none'}`}>
                                    <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                                    <span className={`text-[10px] block mt-1 ${isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-3 bg-white dark:bg-gray-800 border bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700 flex gap-2 rounded-b-xl items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-full border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
                <Button type="submit" variant="primary" size="sm" className="rounded-full h-9 w-9 p-0 flex items-center justify-center shrink-0 bg-purple-600 hover:bg-purple-700">
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    );
};

export default ChatBox;
