import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Paperclip, Send } from 'lucide-react';
import { ChatMessage } from '../types';
import { GlassContainer } from './GlassContainer';
import { InteractiveClockPill, StatusBarClockTapZone } from './ClockControls';

interface ChatDetailScreenProps {
  chatTitle: string;
  messages: ChatMessage[];
  onBack: () => void;
  onSendMessage: (text: string) => void;
}

const MessageBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const bubbleRadius = message.isMine
    ? '20px 20px 6px 20px'
    : '20px 20px 20px 6px';

  return (
    <div
      className={`animate-message-in flex w-full ${
        message.isMine ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className="max-w-[290px] px-3.5 py-2.5 backdrop-blur-xl"
        style={{
          borderRadius: bubbleRadius,
          background: message.isMine
            ? 'linear-gradient(135deg, rgba(51, 144, 236, 0.75), rgba(29, 78, 216, 0.85))'
            : 'linear-gradient(180deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.11))',
          border: `1px solid rgba(255, 255, 255, ${message.isMine ? 0.35 : 0.22})`,
          boxShadow: '0 6px 20px -6px rgba(0, 0, 0, 0.35)',
        }}
      >
        <p className="text-[15px] leading-snug break-words text-white">
          {message.text}
        </p>
        <div className="mt-1 text-right text-[11px] text-white/65">
          {message.time}
        </div>
      </div>
    </div>
  );
};

export const ChatDetailScreen: React.FC<ChatDetailScreenProps> = ({
  chatTitle,
  messages,
  onBack,
  onSendMessage,
}) => {
  const [inputText, setInputText] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef<number>(messages.length);

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (messages.length > prevCountRef.current) {
      listRef.current?.scrollTo({
        top: listRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
    prevCountRef.current = messages.length;
  }, [messages.length]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Status bar clock tap zone (iOS Scroll-to-Top gesture) */}
      <StatusBarClockTapZone onScrollToTop={scrollToTop} />

      {/* Top Glass Chat Header */}
      <div className="px-3 py-1.5">
        <GlassContainer radius="26px" glassAlpha={0.18} borderAlpha={0.28}>
          <div className="flex items-center px-2 py-2">
            <button
              type="button"
              onClick={onBack}
              aria-label="Назад"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-white transition hover:bg-white/10 active:scale-90"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            <div
              className="ml-0.5 flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{
                background: 'linear-gradient(135deg, #3390EC, #6366F1)',
              }}
            >
              {chatTitle.slice(0, 1).toUpperCase()}
            </div>

            <div className="ml-2.5 min-w-0 flex-1">
              <div className="truncate text-[16px] leading-tight font-semibold text-white">
                {chatTitle}
              </div>
              <div className="text-[12px] text-[#60A5FA]">в сети</div>
            </div>

            <div className="mr-1 shrink-0">
              <InteractiveClockPill onClick={scrollToTop} />
            </div>
          </div>
        </GlassContainer>
      </div>

      {/* Messages Feed */}
      <div
        ref={listRef}
        className="glass-scroll flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3.5 py-3"
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </div>

      {/* Bottom Floating Glass Pill Composer */}
      <div className="px-3 pt-1.5 pb-3">
        <GlassContainer radius="30px" glassAlpha={0.18} borderAlpha={0.32}>
          <div className="flex items-center px-2.5 py-1.5">
            <button
              type="button"
              aria-label="Вложение"
              onClick={() => {}}
              className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white active:scale-90"
            >
              <Paperclip className="h-5 w-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Сообщение..."
              className="mx-1 min-w-0 flex-1 bg-transparent py-2 text-[15px] text-white placeholder-white/50 outline-none"
            />

            <button
              type="button"
              onClick={handleSend}
              aria-label="Отправить"
              className="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-md transition-transform hover:brightness-110 active:scale-90"
              style={{
                background: 'linear-gradient(135deg, #3390EC, #2563EB)',
              }}
            >
              <Send className="h-[18px] w-[18px] -translate-x-[1px] translate-y-[0.5px]" />
            </button>
          </div>
        </GlassContainer>
      </div>
    </div>
  );
};
