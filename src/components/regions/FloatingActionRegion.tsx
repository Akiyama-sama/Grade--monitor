import { memo } from 'react';
import { Settings } from 'lucide-react';

export const FloatingActionRegion = memo(() => (
  <button className="fixed bottom-24 right-8 w-14 h-14 rounded-full bg-rui-blue text-rui-dark border border-rui-action-blue/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[80] group">
    <Settings className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
    <div className="absolute right-full mr-4 px-3 py-1.5 rounded-[12px] bg-rui-surface-strong border border-rui-divider/60 text-rui-dark text-xs font-display font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
      快速配置
    </div>
  </button>
));

FloatingActionRegion.displayName = 'FloatingActionRegion';
