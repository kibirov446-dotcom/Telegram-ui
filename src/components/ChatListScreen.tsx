import React, { useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import { ChatPreview } from '../types';
import { GlassContainer } from './GlassContainer';
import { InteractiveClockPill, StatusBarClockTapZone } from './ClockControls';

interface ChatListScreenProps {
  chats: ChatPreview[];
  onChatClick: (chat: ChatPreview) => void;
}

export const ChatListScreen: React.FC<ChatListScreenProps> = ({
  chats,
  onChatClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const listRef = useRef<HTMLDivElement>(null);

  const scrollToTop = () => {
    listRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredChats = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return chats;
    return chats.filter(
      (chat) =>
        chat.title.toLowerCase().includes(q) ||
        chat.subtitle.toLowerCase().includes(q)
    );
  }, [chats, searchQuery]);

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Status bar clock tap zone (iOS Scroll-to-Top gesture) */}
      <StatusBarClockTapZone onScrollToTop={scrollToTop} />

      <div className="flex min-h-0 flex-1 flex-col px-3.5 pt-1.5">
        {/* Floating iOS 26 Glass Header */}
        <GlassContainer radius="28px" glassAlpha={0.16} borderAlpha={0.28}>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-[24px] leading-tight font-bold tracking-tight text-white">
                Telegram Glass
              </h1>
              <InteractiveClockPill onClick={scrollToTop} />
            </div>

            {/* Glass Search Bar */}
            <div className="mt-3">
              <GlassContainer radius="18px" glassAlpha={0.1} borderAlpha={0.18}>
                <div className="flex items-center gap-2 px-3 py-2.5">
                  <Search className="h-5 w-5 shrink-0 text-white/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск сообщений и чатов..."
                    className="w-full bg-transparent text-[15px] text-white placeholder-white/60 outline-none"
                  />
                  {searchQuery.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      aria-label="Очистить поиск"
                      className="cursor-pointer rounded-full p-0.5 text-white/60 transition hover:bg-white/10 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </GlassContainer>
            </div>
          </div>
        </GlassContainer>

        {/* Scrollable Chat Cards */}
        <div
          ref={listRef}
          className="glass-scroll mt-3.5 flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto pb-6"
        >
          {filteredChats.length === 0 ? (
            <div className="py-12 text-center text-sm text-white/55">
              Ничего не найдено по запросу «{searchQuery}»
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => onChatClick(chat)}
                className="w-full cursor-pointer text-left transition-transform duration-150 active:scale-[0.985]"
              >
                <GlassContainer
                  radius="24px"
                  glassAlpha={0.14}
                  borderAlpha={0.28}
                  className="hover:brightness-110"
                >
                  <div className="flex items-center px-3.5 py-3">
                    {/* Gradient Circular Avatar */}
                    <div
                      className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full text-[18px] font-bold text-white shadow-md"
                      style={{
                        background: `linear-gradient(135deg, ${chat.avatarColors[0]}, ${chat.avatarColors[1]})`,
                      }}
                    >
                      {chat.initials}
                    </div>

                    <div className="ml-3 min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-[16px] font-semibold text-white">
                          {chat.title}
                        </span>
                        <span className="shrink-0 text-[12px] text-white/55">
                          {chat.time}
                        </span>
                      </div>

                      <div className="mt-1 flex items-center justify-between gap-2">
                        <p className="truncate text-[14px] text-white/72">
                          {chat.subtitle}
                        </p>
                        {chat.unreadCount > 0 && (
                          <span className="shrink-0 rounded-full bg-[#3390EC] px-2 py-0.5 text-[12px] leading-tight font-bold text-white">
                            {chat.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassContainer>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
