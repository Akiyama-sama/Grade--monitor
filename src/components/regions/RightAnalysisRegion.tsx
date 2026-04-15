import { memo } from 'react';
import { Activity, Droplets, Info, LayoutGrid, Leaf } from 'lucide-react';

import {
  ANALYSIS_SUMMARY_METRICS,
  BASIC_INFO,
  MATERIAL_DATA,
  THICKNESS_DATA,
} from '../dashboard/constants';
import { SectionHeader } from '../dashboard/common';

const grossWeight = Number.parseFloat(BASIC_INFO.grossWeight);

const metricToneClassMap = {
  blue: {
    shell: 'border-rui-blue/25 bg-rui-blue/10',
    value: 'text-rui-blue',
    icon: 'text-rui-blue bg-rui-blue/12 border-rui-blue/20',
  },
  warning: {
    shell: 'border-rui-warning/25 bg-rui-warning/10',
    value: 'text-rui-warning',
    icon: 'text-rui-warning bg-rui-warning/12 border-rui-warning/20',
  },
} as const;

const AnalysisPanel = memo(
  ({
    onShowThicknessDetails,
    onShowMaterialDetails,
  }: {
    onShowThicknessDetails: () => void;
    onShowMaterialDetails: () => void;
  }) => (
  <div className="col-span-3 bg-rui-surface px-3 py-1.5 flex flex-col border-l border-rui-divider/60 min-h-0 overflow-hidden">
    <div className="mb-2 grid grid-cols-2 gap-1.5">
      {ANALYSIS_SUMMARY_METRICS.map((metric) => {
        const toneClasses = metricToneClassMap[metric.tone];
        const MetricIcon = metric.id === 'water-yield' ? Droplets : Leaf;

        return (
          <div
            key={metric.id}
            className={`rounded-[15px] border px-2.5 py-1.5 ${toneClasses.shell}`}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">
                  {metric.label}
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className={`text-[18px] font-display font-medium leading-none ${toneClasses.value}`}>
                    {metric.value}
                  </span>
                  <span className={`text-[9px] font-display font-medium uppercase tracking-[0.1em] ${toneClasses.value}`}>
                    {metric.unit}
                  </span>
                </div>
              </div>
              <div className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-[8px] border ${toneClasses.icon}`}>
                <MetricIcon className="h-3 w-3" />
              </div>
            </div>
          </div>
        );
      })}
    </div>

    <div className="mb-2 rounded-[15px] border border-rui-divider/60 bg-rui-surface-strong p-2">
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-rui-surface border border-rui-divider/60 text-rui-slate">
          <Info className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12px] font-display font-medium tracking-tight text-rui-slate">
          基础判级信息
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">车牌号码</div>
          <div className="truncate text-[12px] font-display font-medium tracking-tight text-rui-blue">
            {BASIC_INFO.plateNumber}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">货名</div>
          <div className="truncate text-[12px] font-display font-medium tracking-tight text-rui-dark">
            {BASIC_INFO.cargoName}
          </div>
        </div>
        <div className="col-span-2 min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">供货方</div>
          <div className="truncate text-[11px] font-display font-medium text-rui-dark">
            {BASIC_INFO.supplier}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">毛重</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-display font-medium text-rui-warning">
              {BASIC_INFO.grossWeight}
            </span>
            <span className="text-[9px] font-display font-medium text-rui-warning">t</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">毛重时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums text-rui-dark">
            {BASIC_INFO.grossWeightTime.split(' ')[1]}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">刷卡时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums text-rui-warning">
            {BASIC_INFO.swipeTime.split(' ')[1]}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">记过时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums text-rui-dark">
            {BASIC_INFO.elapsedMinutes}
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 min-h-0 grid grid-rows-[minmax(0,0.92fr)_minmax(0,1.08fr)] gap-2">
      <div className="bg-rui-surface-strong p-2.5 rounded-[15px] border border-rui-divider/60 flex min-h-0 flex-col">
        <SectionHeader title="厚度占比" icon={Activity} onMore={onShowThicknessDetails} />
        <div className="flex-1 flex flex-col justify-center space-y-1.5">
          {THICKNESS_DATA.map((item) => {
            const thicknessWeight = Number.isFinite(grossWeight)
              ? `${(grossWeight * item.value / 100).toFixed(1)}t`
              : '--';

            return (
              <div key={item.name} className="grid grid-cols-[60px_minmax(0,1fr)_38px] items-center gap-2">
                <span className="text-[10px] text-rui-slate font-display tabular-nums">
                  {item.name}
                </span>
                <div className="relative h-5.5 overflow-hidden rounded-[8px] bg-rui-surface border border-rui-divider/40">
                  <div
                    className="absolute inset-y-0 left-0 flex min-w-[36px] items-center justify-end rounded-[8px] px-1.5"
                    style={{ width: `${item.value}%`, backgroundColor: item.color }}
                  >
                    <span className="text-[10px] font-display font-medium text-rui-white tabular-nums">
                      {item.value}%
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-display font-medium text-rui-blue tabular-nums text-right">
                  {thicknessWeight}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-rui-surface-strong p-2.5 rounded-[15px] border border-rui-divider/60 flex min-h-0 flex-col">
        <SectionHeader title="料型占比" icon={LayoutGrid} onMore={onShowMaterialDetails} />
        <div className="grid flex-1 grid-cols-3 content-center gap-2">
          {MATERIAL_DATA.slice(0, 9).map((item) => (
            <div
              key={item.name}
              className="relative overflow-hidden rounded-[14px] border border-rui-warning/30 bg-rui-warning/12 p-0"
            >
              <div className="absolute inset-0 bg-rui-warning/90" />
              <div
                className="absolute inset-y-0 left-0 w-[48%] bg-rui-dark/90"
                style={{ clipPath: 'polygon(0 0, 82% 0, 100% 100%, 0 100%)' }}
              />
              <div className="relative z-10 flex min-h-[46px] items-center justify-between gap-1.5 px-2.5 py-2">
                <span className="text-[9px] font-display font-medium text-rui-white tracking-wide">
                  {item.name}
                </span>
                <span className="text-[11px] font-display font-medium text-rui-dark tabular-nums tracking-tight">
                  {item.value}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
));

AnalysisPanel.displayName = 'AnalysisPanel';

export const RightAnalysisRegion = memo(
  ({
    onShowThicknessDetails,
    onShowMaterialDetails,
  }: {
    onShowThicknessDetails: () => void;
    onShowMaterialDetails: () => void;
  }) => (
    <AnalysisPanel
      onShowThicknessDetails={onShowThicknessDetails}
      onShowMaterialDetails={onShowMaterialDetails}
    />
  ),
);

RightAnalysisRegion.displayName = 'RightAnalysisRegion';
