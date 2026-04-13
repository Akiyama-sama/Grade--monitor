/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, memo, useMemo, useCallback } from 'react';
import { 
  Activity, 
  AlertTriangle, 
  Maximize2, 
  ShieldAlert,
  BarChart3,
  Image as ImageIcon,
  Truck,
  Package,
  Clock,
  ChevronRight,
  Info,
  Scan,
  Zap,
  ChevronDown,
  LogOut,
  Settings,
  CheckCircle2,
  LayoutGrid
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip,
  AreaChart,
  Area,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface AlarmItem {
  id: string;
  name: string;
  system: number;
  review: number | string;
  status: 'normal' | 'warning' | 'danger';
  category: 'seal' | 'return';
}

interface MessagePrompt {
  id: string;
  time: string;
  content: string;
  type: 'info' | 'warning' | 'danger';
}

interface GradingData {
  name: string;
  value: number;
  color: string;
  subItems?: { name: string; value: number }[];
}

interface DeductionItem {
  name: string;
  value: number;
  unit: string;
}

// --- Mock Data ---

const CHART_COLORS = {
  blue: 'var(--color-rui-blue)',
  actionBlue: 'var(--color-rui-action-blue)',
  teal: 'var(--color-rui-teal)',
  warning: 'var(--color-rui-warning)',
  pink: 'var(--color-rui-pink)',
  brown: 'var(--color-rui-brown)',
  green: 'var(--color-rui-green)',
  divider: 'var(--color-rui-divider)',
  gray: 'var(--color-rui-gray)',
} as const;

const ALARM_DATA: AlarmItem[] = [
  { id: '1', name: '气罐密封件', system: 1, review: 1, status: 'danger', category: 'seal' },
  { id: '2', name: '箱体密封件', system: 2, review: '-', status: 'danger', category: 'seal' },
  { id: '3', name: '退货件A', system: 0, review: '-', status: 'normal', category: 'return' },
  { id: '4', name: '拆车件密封件', system: 0, review: '-', status: 'normal', category: 'seal' },
  { id: '5', name: '阀门密封件', system: 0, review: '-', status: 'normal', category: 'seal' },
  { id: '6', name: '退货件B', system: 5, review: '-', status: 'danger', category: 'return' },
];

const PROMPT_MESSAGES: MessagePrompt[] = [
  { id: '1', time: '23:34:23', content: '触发“扣杂量超标”退货提醒', type: 'danger' },
  { id: '2', time: '23:34:23', content: '表层区域计算成功！！！', type: 'info' },
  { id: '3', time: '23:34:23', content: '触发“扣杂量超标”退货提醒', type: 'danger' },
];

const THICKNESS_DATA: GradingData[] = [
  { 
    name: '6-10mm', value: 50, color: CHART_COLORS.blue,
    subItems: [
      { name: '大圆管', value: 24.5 },
      { name: '大方管', value: 25.5 }
    ]
  },
  { 
    name: '3-6mm', value: 30, color: CHART_COLORS.actionBlue,
    subItems: [
      { name: '电机壳', value: 10 },
      { name: '镀锌板', value: 15 },
      { name: '皮带轮', value: 5 }
    ]
  },
  { 
    name: '1-3mm', value: 15, color: CHART_COLORS.teal,
    subItems: [
      { name: '小车车架', value: 5 },
      { name: '前后桥壳', value: 3 },
      { name: '减震器', value: 2 },
      { name: '两轮车车圈', value: 5 }
    ]
  },
  { 
    name: '0-1mm', value: 5, color: CHART_COLORS.warning,
    subItems: [
      { name: '钢丝', value: 3 },
      { name: '广告牌', value: 2 }
    ]
  },
];

const MATERIAL_DATA: GradingData[] = [
  { name: '钢筋类', value: 40.5, color: CHART_COLORS.blue },
  { name: '边角料', value: 29.5, color: CHART_COLORS.actionBlue },
  { name: '破碎料', value: 10, color: CHART_COLORS.teal },
  { name: '拆车件', value: 10, color: CHART_COLORS.warning },
  { name: '压块', value: 5, color: CHART_COLORS.pink },
  { name: '钢屑', value: 5, color: CHART_COLORS.brown },
  { name: '特级料', value: 0, color: CHART_COLORS.green },
  { name: '重废1', value: 0, color: CHART_COLORS.blue },
  { name: '重废2', value: 0, color: CHART_COLORS.actionBlue },
  { name: '中废1', value: 0, color: CHART_COLORS.teal },
  { name: '中废2', value: 0, color: CHART_COLORS.warning },
  { name: '中废3', value: 0, color: CHART_COLORS.pink },
  { name: '轻废1', value: 0, color: CHART_COLORS.brown },
  { name: '轻废2', value: 0, color: CHART_COLORS.green },
  { name: '轻废3', value: 0, color: CHART_COLORS.blue },
  { name: '轻薄4', value: 0, color: CHART_COLORS.actionBlue },
];

const DEDUCTION_DATA: DeductionItem[] = [
  { name: '基础扣杂', value: 1.2, unit: 'kg' },
  { name: '碎渣扣杂', value: 45, unit: 'kg' },
  { name: '土杂扣杂', value: 12, unit: 'kg' },
  { name: '油污扣杂', value: 0.1, unit: 'kg' },
  { name: '锈蚀扣杂', value: 0.2, unit: 'kg' },
  { name: '水杂扣杂', value: 0.4, unit: 'kg' },
];

const DEDUCTION_TOTAL = {
  value: 146,
  unit: 'kg',
};

const GALLERY_DATA = [
  {
    id: 'slide-1',
    images: [
      'https://picsum.photos/seed/scrap_1/800/600',
      'https://picsum.photos/seed/scrap_2/800/600',
      'https://picsum.photos/seed/scrap_3/800/600',
      'https://picsum.photos/seed/scrap_4/800/600',
    ]
  },
  {
    id: 'slide-2',
    images: [
      'https://picsum.photos/seed/scrap_5/800/600',
      'https://picsum.photos/seed/scrap_6/800/600',
      'https://picsum.photos/seed/scrap_7/800/600',
      'https://picsum.photos/seed/scrap_8/800/600',
    ]
  },
  {
    id: 'slide-3',
    images: [
      'https://picsum.photos/seed/scrap_9/800/600',
      'https://picsum.photos/seed/scrap_10/800/600',
      'https://picsum.photos/seed/scrap_11/800/600',
      'https://picsum.photos/seed/scrap_12/800/600',
    ]
  }
];

const BASIC_INFO = {
  plateNumber: '冀A·88888',
  supplier: '河北某某再生资源有限公司',
  grossWeight: '45.28',
  cargoName: '重废2#',
  grossWeightTime: '2026-03-20 08:15:22',
  swipeTime: '2026-02-10 09:12:34',
  elapsedMinutes: '--'
};

const MONITORING_POINTS = [
  { id: '1', name: '1#监控点', plate: '冀B·1567K', status: 'normal' },
  { id: '2', name: '2#监控点', plate: '豫N·3205Q', status: 'normal' },
  { id: '3', name: '3#监控点', plate: '鲁H·7281M', status: 'normal' },
  { id: '4', name: '4#监控点', plate: '冀A·88888', status: 'warning' },
  { id: '5', name: '5#监控点', plate: '晋L·6624T', status: 'normal' },
  { id: '6', name: '6#监控点', plate: '皖S·9031P', status: 'normal' },
  { id: '7', name: '7#监控点', plate: '苏C·5178X', status: 'normal' },
];

// --- Optimized Sub-Components ---

const DigitalClock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right shrink-0">
      <div className="text-[9px] text-rui-gray font-display font-medium mb-0.5 uppercase tracking-wider">Current Time</div>
      <span className="text-sm font-display font-medium text-rui-dark leading-none tabular-nums">
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </span>
    </div>
  );
});

DigitalClock.displayName = 'DigitalClock';

const MonitoringSwitcher = memo(({ activeId, onSelect }: { activeId: string, onSelect: (id: string) => void }) => (
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
        <div className={`w-1.5 h-1.5 rounded-full ${
          activeId === point.id ? 'bg-rui-blue' : point.status === 'warning' ? 'bg-rui-danger animate-pulse' : 'bg-rui-gray'
        }`} />
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-display font-medium tracking-tight whitespace-nowrap">{point.name}</span>
          <span className={`text-[11px] font-display font-medium opacity-60 whitespace-nowrap ${activeId === point.id ? 'text-rui-blue' : 'text-rui-slate'}`}>
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
));

MonitoringSwitcher.displayName = 'MonitoringSwitcher';

const TopBar = memo(({ activePointId, onPointSelect }: { activePointId: string, onPointSelect: (id: string) => void }) => {
  const [showNav, setShowNav] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('图像监控大屏');

  const screens = ['图像监控大屏', '排队区大屏', '监控点总览'];

  return (
    <header className="h-12 border-b border-rui-divider/60 flex items-center px-6 bg-rui-surface z-50 shrink-0 relative">
      <div className="flex items-center gap-4 shrink-0">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-[12px] bg-rui-surface-strong flex items-center justify-center border border-rui-divider/60">
            <span className="text-[10px] font-display font-medium text-rui-blue">LOGO</span>
          </div>
          <div className="h-6 w-px bg-rui-divider/60 mx-1" />
          <div className="relative">
            <button 
              onClick={() => setShowNav(!showNav)}
              className="flex items-center gap-2 group"
            >
              <span className="text-xl font-display font-medium text-rui-dark tracking-[-0.03em] group-hover:text-rui-blue transition-colors">
                {currentScreen}
              </span>
              <ChevronDown className={`w-4 h-4 text-rui-slate transition-transform ${showNav ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showNav && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-rui-surface-strong border border-rui-divider/70 rounded-[20px] z-[60] overflow-hidden"
                >
                  {screens.map(screen => (
                    <button
                      key={screen}
                      onClick={() => {
                        setCurrentScreen(screen);
                        setShowNav(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-sm font-display font-medium transition-colors ${
                        currentScreen === screen ? 'bg-rui-blue/10 text-rui-dark' : 'text-rui-slate hover:bg-rui-surface'
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

TopBar.displayName = 'TopBar';

const SectionHeader = memo(({ title, icon: Icon, important = false, badge, onMore }: { title: string, icon: any, important?: boolean, badge?: React.ReactNode, onMore?: () => void }) => (
  <div className={`flex items-center gap-2 mb-2 p-1.5 rounded-[12px] transition-colors ${important ? 'bg-rui-surface-strong' : 'bg-transparent'}`}>
    <div className={`p-1.5 rounded-[12px] ${important ? 'bg-rui-blue text-rui-dark' : 'bg-rui-surface-strong text-rui-slate'}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <h3 className={`text-[13px] font-display font-medium tracking-tight ${important ? 'text-rui-dark' : 'text-rui-slate'}`}>
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
));

SectionHeader.displayName = 'SectionHeader';

const DataBox = memo(({ label, value, unit, color = "text-rui-dark" }: { label: string, value: string | number, unit?: string, color?: string }) => (
  <div className="flex flex-col relative pl-3 group">
    <span className="text-[11px] text-rui-slate font-sans tracking-[0.02em] mb-0.5 transition-colors">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-display font-medium tabular-nums tracking-[-0.03em] transition-all duration-300 ${color}`}>{value}</span>
      {unit && <span className="text-[11px] text-rui-gray font-sans font-medium">{unit}</span>}
    </div>
  </div>
));

DataBox.displayName = 'DataBox';

const AlarmItemCard = memo(({ item }: { item: AlarmItem }) => {
  const isDanger = item.status === 'danger' || item.system > 0;
  const colorClass = isDanger ? 'bg-rui-danger/10 border-rui-danger/25' : 'bg-rui-surface-strong border-rui-divider/40';
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
          <div className="text-[9px] text-rui-slate font-display font-medium uppercase tracking-wider mb-0.5">系统</div>
          <div className={`text-base font-display font-medium tabular-nums ${item.system > 0 ? accentColorClass : 'text-rui-dark'}`}>{item.system}</div>
        </div>
        <div className="text-right">
          <div className="text-[9px] text-rui-slate font-display font-medium uppercase tracking-wider mb-0.5">复核</div>
          <div className="text-base font-display font-medium tabular-nums text-rui-dark">{item.review}</div>
        </div>
      </div>
    </div>
  );
});

AlarmItemCard.displayName = 'AlarmItemCard';

const InfoStreamItem = memo(({ msg }: { msg: MessagePrompt }) => (
  <div className="flex gap-3 items-start p-2 rounded-[12px] hover:bg-rui-surface-strong transition-colors">
    <span className="text-[10px] text-rui-gray font-sans mt-0.5">{msg.time}</span>
    <p className={`text-[12px] font-sans leading-relaxed ${msg.type === 'danger' ? 'text-rui-danger font-medium' : 'text-rui-slate'}`}>
      {msg.content}
    </p>
  </div>
));

InfoStreamItem.displayName = 'InfoStreamItem';

const PinnedAlert = memo(({ content }: { content: string }) => (
  <div className="bg-rui-danger/12 text-rui-danger p-4 rounded-[20px] border border-rui-danger/25 flex items-center gap-3 mb-4">
    <AlertTriangle className="w-5 h-5 shrink-0" />
    <span className="text-[13px] font-display font-medium leading-tight">{content}</span>
  </div>
));

PinnedAlert.displayName = 'PinnedAlert';

const VideoFeed = memo(({ id, title, icon: Icon, src }: { id: string, title: string, icon: any, src: string }) => (
  <div className="relative bg-rui-overlay rounded-[20px] overflow-hidden border border-rui-divider/60 group w-full flex-1 min-h-0 mx-auto">
    <img 
      src={src} 
      alt={title} 
      className="w-full h-full object-contain"
      referrerPolicy="no-referrer"
    />
    {/* Overlay UI */}
    <div className="absolute inset-0 bg-gradient-to-t from-rui-overlay/80 via-transparent to-rui-overlay/35 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    
    <div className="absolute top-3 left-3 flex items-center gap-2">
      <div className="px-2 py-1 rounded-[12px] bg-rui-overlay/80 backdrop-blur-md border border-rui-divider/60 flex items-center gap-2">
        <Icon className="w-3.5 h-3.5 text-rui-blue" />
        <span className="text-[11px] font-display font-medium text-rui-dark tracking-wide uppercase">{title}</span>
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

    {/* Scanline Effect */}
    <div className="absolute inset-0 pointer-events-none opacity-[0.02] bg-[linear-gradient(rgba(17,20,24,0)_50%,rgba(17,20,24,0.35)_50%)] bg-[length:100%_2px]" />
  </div>
));

VideoFeed.displayName = 'VideoFeed';

const AnalysisPanel = memo(({ onShowDetails, onAction }: { onShowDetails: () => void, onAction: (type: 'abnormal' | 'end' | 'leave') => void }) => (
  <div className="col-span-3 bg-rui-surface p-3 flex flex-col border-l border-rui-divider/60 min-h-0 overflow-y-auto custom-scrollbar">
    {/* Basic Information Section */}
    <div className="mb-6">
      <SectionHeader title="基础判级信息" icon={Info} />
      <div className="bg-rui-surface-strong p-4 rounded-[20px] border border-rui-divider/60 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">车牌号码</span>
            <span className="text-[15px] font-display font-medium text-rui-blue tracking-tight">{BASIC_INFO.plateNumber}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">货名</span>
            <span className="text-[15px] font-display font-medium text-rui-dark tracking-tight">{BASIC_INFO.cargoName}</span>
          </div>
        </div>
        
        <div className="flex flex-col pt-3 border-t border-rui-divider/50">
          <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">供货方</span>
          <span className="text-[14px] text-rui-dark font-display font-medium truncate">{BASIC_INFO.supplier}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-rui-divider/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">毛重</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display font-medium text-rui-warning">{BASIC_INFO.grossWeight}</span>
              <span className="text-[10px] text-rui-warning font-display font-medium">t</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">毛重时间</span>
            <span className="text-[13px] text-rui-dark font-display font-medium tabular-nums">{BASIC_INFO.grossWeightTime.split(' ')[1]}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Grading Depth Analysis Section */}
    <div className="flex-1 min-h-0 space-y-6">
      <div className="bg-rui-surface-strong p-4 rounded-[20px] border border-rui-divider/60">
        <SectionHeader title="智能厚度占比" icon={Activity} onMore={onShowDetails} />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={THICKNESS_DATA}
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {THICKNESS_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-display font-medium text-rui-dark">95%</span>
              <span className="text-[7px] text-rui-slate font-display font-medium uppercase tracking-widest">置信度</span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {THICKNESS_DATA.map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-rui-slate font-display">{item.name}</span>
                </div>
                <span className="text-[11px] font-display font-medium text-rui-dark tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-rui-surface-strong p-4 rounded-[20px] border border-rui-divider/60">
        <SectionHeader title="智能料型占比" icon={LayoutGrid} onMore={() => {}} />
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 relative shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MATERIAL_DATA.slice(0, 6)}
                  innerRadius={30}
                  outerRadius={45}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {MATERIAL_DATA.slice(0, 6).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-display font-medium text-rui-dark">6</span>
              <span className="text-[7px] text-rui-slate font-display font-medium uppercase tracking-widest">料型</span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {MATERIAL_DATA.slice(0, 6).map(item => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-rui-slate font-display">{item.name}</span>
                </div>
                <span className="text-[11px] font-display font-medium text-rui-dark tabular-nums">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
));

AnalysisPanel.displayName = 'AnalysisPanel';

const ComprehensiveResults = memo(({ activePointId, onAction }: { activePointId: string, onAction: (type: 'abnormal' | 'end' | 'leave') => void }) => {
  const activePoint = MONITORING_POINTS.find(point => point.id === activePointId);

  return (
    <div className="px-6 py-3 border-b border-rui-divider/60 bg-rui-surface shrink-0">
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,1fr)] xl:gap-5">
        <section className="grid items-start gap-4 xl:grid-cols-[minmax(420px,1.08fr)_minmax(250px,0.92fr)] xl:border-r xl:border-rui-divider/50 xl:pr-5">
          <div className="min-w-0 xl:col-span-2">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="rounded-[9999px] border border-rui-divider/60 bg-rui-surface-strong px-3 py-1 text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-slate">
                {activePoint?.name ?? '当前监控点'}
              </span>
              {activePoint?.status === 'warning' && (
                <span className="rounded-[9999px] border border-rui-warning/20 bg-rui-warning/10 px-3 py-1 text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-warning">
                  待复核
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
              <h2 className="text-[clamp(2.35rem,3vw,3.4rem)] font-display font-medium leading-none tracking-[-0.06em] text-rui-dark">
                判级中
              </h2>
              <div className="pb-1 text-[13px] font-display font-medium tracking-[0.08em] text-rui-blue">
                {BASIC_INFO.plateNumber}
              </div>
            </div>
          </div>

          <div className="border-t border-rui-divider/45 pt-3">
            <div className="flex flex-wrap items-center gap-2 xl:flex-nowrap">
              <button 
                onClick={() => onAction('end')}
                className="btn-pill bg-rui-blue px-4 py-2 text-[13px] whitespace-nowrap text-rui-dark hover:bg-rui-action-blue"
              >
                <span className="flex items-center justify-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  结束判级
                </span>
              </button>
              <button 
                onClick={() => onAction('abnormal')}
                className="btn-pill border-rui-warning/30 bg-rui-warning/10 px-4 py-2 text-[13px] whitespace-nowrap text-rui-warning hover:bg-rui-warning/15"
              >
                <span className="flex items-center justify-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  异常处理
                </span>
              </button>
              <button 
                onClick={() => onAction('leave')}
                className="btn-pill border-rui-divider/60 bg-rui-surface-strong px-4 py-2 text-[13px] whitespace-nowrap text-rui-slate hover:bg-rui-surface-soft"
              >
                <span className="flex items-center justify-center gap-2">
                  <LogOut className="h-4 w-4" />
                  中途离开
                </span>
              </button>
            </div>
          </div>

          <div className="min-w-0 border-t border-rui-divider/40 pt-3 xl:border-t-0 xl:border-l xl:border-rui-divider/40 xl:pl-4">
            <div className="space-y-3">
              <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">智能级别判断</div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-end gap-2">
                  <span className="text-[clamp(2.55rem,3vw,3.65rem)] font-display font-medium leading-none tracking-[-0.06em] text-rui-blue">
                    重2
                  </span>
                  <div className="pb-1 text-[12px] font-sans text-rui-slate">
                    置信度 95%
                  </div>
                </div>
                <div className="text-[11px] font-display font-medium uppercase tracking-[0.22em] text-rui-blue">
                  系统建议
                </div>
              </div>

              <div className="space-y-2">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-display font-medium uppercase tracking-[0.22em]">
                    <span className="text-rui-slate">重1</span>
                    <span className="text-rui-dark">20%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-rui-divider/35">
                    <div className="h-full rounded-full bg-rui-divider-strong" style={{ width: '20%' }} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-display font-medium uppercase tracking-[0.22em]">
                    <span className="text-rui-blue">重2</span>
                    <span className="text-rui-blue">70%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-rui-divider/35">
                    <div className="h-full rounded-full bg-rui-blue" style={{ width: '70%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="min-w-0 border-t border-rui-divider/40 pt-4 xl:border-t-0 xl:pt-0">
          <div className="grid gap-4 xl:grid-cols-[180px_minmax(0,1fr)] xl:items-center">
            <div className="h-[158px] min-h-[158px] rounded-[20px] border border-rui-divider/40 bg-rui-surface-strong/55 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="82%" data={DEDUCTION_DATA}>
                  <PolarGrid stroke={CHART_COLORS.divider} />
                  <PolarAngleAxis dataKey="name" tick={{ fill: CHART_COLORS.gray, fontSize: 10 }} />
                  <Radar
                    name="扣杂"
                    dataKey="value"
                    stroke={CHART_COLORS.pink}
                    fill={CHART_COLORS.pink}
                    fillOpacity={0.22}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="min-w-0 space-y-3">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">智能扣杂雷达</div>
                  <div className="mt-1 text-[12px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    总量与各子项扣杂
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.22em] text-rui-gray">智能扣杂总量</div>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-[clamp(2rem,2.7vw,2.9rem)] font-display font-medium leading-none tracking-[-0.05em] text-rui-pink">
                      {DEDUCTION_TOTAL.value}
                    </span>
                    <span className="pb-0.5 text-[11px] font-display font-medium uppercase tracking-[0.18em] text-rui-pink/70">
                      {DEDUCTION_TOTAL.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {DEDUCTION_DATA.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3 rounded-[12px] border border-rui-divider/35 bg-rui-surface-strong/45 px-3 py-2">
                    <span className="min-w-0 truncate text-[11px] font-display font-medium text-rui-slate">
                      {item.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-display font-medium text-rui-dark">
                      {item.value}
                      {item.unit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
});

ComprehensiveResults.displayName = 'ComprehensiveResults';

const DetailsModal = memo(({ show, onClose }: { show: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-rui-overlay/95 backdrop-blur-xl p-8 overflow-y-auto"
      >
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
              <div className="w-1 h-10 bg-rui-blue rounded-full" />
              <h2 className="text-4xl font-display font-medium text-rui-dark tracking-[-0.04em]">判级深度分析详情</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-rui-surface rounded-[12px] border border-rui-divider/60 transition-colors"
            >
              <Maximize2 className="w-8 h-8 text-rui-slate rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Thickness Details */}
            <div className="bg-rui-surface p-8 rounded-[20px] border border-rui-divider/60">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-5 h-5 text-rui-blue" />
                <span className="text-lg font-display font-medium text-rui-dark uppercase tracking-wider">厚度占比详情</span>
              </div>
              <div className="space-y-8">
                {THICKNESS_DATA.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded-[9999px] bg-rui-surface-strong text-xs font-display font-medium text-rui-dark border border-rui-divider/60">
                          {item.name}
                        </div>
                        <div className="h-1.5 w-48 bg-rui-divider/25 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                          />
                        </div>
                      </div>
                      <span className="text-2xl font-display font-medium text-rui-blue">{item.value}%</span>
                    </div>
                    {item.subItems && (
                      <div className="grid grid-cols-2 gap-4 pl-4 border-l-2 border-rui-divider/30">
                        {item.subItems.map(sub => (
                          <div key={sub.name} className="flex justify-between items-center">
                            <span className="text-xs text-rui-slate font-sans">{sub.name}</span>
                            <span className="text-xs font-display font-medium text-rui-dark">{sub.value}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Material Details */}
            <div className="bg-rui-surface p-8 rounded-[20px] border border-rui-divider/60">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-5 h-5 text-rui-blue" />
                <span className="text-lg font-display font-medium text-rui-dark uppercase tracking-wider">更多料型分布</span>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                {MATERIAL_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-3 bg-rui-surface-strong p-3 rounded-[20px] border border-rui-divider/60">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-display font-medium text-rui-dark">{item.name}</span>
                        <span className="text-xs font-display font-medium text-rui-blue">{item.value}%</span>
                      </div>
                      <div className="h-1 w-full bg-rui-divider/20 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-rui-blue/60" 
                          style={{ width: `${item.value}%` }} 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Impurity Deductions */}
          <div className="mt-8 bg-rui-surface p-8 rounded-[20px] border border-rui-divider/60">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="w-5 h-5 text-rui-danger" />
              <span className="text-lg font-display font-medium text-rui-dark uppercase tracking-wider">扣杂详情分析</span>
            </div>
            <div className="grid grid-cols-6 gap-6">
              {DEDUCTION_DATA.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-6 bg-rui-surface-strong rounded-[20px] border border-rui-divider/60 hover:border-rui-danger/30 transition-colors group">
                  <span className="text-[11px] text-rui-slate font-display font-medium uppercase tracking-wider mb-3 group-hover:text-rui-danger/70 transition-colors">{item.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-display font-medium text-rui-dark group-hover:text-rui-danger transition-colors">{item.value}</span>
                    <span className="text-xs text-rui-gray font-sans">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

DetailsModal.displayName = 'DetailsModal';

const ConfirmationModal = memo(({ show, title, message, onConfirm, onCancel }: { 
  show: boolean, 
  title: string, 
  message: string, 
  onConfirm: () => void, 
  onCancel: () => void 
}) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-rui-overlay/78 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-rui-surface p-8 rounded-[20px] max-w-sm w-full border border-rui-divider/70"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-[12px] bg-rui-warning/10 text-rui-warning border border-rui-warning/20">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-display font-medium text-rui-dark tracking-tight">{title}</h3>
          </div>
          <p className="text-[14px] text-rui-slate mb-8 leading-relaxed font-sans">
            {message}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="btn-pill flex-1 px-4 py-2.5 bg-rui-surface-strong border-rui-divider/60 text-rui-dark hover:bg-rui-surface-soft"
            >
              取消
            </button>
            <button 
              onClick={onConfirm}
              className="btn-pill flex-1 px-4 py-2.5 bg-rui-blue text-rui-dark hover:bg-rui-action-blue"
            >
              确认执行
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
));

ConfirmationModal.displayName = 'ConfirmationModal';

const ImageCarouselModal = memo(({ show, currentSlide, onPrev, onNext, onClose }: { show: boolean, currentSlide: number, onPrev: () => void, onNext: () => void, onClose: () => void }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] bg-rui-overlay/90 backdrop-blur-2xl flex items-center justify-center p-12"
      >
        <button 
          onClick={onClose}
          className="absolute top-12 right-12 p-4 bg-rui-surface rounded-[12px] border border-rui-divider/60 hover:bg-rui-surface-strong transition-colors z-20"
        >
          <Maximize2 className="w-8 h-8 text-rui-slate rotate-45" />
        </button>

        <div className="relative w-full max-w-6xl aspect-[16/10] flex items-center gap-10">
          {/* Prev Button */}
          <button 
            onClick={onPrev}
            className="p-6 bg-rui-surface-strong rounded-[20px] border border-rui-divider/60 hover:bg-rui-surface transition-all group"
          >
            <ChevronRight className="w-10 h-10 text-rui-slate group-hover:text-rui-blue rotate-180" />
          </button>

          {/* Slide Content (4-image grid) */}
          <div className="flex-1 h-full bg-rui-surface rounded-[20px] overflow-hidden p-6 border border-rui-divider/60">
            <div className="grid grid-cols-2 grid-rows-2 gap-6 h-full">
              {GALLERY_DATA[currentSlide].images.map((src, idx) => (
                <div key={idx} className="relative rounded-[20px] overflow-hidden border border-rui-divider/40 group aspect-video">
                  <img 
                    src={src} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-rui-overlay/80 rounded-[9999px] text-[10px] text-rui-dark font-display font-medium uppercase tracking-wider">
                    VIEW_0{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={onNext}
            className="p-6 bg-rui-surface-strong rounded-[20px] border border-rui-divider/60 hover:bg-rui-surface transition-all group"
          >
            <ChevronRight className="w-10 h-10 text-rui-slate group-hover:text-rui-blue" />
          </button>

          {/* Pagination Info */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex items-center gap-6">
            <span className="text-[12px] font-display font-medium text-rui-slate tracking-widest uppercase">
              Batch {currentSlide + 1} / {GALLERY_DATA.length}
            </span>
            <div className="flex gap-2">
              {GALLERY_DATA.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 transition-all rounded-full ${idx === currentSlide ? 'w-12 bg-rui-blue' : 'w-3 bg-rui-divider'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

ImageCarouselModal.displayName = 'ImageCarouselModal';

const ImageSidebar = memo(({ 
  onImageClick 
}: { 
  onImageClick: (slideIdx: number) => void 
}) => (
  <div className="w-48 border-l border-rui-divider/60 bg-rui-surface flex flex-col shrink-0">
    <div className="p-3 border-b border-rui-divider/50 bg-rui-surface-strong">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-rui-blue" />
        <span className="text-[11px] text-rui-dark font-display font-medium uppercase tracking-wider">废钢抓拍图</span>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
      {GALLERY_DATA.map((slide, sIdx) => (
        slide.images.map((img, iIdx) => (
          <div 
            key={`${sIdx}-${iIdx}`} 
            onClick={() => onImageClick(sIdx)}
            className="w-full aspect-[4/3] rounded-[12px] border border-rui-divider/40 overflow-hidden relative group cursor-pointer transition-all hover:border-rui-blue/35"
          >
            <img 
              src={img} 
              className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
              referrerPolicy="no-referrer"
              loading="lazy"
            />
            <div className="absolute bottom-1.5 right-1.5 text-[7px] text-rui-dark font-display font-medium bg-rui-overlay/70 px-1.5 py-0.5 rounded-[9999px] backdrop-blur-sm">
              BATCH_{sIdx+1}
            </div>
          </div>
        ))
      ))}
    </div>
  </div>
));

ImageSidebar.displayName = 'ImageSidebar';

const Footer = memo(() => (
  <footer className="h-12 border-t border-rui-divider/60 px-8 flex items-center justify-between bg-rui-surface relative">
    <div className="flex items-center gap-8 relative z-10">
      <div className="flex items-center gap-2 group cursor-help">
        <div className="w-2 h-2 bg-rui-blue rounded-full" />
        <span className="text-[11px] text-rui-slate font-display font-medium uppercase tracking-wider group-hover:text-rui-dark transition-colors">马钢富圆金属资源有限公司利辛分公司</span>
      </div>
    </div>
    <div className="flex items-center gap-8 text-[11px] text-rui-gray font-display font-medium uppercase tracking-wider relative z-10">
      <span className="hover:text-rui-blue transition-colors cursor-default">Engine: <span className="text-rui-slate">AI_GRADER_PRO_X</span></span>
      <span className="hover:text-rui-blue transition-colors cursor-default">Latency: <span className="text-rui-slate">0.04s</span></span>
      <span className="flex items-center gap-2">
        Status: <span className="text-rui-teal font-medium tracking-widest">Authorized</span>
      </span>
    </div>
  </footer>
));

Footer.displayName = 'Footer';

const BackgroundAccents = memo(() => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden bg-rui-white">
    <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-rui-blue/4 blur-[140px] rounded-full" />
    <div className="absolute bottom-[-12%] left-[-10%] w-[40%] h-[40%] bg-rui-teal/4 blur-[120px] rounded-full" />
  </div>
));

BackgroundAccents.displayName = 'BackgroundAccents';

export default function App() {
  const [activePointId, setActivePointId] = useState('4');
  const [showDetails, setShowDetails] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    action: () => void;
  }>({
    show: false,
    title: '',
    message: '',
    action: () => {}
  });

  const handleShowDetails = useCallback(() => setShowDetails(true), []);
  const handleCloseDetails = useCallback(() => setShowDetails(false), []);
  const handleOpenImageModal = useCallback((slideIdx: number) => {
    setCurrentSlide(slideIdx);
    setShowImageModal(true);
  }, []);
  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handlePrevSlide = useCallback(() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : GALLERY_DATA.length - 1)), []);
  const handleNextSlide = useCallback(() => setCurrentSlide(prev => (prev < GALLERY_DATA.length - 1 ? prev + 1 : 0)), []);

  const handleAction = useCallback((type: 'abnormal' | 'end' | 'leave') => {
    if (type === 'abnormal') {
      setConfirmModal({
        show: true,
        title: '确认标记异常',
        message: '是否确认将当前车次标记为“异常车次”？标记后系统将记录异常状态并通知相关人员。',
        action: () => {
          console.log('Marked as abnormal');
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      });
    } else if (type === 'end') {
      setConfirmModal({
        show: true,
        title: '确认结束判级',
        message: '是否确认结束当前车次的判级流程？结束后将生成最终判级报告，无法再次修改。',
        action: () => {
          console.log('Grading ended');
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      });
    } else if (type === 'leave') {
      setConfirmModal({
        show: true,
        title: '确认中途离开',
        message: '是否确认中途离开当前判级任务？系统将保存当前进度，您可以稍后继续。',
        action: () => {
          console.log('Left midway');
          setConfirmModal(prev => ({ ...prev, show: false }));
        }
      });
    }
  }, []);

  const sortedAlarms = useMemo(() => {
    const hasTriggered = ALARM_DATA.some(item => item.system > 0);
    if (hasTriggered) {
      return [...ALARM_DATA].sort((a, b) => b.system - a.system);
    }
    return [...ALARM_DATA].sort((a, b) => {
      if (a.category === 'seal' && b.category === 'return') return -1;
      if (a.category === 'return' && b.category === 'seal') return 1;
      return 0;
    });
  }, []);

  return (
    <div className="h-screen bg-rui-white text-rui-dark font-sans selection:bg-rui-blue/20 overflow-hidden flex flex-col">
      
      {/* Details Modal */}
      <DetailsModal show={showDetails} onClose={handleCloseDetails} />

      {/* Image Detail Carousel Modal */}
      <ImageCarouselModal 
        show={showImageModal} 
        currentSlide={currentSlide}
        onPrev={handlePrevSlide}
        onNext={handleNextSlide}
        onClose={handleCloseImageModal}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal 
        show={confirmModal.show}
        title={confirmModal.title}
        message={confirmModal.message}
        onConfirm={confirmModal.action}
        onCancel={() => setConfirmModal(prev => ({ ...prev, show: false }))}
      />

      {/* 1. TOP BAR - System Title & Time */}
      <TopBar activePointId={activePointId} onPointSelect={setActivePointId} />

      {/* MAIN DASHBOARD */}
      <main className="flex-1 grid grid-cols-12 gap-px bg-rui-divider/40 overflow-hidden">
        
        {/* LEFT PANEL - Alarms & Info Stream */}
        <div className="col-span-2 bg-rui-surface p-3 flex flex-col border-r border-rui-divider/60 min-h-0">
          <div className="flex-[0.65] flex flex-col min-h-0 mb-4">
            <SectionHeader title="报警监测" icon={ShieldAlert} important />
            <div className="flex-1 space-y-2 overflow-auto pr-1 custom-scrollbar">
              {sortedAlarms.map(item => (
                <AlarmItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Moved Info Stream here */}
          <div className="flex-[0.35] pt-4 border-t border-rui-divider/60 min-h-0 flex flex-col">
            <SectionHeader 
              title="实时信息流" 
              icon={Info} 
              badge={
                <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[9999px] bg-rui-danger/10 border border-rui-danger/20">
                  <div className="w-1 h-1 rounded-full bg-rui-danger animate-pulse" />
                  <span className="text-[9px] font-display font-medium text-rui-danger uppercase tracking-wider">退货提醒</span>
                </div>
              }
            />
            <div className="flex-1 space-y-1.5 overflow-auto pr-1 custom-scrollbar">
              <PinnedAlert content="触发“扣杂量超标”退货提醒" />
              {PROMPT_MESSAGES.map(msg => (
                <InfoStreamItem key={msg.id} msg={msg} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Video & Hero Results (Important) */}
        <div className="col-span-7 bg-rui-white flex flex-col min-h-0">
          
          {/* 7. Comprehensive Results (Hero) */}
          <ComprehensiveResults activePointId={activePointId} onAction={handleAction} />

          {/* 4. Video Feeds & Image Sidebar - Side by side */}
          <div className="flex-1 flex min-h-0 overflow-hidden">
            {/* Video Feeds Container */}
            <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
              <VideoFeed id="01" title="枪机画面" icon={Scan} src="./枪机画面.png" />
              <VideoFeed id="02" title="球机画面" icon={Activity} src="./球机画面.png" />
            </div>

            {/* 6. Scrap Images Sidebar */}
            <ImageSidebar 
              onImageClick={handleOpenImageModal} 
            />
          </div>
        </div>

        {/* RIGHT PANEL - Grading Analysis (Important) */}
        <AnalysisPanel onShowDetails={handleShowDetails} onAction={handleAction} />
      </main>

      {/* Floating Quick Config Icon */}
      <button className="fixed bottom-24 right-8 w-14 h-14 rounded-full bg-rui-blue text-rui-dark border border-rui-action-blue/50 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[80] group">
        <Settings className="w-7 h-7 group-hover:rotate-90 transition-transform duration-500" />
        <div className="absolute right-full mr-4 px-3 py-1.5 rounded-[12px] bg-rui-surface-strong border border-rui-divider/60 text-rui-dark text-xs font-display font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          快速配置
        </div>
      </button>

      {/* Background Accents */}
      <BackgroundAccents />
    </div>
  );
}
