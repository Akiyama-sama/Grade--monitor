import { memo } from 'react';
import { Activity, Info, LayoutGrid } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

import { BASIC_INFO, MATERIAL_DATA, THICKNESS_DATA } from '../dashboard/constants';
import { SectionHeader } from '../dashboard/common';

const AnalysisPanel = memo(({ onShowDetails }: { onShowDetails: () => void }) => (
  <div className="col-span-3 bg-rui-surface p-3 flex flex-col border-l border-rui-divider/60 min-h-0 overflow-y-auto custom-scrollbar">
    <div className="mb-6">
      <SectionHeader title="基础判级信息" icon={Info} />
      <div className="bg-rui-surface-strong p-4 rounded-[20px] border border-rui-divider/60 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">
              车牌号码
            </span>
            <span className="text-[15px] font-display font-medium text-rui-blue tracking-tight">
              {BASIC_INFO.plateNumber}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">
              货名
            </span>
            <span className="text-[15px] font-display font-medium text-rui-dark tracking-tight">
              {BASIC_INFO.cargoName}
            </span>
          </div>
        </div>

        <div className="flex flex-col pt-3 border-t border-rui-divider/50">
          <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">
            供货方
          </span>
          <span className="text-[14px] text-rui-dark font-display font-medium truncate">
            {BASIC_INFO.supplier}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-rui-divider/50">
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">
              毛重
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-display font-medium text-rui-warning">
                {BASIC_INFO.grossWeight}
              </span>
              <span className="text-[10px] text-rui-warning font-display font-medium">t</span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-rui-gray font-display uppercase tracking-wider mb-0.5">
              毛重时间
            </span>
            <span className="text-[13px] text-rui-dark font-display font-medium tabular-nums">
              {BASIC_INFO.grossWeightTime.split(' ')[1]}
            </span>
          </div>
        </div>
      </div>
    </div>

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
              <span className="text-[7px] text-rui-slate font-display font-medium uppercase tracking-widest">
                置信度
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-2">
            {THICKNESS_DATA.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-rui-slate font-display">{item.name}</span>
                </div>
                <span className="text-[11px] font-display font-medium text-rui-dark tabular-nums">
                  {item.value}%
                </span>
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
              <span className="text-[7px] text-rui-slate font-display font-medium uppercase tracking-widest">
                料型
              </span>
            </div>
          </div>
          <div className="flex-1 space-y-1.5">
            {MATERIAL_DATA.slice(0, 6).map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-rui-slate font-display">{item.name}</span>
                </div>
                <span className="text-[11px] font-display font-medium text-rui-dark tabular-nums">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
));

AnalysisPanel.displayName = 'AnalysisPanel';

export const RightAnalysisRegion = memo(({ onShowDetails }: { onShowDetails: () => void }) => (
  <AnalysisPanel onShowDetails={onShowDetails} />
));

RightAnalysisRegion.displayName = 'RightAnalysisRegion';
