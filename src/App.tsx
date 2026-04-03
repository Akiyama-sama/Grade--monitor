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
  Zap
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
  Area
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
    name: '6-10mm', value: 50, color: '#00CAFF',
    subItems: [
      { name: '大圆管', value: 24.5 },
      { name: '大方管', value: 25.5 }
    ]
  },
  { 
    name: '3-6mm', value: 30, color: '#0065F8',
    subItems: [
      { name: '电机壳', value: 10 },
      { name: '镀锌板', value: 15 },
      { name: '皮带轮', value: 5 }
    ]
  },
  { 
    name: '1-3mm', value: 15, color: '#4300FF',
    subItems: [
      { name: '小车车架', value: 5 },
      { name: '前后桥壳', value: 3 },
      { name: '减震器', value: 2 },
      { name: '两轮车车圈', value: 5 }
    ]
  },
  { 
    name: '0-1mm', value: 5, color: '#00FFDE',
    subItems: [
      { name: '钢丝', value: 3 },
      { name: '广告牌', value: 2 }
    ]
  },
];

const MATERIAL_DATA: GradingData[] = [
  { name: '钢筋类', value: 40.5, color: '#00CAFF' },
  { name: '边角料', value: 29.5, color: '#0065F8' },
  { name: '破碎料', value: 10, color: '#4300FF' },
  { name: '拆车件', value: 10, color: '#00FFDE' },
  { name: '压块', value: 5, color: '#00CAFF' },
  { name: '钢屑', value: 5, color: '#0065F8' },
  { name: '特级料', value: 0, color: '#4300FF' },
  { name: '重废1', value: 0, color: '#00FFDE' },
  { name: '重废2', value: 0, color: '#0065F8' },
  { name: '中废1', value: 0, color: '#4300FF' },
  { name: '中废2', value: 0, color: '#00FFDE' },
  { name: '中废3', value: 0, color: '#00CAFF' },
  { name: '轻废1', value: 0, color: '#0065F8' },
  { name: '轻废2', value: 0, color: '#4300FF' },
  { name: '轻废3', value: 0, color: '#00FFDE' },
  { name: '轻薄4', value: 0, color: '#00CAFF' },
];

const DEDUCTION_DATA: DeductionItem[] = [
  { name: '基础扣杂', value: 1.2, unit: '%' },
  { name: '碎渣扣杂', value: 45, unit: 'kg' },
  { name: '土杂扣杂', value: 12, unit: 'kg' },
  { name: '油污扣杂', value: 0.1, unit: '%' },
  { name: '锈蚀扣杂', value: 0.2, unit: '%' },
  { name: '水杂扣杂', value: 0.4, unit: '%' },
];

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

// --- Optimized Sub-Components ---

const DigitalClock = memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-right">
      <div className="text-[7px] text-zinc-600 font-bold mb-0.5 uppercase tracking-tighter">Current Time</div>
      <span className="text-sm font-mono font-medium text-primary-cyan leading-none">
        {time.toLocaleTimeString('en-GB', { hour12: false })}
      </span>
    </div>
  );
});

DigitalClock.displayName = 'DigitalClock';

const TopBar = memo(() => (
  <header className="h-12 border-b border-zinc-900 flex items-center justify-between px-6 bg-black/60 backdrop-blur-xl z-50 shrink-0 relative overflow-hidden">
    {/* Subtle top glow */}
    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-cyan/20 to-transparent" />
    
    <div className="flex items-center gap-4 relative z-10">
      <div className="flex items-center gap-3">
        <div className="flex items-baseline gap-2">
          <span className="text-lg font-black text-white tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">用友</span>
          <span className="text-sm font-bold text-primary-cyan tracking-widest drop-shadow-[0_0_8px_rgba(0,202,255,0.3)]">废钢判级平台</span>
        </div>
      </div>
      <div className="h-4 w-px bg-zinc-800 mx-2" />
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary-teal animate-pulse shadow-[0_0_8px_rgba(0,255,222,0.5)]" />
        <span className="text-[8px] text-zinc-500 uppercase tracking-[0.2em] font-bold">System Active v2.4</span>
      </div>
    </div>

    <div className="flex items-center gap-4 relative z-10">
      <DigitalClock />
    </div>
  </header>
));

TopBar.displayName = 'TopBar';

const SectionHeader = memo(({ title, icon: Icon, important = false, badge }: { title: string, icon: any, important?: boolean, badge?: React.ReactNode }) => (
  <div className={`flex items-center gap-2 mb-2 p-1 rounded-lg transition-colors ${important ? 'bg-primary-cyan/[0.03]' : 'bg-transparent'}`}>
    <div className={`p-1 rounded shadow-sm ${important ? 'bg-primary-cyan/20 text-primary-cyan shadow-primary-cyan/10' : 'bg-zinc-800 text-zinc-500'}`}>
      <Icon className="w-3.5 h-3.5" />
    </div>
    <h3 className={`text-[11px] font-bold uppercase tracking-[0.2em] ${important ? 'text-primary-cyan' : 'text-zinc-500'}`}>
      {title}
    </h3>
    <div className={`flex-1 h-px ${important ? 'bg-primary-cyan/10' : 'bg-zinc-800/30'}`} />
    {badge}
  </div>
));

SectionHeader.displayName = 'SectionHeader';

const DataBox = memo(({ label, value, unit, color = "text-white" }: { label: string, value: string | number, unit?: string, color?: string }) => (
  <div className="flex flex-col relative pl-3 group">
    {/* Accent border */}
    <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full transition-all duration-300 opacity-40 group-hover:opacity-100 ${
      color.includes('cyan') ? 'bg-primary-cyan' : 
      color.includes('blue') ? 'bg-primary-blue' : 
      color.includes('warm') ? 'bg-warm-amber' : 'bg-zinc-700'
    }`} />
    
    <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest mb-0.5 group-hover:text-zinc-400 transition-colors">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className={`text-2xl font-display font-bold tabular-nums tracking-tight transition-all duration-300 group-hover:scale-105 origin-left ${color}`}>{value}</span>
      {unit && <span className="text-[10px] text-zinc-700 font-mono font-medium">{unit}</span>}
    </div>
  </div>
));

DataBox.displayName = 'DataBox';

const AlarmItemCard = memo(({ item }: { item: AlarmItem }) => {
  const isDanger = item.status === 'danger' || item.system > 0;
  const colorClass = item.category === 'seal' 
    ? (isDanger ? 'bg-warm-amber/10 border-warm-amber/30' : 'bg-zinc-900/50 border-zinc-800/50')
    : (isDanger ? 'bg-warm-orange/10 border-warm-orange/30' : 'bg-zinc-900/50 border-zinc-800/50');
  
  const textColorClass = item.category === 'seal'
    ? (isDanger ? 'text-warm-amber' : 'text-zinc-500')
    : (isDanger ? 'text-warm-orange' : 'text-zinc-500');

  const accentColorClass = item.category === 'seal' ? 'text-warm-amber' : 'text-warm-orange';

  return (
    <div className={`p-2 rounded border transition-all ${colorClass}`}>
      <div className="flex justify-between items-start mb-1.5">
        <span className={`text-[10px] font-bold tracking-tight ${textColorClass}`}>
          {item.name}
        </span>
        {isDanger && <AlertTriangle className={`w-3 h-3 animate-bounce ${accentColorClass}`} />}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider mb-0.5">系统</div>
          <div className={`text-sm font-display font-bold tabular-nums ${item.system > 0 ? accentColorClass : 'text-zinc-700'}`}>{item.system}</div>
        </div>
        <div className="text-right">
          <div className="text-[8px] text-zinc-600 uppercase font-bold tracking-wider mb-0.5">复核</div>
          <div className="text-sm font-display font-bold tabular-nums text-zinc-700">{item.review}</div>
        </div>
      </div>
    </div>
  );
});

AlarmItemCard.displayName = 'AlarmItemCard';

const InfoStreamItem = memo(({ msg }: { msg: MessagePrompt }) => (
  <div className="flex gap-2 items-start">
    <span className="text-[7px] text-zinc-800 font-mono mt-0.5">{msg.time}</span>
    <p className={`text-[8px] leading-tight ${msg.type === 'danger' ? 'text-warm-red/70' : 'text-zinc-600'}`}>
      {msg.content}
    </p>
  </div>
));

InfoStreamItem.displayName = 'InfoStreamItem';

const PinnedAlert = memo(({ content }: { content: string }) => (
  <div className="bg-warm-red/90 text-white p-2 rounded flex items-center gap-2 mb-3 shadow-lg shadow-warm-red/20 animate-pulse">
    <AlertTriangle className="w-3 h-3 shrink-0" />
    <span className="text-[9px] font-bold leading-tight">{content}</span>
  </div>
));

PinnedAlert.displayName = 'PinnedAlert';

const VideoFeed = memo(({ id, title, icon: Icon, src }: { id: string, title: string, icon: any, src: string }) => (
  <div className="relative rounded-xl overflow-hidden border border-zinc-900 group bg-zinc-900/50 flex items-center justify-center aspect-video">
    <div className="w-full h-full relative">
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2 bg-black/80 px-2 py-0.5 rounded-full border border-white/5">
        <Icon className="w-2.5 h-2.5 text-primary-cyan" />
        <span className="text-[9px] text-white uppercase tracking-widest">{title} - CAM {id} (1280x720)</span>
      </div>
      <img 
        src={src} 
        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" 
        referrerPolicy="no-referrer"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
    </div>
  </div>
));

VideoFeed.displayName = 'VideoFeed';

const AnalysisPanel = memo(({ onShowDetails }: { onShowDetails: () => void }) => (
  <div className="col-span-3 bg-[#080808] p-3 flex flex-col border-l border-zinc-900 min-h-0">
    {/* Basic Information Section */}
    <div className="mb-4">
      <SectionHeader title="基础信息" icon={Info} important />
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-zinc-900/30 p-3 rounded border border-zinc-800/50">
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase">车号</span>
          <span className="text-xs font-bold text-primary-cyan">{BASIC_INFO.plateNumber}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase">货名</span>
          <span className="text-xs font-bold text-zinc-300">{BASIC_INFO.cargoName}</span>
        </div>
        <div className="flex flex-col col-span-2">
          <span className="text-[8px] text-zinc-600 uppercase">供货方</span>
          <span className="text-xs text-zinc-400 truncate">{BASIC_INFO.supplier}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase">毛重</span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-bold text-warm-amber">{BASIC_INFO.grossWeight}</span>
            <span className="text-[8px] text-zinc-600">t</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-zinc-600 uppercase">毛重时间</span>
          <span className="text-[9px] text-zinc-500 font-mono">{BASIC_INFO.grossWeightTime.split(' ')[1]}</span>
        </div>
        <div className="flex flex-col col-span-2 pt-1 border-t border-zinc-800/50">
          <div className="flex justify-between items-center">
            <span className="text-[8px] text-zinc-600 uppercase">刷卡时间</span>
            <span className="text-[8px] text-zinc-600 uppercase">已过分钟</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-zinc-400 font-mono">{BASIC_INFO.swipeTime}</span>
            <span className="text-[9px] text-primary-cyan font-mono font-bold">{BASIC_INFO.elapsedMinutes}</span>
          </div>
        </div>
      </div>
    </div>

    <div className="flex justify-between items-center mb-2">
      <SectionHeader title="判级深度分析" icon={BarChart3} important />
      <button 
        onClick={onShowDetails}
        className="p-1 rounded bg-zinc-800 hover:bg-primary-cyan/20 text-zinc-500 hover:text-primary-cyan transition-all"
      >
        <Maximize2 className="w-2.5 h-2.5" />
      </button>
    </div>
    
    {/* Thickness Analysis */}
    <div className="flex-[1.2] flex flex-col mb-3 min-h-0">
      <span className="text-[8px] text-zinc-700 uppercase mb-1">厚度占比分布</span>
      <div className="flex-1 relative min-h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={THICKNESS_DATA}
              innerRadius={35}
              outerRadius={50}
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
          <span className="text-base font-mono text-white">95%</span>
          <span className="text-[6px] text-zinc-700 uppercase">置信度</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1">
        {THICKNESS_DATA.map(item => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[7px] text-zinc-600">{item.name}</span>
            </div>
            <span className="text-[7px] font-mono text-zinc-400">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>

    {/* Material Analysis */}
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[8px] text-zinc-700 uppercase">料型占比分布</span>
        <span className="text-[6px] text-zinc-800 uppercase">Top 6</span>
      </div>
      <div className="flex-1 relative min-h-[100px]">
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
          <span className="text-xs font-mono text-zinc-200">6</span>
          <span className="text-[5px] text-zinc-700 uppercase">料型</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-1">
        {MATERIAL_DATA.slice(0, 6).map(item => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-[7px] text-zinc-600">{item.name}</span>
            </div>
            <span className="text-[7px] font-mono text-zinc-400">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
));

AnalysisPanel.displayName = 'AnalysisPanel';

const DeductionExpansion = memo(({ show }: { show: boolean }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="overflow-hidden"
      >
        <div className="pt-4 border-t border-zinc-900/50 grid grid-cols-6 gap-4">
          {DEDUCTION_DATA.map(item => (
            <div key={item.name} className="flex flex-col p-2.5 bg-zinc-900/30 rounded-lg border border-zinc-800/50 group hover:border-warm-amber/20 transition-colors">
              <span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider mb-1.5 group-hover:text-zinc-500 transition-colors">{item.name}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-display font-bold text-zinc-200 tabular-nums">{item.value}</span>
                <span className="text-[9px] text-zinc-700 font-mono font-medium">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
));

DeductionExpansion.displayName = 'DeductionExpansion';

const ComprehensiveResults = memo(({ showDeductionDetails, onToggleDeduction, onAction }: { 
  showDeductionDetails: boolean, 
  onToggleDeduction: () => void,
  onAction: (type: 'abnormal' | 'end') => void
}) => (
  <div className="p-4 border-b border-zinc-900 bg-gradient-to-b from-primary-cyan/[0.05] to-transparent shrink-0">
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {/* Data Grid */}
        <div className="flex items-center gap-10 flex-1">
          {/* Status */}
          <div className="shrink-0">
            <DataBox label="当前判级状态" value="判级中" color="text-primary-cyan" />
          </div>
          
          <div className="h-8 w-px bg-zinc-800/50" />

          {/* Distribution */}
          <div className="flex flex-col min-w-[180px]">
            <span className="text-[10px] text-zinc-600 uppercase font-mono tracking-widest mb-1.5">智能级别分布</span>
            <div className="flex items-center gap-6">
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-zinc-500 font-bold tracking-tight">重1</span>
                <span className="text-2xl font-display font-bold tabular-nums text-white">20%</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-[11px] text-zinc-500 font-bold tracking-tight">重2</span>
                <span className="text-2xl font-display font-bold tabular-nums text-primary-blue">70%</span>
              </div>
            </div>
            {/* Visual indicator */}
            <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-2 overflow-hidden flex shadow-inner">
              <div className="h-full bg-white/40 transition-all duration-500" style={{ width: '20%' }} />
              <div className="h-full bg-primary-blue transition-all duration-500 shadow-[0_0_8px_rgba(0,101,248,0.4)]" style={{ width: '70%' }} />
            </div>
          </div>

          <div className="h-8 w-px bg-zinc-800/50" />

          {/* Thickness */}
          <div className="shrink-0">
            <DataBox label="智能综合厚度" value="6" color="text-white" />
          </div>

          <div className="h-8 w-px bg-zinc-800/50" />

          {/* Deduction */}
          <div 
            className="relative group cursor-pointer flex items-center gap-3"
            onClick={onToggleDeduction}
          >
            <DataBox label="智能扣杂总量" value="146" unit="kg" color="text-warm-amber" />
            <div className={`mt-4 p-1 rounded bg-zinc-800/50 border border-zinc-700/50 transition-all group-hover:bg-zinc-700 ${showDeductionDetails ? 'rotate-180' : ''}`}>
              <ChevronRight className="w-2.5 h-2.5 text-zinc-500 rotate-90" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-1.5 shrink-0 ml-8 pl-8 border-l border-zinc-800/50">
          <button 
            onClick={() => onAction('abnormal')}
            className="h-8 w-28 px-3 bg-warm-red/10 border border-warm-red/20 text-warm-red text-[9px] font-bold uppercase tracking-[0.15em] rounded-md hover:bg-warm-red/20 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-warm-red/5"
          >
            <AlertTriangle className="w-3 h-3" />
            异常车次
          </button>
          <button 
            onClick={() => onAction('end')}
            className="h-8 w-28 px-3 bg-zinc-800 border border-zinc-700 text-zinc-300 text-[9px] font-bold uppercase tracking-[0.15em] rounded-md hover:bg-zinc-700 active:scale-95 transition-all flex items-center justify-center gap-1.5"
          >
            <Zap className="w-3 h-3" />
            结束判级
          </button>
        </div>
      </div>

      <DeductionExpansion show={showDeductionDetails} />
    </div>
  </div>
));

ComprehensiveResults.displayName = 'ComprehensiveResults';

const DetailsModal = memo(({ show, onClose }: { show: boolean, onClose: () => void }) => (
  <AnimatePresence>
    {show && (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl p-12 overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
              <div className="w-1 h-8 bg-primary-cyan" />
              <h2 className="text-3xl font-bold text-white tracking-tighter uppercase">判级深度分析详情</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <Maximize2 className="w-8 h-8 text-zinc-500 rotate-45" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-12">
            {/* Thickness Details */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="w-5 h-5 text-primary-cyan" />
                <span className="text-lg font-bold text-white uppercase">厚度占比详情</span>
              </div>
              <div className="space-y-8">
                {THICKNESS_DATA.map((item) => (
                  <div key={item.name} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-3">
                        <div className="px-3 py-1 rounded bg-zinc-800 text-xs font-bold text-zinc-300 border border-zinc-700">
                          {item.name}
                        </div>
                        <div className="h-1.5 w-48 bg-zinc-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                            style={{ width: `${item.value}%`, backgroundColor: item.color }} 
                          />
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-primary-cyan">{item.value}%</span>
                    </div>
                    {item.subItems && (
                      <div className="grid grid-cols-2 gap-4 pl-4 border-l border-zinc-800">
                        {item.subItems.map(sub => (
                          <div key={sub.name} className="flex justify-between items-center">
                            <span className="text-xs text-zinc-500">{sub.name}</span>
                            <span className="text-xs font-mono text-zinc-400">{sub.value}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Material Details */}
            <div className="bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-8">
                <Package className="w-5 h-5 text-primary-cyan" />
                <span className="text-lg font-bold text-white uppercase">更多料型分布</span>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                {MATERIAL_DATA.map((item) => (
                  <div key={item.name} className="flex items-center gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-300">{item.name}</span>
                        <span className="text-xs font-mono text-primary-cyan">{item.value}%</span>
                      </div>
                      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-cyan/50" 
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
          <div className="mt-12 bg-zinc-900/30 border border-zinc-800 p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-8">
              <ShieldAlert className="w-5 h-5 text-warm-amber" />
              <span className="text-lg font-bold text-white uppercase">扣杂详情分析</span>
            </div>
            <div className="grid grid-cols-6 gap-6">
              {DEDUCTION_DATA.map((item) => (
                <div key={item.name} className="flex flex-col items-center p-6 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-warm-amber/30 transition-colors group">
                  <span className="text-[10px] text-zinc-500 uppercase mb-3 group-hover:text-warm-amber/50 transition-colors">{item.name}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-mono font-bold text-white group-hover:text-warm-amber transition-colors">{item.value}</span>
                    <span className="text-xs text-zinc-600">{item.unit}</span>
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
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl max-w-sm w-full shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-warm-amber/10 text-warm-amber">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
          </div>
          <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
            {message}
          </p>
          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold transition-colors"
            >
              取消
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-2 rounded-md bg-primary-cyan hover:bg-primary-cyan/90 text-black text-xs font-bold transition-colors"
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
        className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-zinc-900 border border-zinc-800 rounded-full hover:bg-zinc-800 transition-colors z-20"
        >
          <Maximize2 className="w-6 h-6 text-zinc-400 rotate-45" />
        </button>

        <div className="relative w-full max-w-6xl aspect-[16/10] flex items-center gap-6">
          {/* Prev Button */}
          <button 
            onClick={onPrev}
            className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all group"
          >
            <ChevronRight className="w-8 h-8 text-zinc-600 group-hover:text-primary-cyan rotate-180" />
          </button>

          {/* Slide Content (4-image grid) */}
          <div className="flex-1 h-full bg-zinc-900/20 border border-zinc-800/50 rounded-2xl overflow-hidden p-4">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
              {GALLERY_DATA[currentSlide].images.map((src, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-zinc-800 group aspect-video">
                  <img 
                    src={src} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-zinc-400 font-mono border border-white/5">
                    VIEW_0{idx + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Next Button */}
          <button 
            onClick={onNext}
            className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-800 transition-all group"
          >
            <ChevronRight className="w-8 h-8 text-zinc-600 group-hover:text-primary-cyan" />
          </button>

          {/* Pagination Info */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500 tracking-widest uppercase">
              Batch {currentSlide + 1} / {GALLERY_DATA.length}
            </span>
            <div className="flex gap-1.5">
              {GALLERY_DATA.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1 transition-all rounded-full ${idx === currentSlide ? 'w-8 bg-primary-cyan' : 'w-2 bg-zinc-800'}`} 
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

const GalleryDrawer = memo(({ 
  show, 
  onToggle, 
  onImageClick 
}: { 
  show: boolean, 
  onToggle: () => void, 
  onImageClick: (slideIdx: number) => void 
}) => (
  <div className="border-t border-zinc-900 bg-black/40 shrink-0 relative">
    <button 
      onClick={onToggle}
      className="absolute -top-6 left-1/2 -translate-x-1/2 px-4 py-1 bg-zinc-900 border border-zinc-800 border-b-0 rounded-t-lg flex items-center gap-2 hover:bg-zinc-800 transition-colors z-10"
    >
      <ImageIcon className="w-3 h-3 text-primary-cyan" />
      <span className="text-[8px] text-zinc-500 uppercase tracking-widest font-bold">历史抓拍库</span>
      <ChevronRight className={`w-3 h-3 text-zinc-600 transition-transform ${show ? 'rotate-90' : '-rotate-90'}`} />
    </button>

    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 96, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          <div className="h-24 p-3 flex gap-3 overflow-x-auto custom-scrollbar">
            {GALLERY_DATA.map((slide, sIdx) => (
              slide.images.map((img, iIdx) => (
                <div 
                  key={`${sIdx}-${iIdx}`} 
                  onClick={() => onImageClick(sIdx)}
                  className="flex-shrink-0 w-32 rounded border border-zinc-800 overflow-hidden relative group cursor-pointer"
                >
                  <img 
                    src={img} 
                    className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  <div className="absolute bottom-1 right-1 text-[7px] text-zinc-600">BATCH_{sIdx+1}_IMG_{iIdx+1}</div>
                </div>
              ))
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
));

GalleryDrawer.displayName = 'GalleryDrawer';

const Footer = memo(() => (
  <footer className="h-10 border-t border-zinc-900 px-6 flex items-center justify-between bg-black/40 relative overflow-hidden">
    {/* Subtle bottom glow */}
    <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-blue/10 to-transparent" />
    
    <div className="flex items-center gap-8 relative z-10">
      <div className="flex items-center gap-2 group cursor-help">
        <div className="w-1.5 h-1.5 bg-primary-cyan rounded-full shadow-[0_0_8px_rgba(0,202,255,0.5)] animate-pulse" />
        <span className="text-[9px] text-zinc-600 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">马钢富圆金属资源有限公司利辛分公司</span>
      </div>
    </div>
    <div className="flex items-center gap-6 text-[9px] text-zinc-700 uppercase tracking-tighter relative z-10">
      <span className="hover:text-primary-blue transition-colors cursor-default">Engine: <span className="text-zinc-500">AI_GRADER_PRO_X</span></span>
      <span className="hover:text-primary-cyan transition-colors cursor-default">Latency: <span className="text-zinc-500">0.04s</span></span>
      <span className="flex items-center gap-1.5">
        Status: <span className="text-primary-teal font-bold tracking-widest">Authorized</span>
      </span>
    </div>
  </footer>
));

Footer.displayName = 'Footer';

const BackgroundAccents = memo(() => (
  <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
    <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary-deep/10 blur-[140px] rounded-full animate-pulse" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-blue/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-primary-cyan/5 blur-[160px] rounded-full" />
    <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay" />
    
    {/* Subtle grid lines */}
    <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />
  </div>
));

BackgroundAccents.displayName = 'BackgroundAccents';

export default function App() {
  const [showDetails, setShowDetails] = useState(false);
  const [showDeductionDetails, setShowDeductionDetails] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
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
  const handleToggleDeduction = useCallback(() => setShowDeductionDetails(prev => !prev), []);
  const handleToggleGallery = useCallback(() => setShowGallery(prev => !prev), []);
  const handleOpenImageModal = useCallback((slideIdx: number) => {
    setCurrentSlide(slideIdx);
    setShowImageModal(true);
  }, []);
  const handleCloseImageModal = useCallback(() => setShowImageModal(false), []);
  const handlePrevSlide = useCallback(() => setCurrentSlide(prev => (prev > 0 ? prev - 1 : GALLERY_DATA.length - 1)), []);
  const handleNextSlide = useCallback(() => setCurrentSlide(prev => (prev < GALLERY_DATA.length - 1 ? prev + 1 : 0)), []);

  const handleAction = useCallback((type: 'abnormal' | 'end') => {
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
    } else {
      setConfirmModal({
        show: true,
        title: '确认结束判级',
        message: '是否确认结束当前车次的判级流程？结束后将生成最终判级报告，无法再次修改。',
        action: () => {
          console.log('Grading ended');
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
    <div className="h-screen bg-[#080808] text-zinc-400 font-mono selection:bg-primary-cyan/30 overflow-hidden flex flex-col">
      
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
      <TopBar />

      {/* MAIN DASHBOARD */}
      <main className="flex-1 grid grid-cols-12 gap-px bg-zinc-900/50 overflow-hidden">
        
        {/* LEFT PANEL - Alarms & Info Stream */}
        <div className="col-span-2 bg-[#080808] p-4 flex flex-col border-r border-zinc-900 min-h-0">
          <div className="flex-[0.65] flex flex-col min-h-0 mb-4">
            <SectionHeader title="报警监测" icon={ShieldAlert} important />
            <div className="flex-1 space-y-2 overflow-auto pr-2 custom-scrollbar">
              {sortedAlarms.map(item => (
                <AlarmItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          {/* Moved Info Stream here */}
          <div className="flex-[0.35] pt-4 border-t border-zinc-900 min-h-0 flex flex-col">
            <SectionHeader 
              title="实时信息流" 
              icon={Info} 
              badge={
                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-warm-red/20 border border-warm-red/30">
                  <div className="w-1 h-1 rounded-full bg-warm-red animate-ping" />
                  <span className="text-[7px] font-bold text-warm-red uppercase tracking-tighter">有退货提醒 1条</span>
                </div>
              }
            />
            <div className="flex-1 space-y-1.5 overflow-auto pr-2 custom-scrollbar">
              <PinnedAlert content="触发“扣杂量超标”退货提醒" />
              {PROMPT_MESSAGES.map(msg => (
                <InfoStreamItem key={msg.id} msg={msg} />
              ))}
            </div>
          </div>
        </div>

        {/* CENTER PANEL - Video & Hero Results (Important) */}
        <div className="col-span-7 bg-[#080808] flex flex-col min-h-0">
          
          {/* 7. Comprehensive Results (Hero) */}
          <ComprehensiveResults 
            showDeductionDetails={showDeductionDetails} 
            onToggleDeduction={handleToggleDeduction} 
            onAction={handleAction}
          />

          {/* 4. Video Feeds */}
          <div className="flex-1 p-4 grid grid-rows-2 gap-4 min-h-0 overflow-hidden">
            <VideoFeed id="01" title="枪机画面" icon={Scan} src="./枪机画面.jpg" />
            <VideoFeed id="02" title="球机画面" icon={Activity} src="./球机画面.jpg" />
          </div>

          {/* 6. Scrap Images (Drawer Style) */}
          <GalleryDrawer 
            show={showGallery} 
            onToggle={handleToggleGallery} 
            onImageClick={handleOpenImageModal} 
          />
        </div>

        {/* RIGHT PANEL - Grading Analysis (Important) */}
        <AnalysisPanel onShowDetails={handleShowDetails} />
      </main>

      {/* FOOTER - System Status */}
      <Footer />

      {/* Background Accents */}
      <BackgroundAccents />
    </div>
  );
}
