import { memo, type ElementType, type ReactNode } from 'react';
import { AlertTriangle, ChevronRight, Maximize2 } from 'lucide-react';

import type { AlarmItem, MessagePrompt } from './types';

interface SectionHeaderProps {
  title: string;
  icon: ElementType;
  important?: boolean;
  badge?: ReactNode;
  onMore?: () => void;
}

export const SectionHeader = memo(
  ({ title, icon: Icon, important = false, badge, onMore }: SectionHeaderProps) => (
    <div
      className={`flex items-center gap-2 mb-2 p-1.5 rounded-[12px] transition-colors ${important ? 'bg-rui-surface-strong' : 'bg-transparent'}`}
    >
      <div
        className={`p-1.5 rounded-[12px] ${important ? 'bg-rui-blue text-rui-dark' : 'bg-rui-surface-strong text-rui-slate'}`}
      >
        <Icon className="w-3.5 h-3.5" />
      </div>
      <h3
        className={`text-[13px] font-display font-medium tracking-tight ${important ? 'text-rui-dark' : 'text-rui-slate'}`}
      >
        {title}
      </h3>
      <div className="flex-1" />
      <div className="flex items-center gap-2">
        {badge}
        {onMore && (
          <button
            onClick={onMore}
            className="flex items-center gap-1 text-[10px] font-display font-medium text-rui-dark transition-colors px-2.5 py-1 rounded-[9999px] bg-rui-blue/10 border border-rui-blue/20 hover:bg-rui-blue/15"
          >
            {title.includes('厚度') ? '详情' : '更多'}
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  ),
);

SectionHeader.displayName = 'SectionHeader';

export const AlarmItemCard = memo(({ item }: { item: AlarmItem }) => {
  const isDanger = item.status === 'danger' || item.system > 0;
  const colorClass = isDanger
    ? 'bg-rui-danger/10 border-rui-danger/25'
    : 'bg-rui-surface-strong border-rui-divider/40';
  const textColorClass = isDanger ? 'text-rui-danger' : 'text-rui-dark';
  const accentColorClass = 'text-rui-danger';

  return (
    <div className={`p-3 rounded-[20px] border transition-all ${colorClass}`}>
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[13px] font-display font-medium tracking-tight ${textColorClass}`}>
          {item.name}
        </span>
        {isDanger && <AlertTriangle className={`w-3.5 h-3.5 ${accentColorClass}`} />}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[9px] text-rui-slate font-display font-medium uppercase tracking-wider mb-0.5">
            系统
          </div>
          <div
            className={`text-base font-display font-medium tabular-nums ${item.system > 0 ? accentColorClass : 'text-rui-dark'}`}
          >
            {item.system}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-rui-slate font-display font-medium uppercase tracking-wider mb-0.5">
            复核
          </div>
          <div className="text-base font-display font-medium tabular-nums text-rui-dark">
            {item.review}
          </div>
        </div>
      </div>
    </div>
  );
});

AlarmItemCard.displayName = 'AlarmItemCard';

export const InfoStreamItem = memo(({ msg }: { msg: MessagePrompt }) => (
  <div className="flex gap-3 items-start p-2 rounded-[12px] hover:bg-rui-surface-strong transition-colors">
    <span className="text-[10px] text-rui-gray font-sans mt-0.5">{msg.time}</span>
    <p
      className={`text-[12px] font-sans leading-relaxed ${msg.type === 'danger' ? 'text-rui-danger font-medium' : 'text-rui-slate'}`}
    >
      {msg.content}
    </p>
  </div>
));

InfoStreamItem.displayName = 'InfoStreamItem';

export const PinnedAlert = memo(({ content }: { content: string }) => (
  <div className="bg-rui-danger/12 text-rui-danger p-4 rounded-[20px] border border-rui-danger/25 flex items-center gap-3 mb-4">
    <AlertTriangle className="w-5 h-5 shrink-0" />
    <span className="text-[13px] font-display font-medium leading-tight">{content}</span>
  </div>
));

PinnedAlert.displayName = 'PinnedAlert';

interface VideoFeedProps {
  id?: string;
  title: string;
  icon: ElementType;
  src: string;
}

export const VideoFeed = memo(({ title, icon: Icon, src }: VideoFeedProps) => (
  <div className="relative bg-rui-overlay rounded-[20px] overflow-hidden border border-rui-divider/60 group w-full flex-1 min-h-0 mx-auto">
    <img
      src={src}
      alt={title}
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-rui-overlay/80 via-transparent to-rui-overlay/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="absolute top-3 left-3 flex items-center gap-2">
      <div className="px-2 py-1 rounded-[12px] bg-rui-overlay/80 backdrop-blur-md border border-rui-divider/60 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-rui-blue" />
        <span className="text-[11px] font-display font-medium text-rui-dark tracking-wide uppercase">
          {title}
        </span>
      </div>
      <div className="px-2.5 py-1 rounded-[9999px] bg-rui-blue text-[10px] font-display font-medium text-rui-dark uppercase tracking-wider">
        LIVE 720P
      </div>
    </div>

    <div className="absolute bottom-3 right-3 flex items-center gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
      <button className="p-2 rounded-[12px] bg-rui-overlay/80 backdrop-blur-md border border-rui-divider/60 text-rui-dark hover:bg-rui-overlay transition-colors">
        <Maximize2 className="w-4 h-4" />
      </button>
    </div>

    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(17,20,24,0)_50%,rgba(17,20,24,0.35)_50%)] bg-[length:100%_2px]" />
  </div>
));

VideoFeed.displayName = 'VideoFeed';

export const BackgroundAccents = memo(() => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-rui-white">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-rui-blue/4 blur-[140px] rounded-full" />
    <div className="absolute bottom-[-12%] left-[-10%] w-[40%] h-[40%] bg-rui-teal/4 blur-[120px] rounded-full" />
  </div>
));

BackgroundAccents.displayName = 'BackgroundAccents';
