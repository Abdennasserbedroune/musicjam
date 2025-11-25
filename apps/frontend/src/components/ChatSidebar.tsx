'use client';

import { useState, useEffect, useRef } from 'react';
import { Message } from '@prisma/client';
import { sendMessage } from '@/lib/actions';

export default function ChatSidebar({
  roomCode,
  initialMessages,
  nickname,
}: {
  roomCode: string;
  initialMessages: Message[];
  nickname: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const lastMessage = messages[messages.length - 1];
        const since = lastMessage?.createdAt
          ? new Date(lastMessage.createdAt).toISOString()
          : undefined;

        const url = since
          ? `/api/rooms/${roomCode}/messages?since=${since}`
          : `/api/rooms/${roomCode}/messages`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages((prev) => [...prev, ...data.messages]);
          }
        }
      } catch (error) {
        console.error('Failed to poll messages:', error);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [roomCode, messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);

    try {
      const result = await sendMessage(roomCode, nickname, newMessage);

      if (result.success && result.message) {
        setMessages((prev) => [...prev, result.message!]);
        setNewMessage('');
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <aside className="flex w-80 flex-col border-l border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-semibold text-gray-900">Chat</h2>
      </div>

      <div className="scrollbar-thin flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No messages yet</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-gray-900">
                  {message.author}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTime(message.createdAt)}
                </span>
              </div>
              <p className="break-words text-sm text-gray-700">
                {message.text}
              </p>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            placeholder="Type a message..."
            maxLength={500}
          />
          <button
            type="submit"
            disabled={isLoading || !newMessage.trim()}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </aside>
  );
}
