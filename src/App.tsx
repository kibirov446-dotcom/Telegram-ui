import React, { useEffect, useState } from 'react';
import { AnimatedLiquidBackground } from './components/AnimatedLiquidBackground';
import { ChatDetailScreen } from './components/ChatDetailScreen';
import { ChatListScreen } from './components/ChatListScreen';
import { createInitialMessages, SAMPLE_CHATS } from './data/chats';
import { ChatMessage, ChatPreview } from './types';

export const App: React.FC = () => {
  const [chats, setChats] = useState<ChatPreview[]>(SAMPLE_CHATS);
  const [activeChat, setActiveChat] = useState<ChatPreview | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [messagesByChatId, setMessagesByChatId] = useState<
    Record<string, ChatMessage[]>
  >({});

  const openChat = (chat: ChatPreview) => {
    setMessagesByChatId((prev) =>
      prev[chat.id] ? prev : { ...prev, [chat.id]: createInitialMessages() }
    );
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
    setActiveChat(chat);
    // Allow mount before sliding in for crisp iOS 26 spring transition
    requestAnimationFrame(() => {
      setIsDetailOpen(true);
    });
  };

  const closeChat = () => {
    setIsDetailOpen(false);
  };

  // Clear activeChat only after slide-out animation completes
  useEffect(() => {
    if (!isDetailOpen && activeChat) {
      const timer = window.setTimeout(() => {
        setActiveChat(null);
      }, 460);
      return () => window.clearTimeout(timer);
    }
    return undefined;
  }, [isDetailOpen, activeChat]);

  // Support Escape key to navigate back
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDetailOpen) {
        closeChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDetailOpen]);

  const handleSendMessage = (chatId: string, text: string) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newMsg: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      text,
      time,
      isMine: true,
    };

    setMessagesByChatId((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] ?? createInitialMessages()), newMsg],
    }));

    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId ? { ...c, subtitle: text, time } : c
      )
    );
  };

  return (
    <div className="relative flex h-dvh w-full items-center justify-center overflow-hidden bg-[#070B14]">
      {/* Full-viewport Liquid Mesh Backdrop */}
      <AnimatedLiquidBackground />

      {/* Mobile-first App Shell (full screen on phones, sleek glass device viewport on desktop) */}
      <div className="relative z-10 h-full w-full overflow-hidden sm:h-[min(860px,94dvh)] sm:w-[420px] sm:rounded-[44px] sm:border sm:border-white/15 sm:shadow-[0_24px_80px_rgba(0,0,0,0.65)]">
        <AnimatedLiquidBackground />

        {/* Chat List Layer with iOS 26 parallax + scale exit/pop-enter */}
        <div
          className={`ios-spring-transition absolute inset-0 z-10 ${
            isDetailOpen
              ? '-translate-x-[28%] scale-[0.94] opacity-70'
              : 'translate-x-0 scale-100 opacity-100'
          }`}
        >
          <ChatListScreen chats={chats} onChatClick={openChat} />
        </div>

        {/* Chat Detail Layer with iOS 26 slide-in / pop-exit */}
        {activeChat && (
          <div
            className={`ios-spring-transition absolute inset-0 z-20 ${
              isDetailOpen
                ? 'translate-x-0 opacity-100'
                : 'pointer-events-none translate-x-full opacity-95'
            }`}
          >
            <ChatDetailScreen
              chatTitle={activeChat.title}
              messages={
                messagesByChatId[activeChat.id] ?? createInitialMessages()
              }
              onBack={closeChat}
              onSendMessage={(text) => handleSendMessage(activeChat.id, text)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
