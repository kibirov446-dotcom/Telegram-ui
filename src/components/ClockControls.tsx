import React, { useEffect, useState } from 'react';
import { Lock, Wifi } from 'lucide-react';
import { GlassContainer } from './GlassContainer';

function useCurrentTime(): string {
  const formatNow = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [time, setTime] = useState<string>(formatNow);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setTime(formatNow());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return time;
}

interface ScrollTriggerProps {
  onScrollToTop: () => void;
}

export const StatusBarClockTapZone: React.FC<ScrollTriggerProps> = ({
  onScrollToTop,
}) => {
  const currentTime = useCurrentTime();

  return (
    <button
      type="button"
      onClick={onScrollToTop}
      title="Нажмите на часы, чтобы прокрутить наверх"
      aria-label="Прокрутить список наверх"
      className="group relative z-30 flex h-9 w-full shrink-0 cursor-pointer items-center justify-between px-6 pt-1 text-xs font-semibold tracking-tight text-white/90 transition-opacity active:opacity-60"
    >
      <span className="flex items-center gap-1.5 rounded-full px-2 py-0.5 transition-colors group-hover:bg-white/10">
        {currentTime}
      </span>

      {/* Subtle Dynamic Island / Status Bar notch pill */}
      <span className="h-4 w-20 rounded-full bg-black/50 ring-1 ring-white/10 backdrop-blur-md" />

      <span className="flex items-center gap-1.5 text-white/80">
        <span className="flex items-end gap-[1.5px]">
          <span className="h-1.5 w-[2px] rounded-full bg-white/85" />
          <span className="h-2 w-[2px] rounded-full bg-white/85" />
          <span className="h-2.5 w-[2px] rounded-full bg-white/85" />
          <span className="h-3 w-[2px] rounded-full bg-white/40" />
        </span>
        <Wifi className="h-3.5 w-3.5" />
        <span className="flex h-2.5 w-5 items-center rounded-[3px] border border-white/60 p-[1px]">
          <span className="h-full w-3/4 rounded-[1px] bg-white/90" />
        </span>
      </span>
    </button>
  );
};

interface InteractiveClockPillProps {
  onClick: () => void;
}

export const InteractiveClockPill: React.FC<InteractiveClockPillProps> = ({
  onClick,
}) => {
  const currentTime = useCurrentTime();

  return (
    <button
      type="button"
      onClick={onClick}
      title="Прокрутить наверх"
      className="cursor-pointer rounded-full transition-transform duration-150 active:scale-95"
    >
      <GlassContainer
        radius="9999px"
        glassAlpha={0.22}
        borderAlpha={0.35}
        className="hover:brightness-110"
      >
        <div className="flex items-center gap-1.5 px-3 py-1.5">
          <span className="text-[13px] font-semibold text-white tabular-nums">
            {currentTime}
          </span>
          <Lock className="h-3.5 w-3.5 text-[#60A5FA]" />
        </div>
      </GlassContainer>
    </button>
  );
};
