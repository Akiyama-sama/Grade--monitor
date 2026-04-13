import { memo, useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

import { MONITORING_POINTS } from '../dashboard/constants';

const DigitalClock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right shrink-0">
      <div className="text-[9px] text-rui-gray font-display font-medium mb-0.5 uppercase tracking-wider">
        Current Time
      </div>
      <span className="text-sm font-display font-medium text-rui-dark leading-none tabular-nums">
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </span>
    </div>
  );
});

DigitalClock.displayName = 'DigitalClock';

const MonitoringSwitcher = memo(
  ({ activeId, onSelect }: { activeId: string; onSelect: (id: string) => void }) => (
    <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar px-4">
      {MONITORING_POINTS.map((point) => (
        <button
          key={point.id}
          onClick={() => onSelect(point.id)}
          className={`flex items-center gap-3 px-4 py-1.5 rounded-[9999px] border transition-all shrink-0 ${
            activeId === point.id
              ? 'bg-rui-blue/12 border-rui-blue/35 text-rui-dark'
              : point.status === 'warning'
                ? 'bg-rui-danger/10 border-rui-danger/25 text-rui-dark'
                : 'bg-rui-surface-strong border-rui-divider/60 text-rui-slate hover:bg-rui-surface hover:border-rui-divider-strong'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${
              activeId === point.id
                ? 'bg-rui-blue'
                : point.status === 'warning'
                  ? 'bg-rui-danger animate-pulse'
                  : 'bg-rui-gray'
            }`}
          />
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-display font-medium tracking-tight whitespace-nowrap">
              {point.name}
            </span>
            <span
              className={`text-[11px] font-display font-medium opacity-60 whitespace-nowrap ${activeId === point.id ? 'text-rui-blue' : 'text-rui-slate'}`}
            >
              {point.plate}
            </span>
          </div>
          {point.status === 'warning' && (
            <span className="px-1.5 py-0.5 rounded-[9999px] bg-rui-danger/10 text-[9px] font-display font-medium uppercase tracking-wider text-rui-danger">
              预警
            </span>
          )}
        </button>
      ))}
    </div>
  ),
);

MonitoringSwitcher.displayName = 'MonitoringSwitcher';

interface TopBarRegionProps {
  activePointId: string;
  onPointSelect: (id: string) => void;
}

export const TopBarRegion = memo(({ activePointId, onPointSelect }: TopBarRegionProps) => {
  const [showNav, setShowNav] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('图像监控大屏');

  const screens = ['图像监控大屏', '排队区大屏', '监控点总览'];

  return (
    <header className="h-12 border-b border-rui-divider/60 flex items-center px-6 bg-rui-surface z-50 shrink-0 relative">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[12px] bg-rui-surface-strong flex items-center justify-center border border-rui-divider/60">
            <span className="text-[10px] font-display font-medium text-rui-blue">LOGO</span>
          </div>
          <div className="h-6 w-px bg-rui-divider/60 mx-1" />
          <div className="relative">
            <button onClick={() => setShowNav(!showNav)} className="flex items-center gap-2 group">
              <span className="text-xl font-display font-medium text-rui-dark tracking-[-0.03em] group-hover:text-rui-blue transition-colors">
                {currentScreen}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-rui-slate transition-transform ${showNav ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showNav && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-rui-surface-strong border border-rui-divider/70 rounded-[20px] z-[60] overflow-hidden"
                >
                  {screens.map((screen) => (
                    <button
                      key={screen}
                      onClick={() => {
                        setCurrentScreen(screen);
                        setShowNav(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-display font-medium transition-colors ${
                        currentScreen === screen
                          ? 'bg-rui-blue/10 text-rui-dark'
                          : 'text-rui-slate hover:bg-rui-surface'
                      }`}
                    >
                      {screen}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="h-6 w-px bg-rui-divider/60 mx-6 shrink-0" />

      <MonitoringSwitcher activeId={activePointId} onSelect={onPointSelect} />

      <div className="h-6 w-px bg-rui-divider/60 mx-6 shrink-0" />

      <DigitalClock />
    </header>
  );
});

TopBarRegion.displayName = 'TopBarRegion';
