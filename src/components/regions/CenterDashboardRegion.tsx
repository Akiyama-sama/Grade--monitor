import { memo } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Image as ImageIcon, LogOut, Scan } from 'lucide-react';
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';

import {
  BASIC_INFO,
  CHART_COLORS,
  DEDUCTION_DATA,
  DEDUCTION_TOTAL,
  GALLERY_DATA,
  MONITORING_POINTS,
} from '../dashboard/constants';
import { VideoFeed } from '../dashboard/common';
import type { DashboardActionType } from '../dashboard/types';

interface ComprehensiveResultsProps {
  activePointId: string;
  onAction: (type: DashboardActionType) => void;
}

const LEVEL_DISTRIBUTION = [
  { label: '重1', value: 20, accent: false },
  { label: '重2', value: 70, accent: true },
] as const;

const ComprehensiveResults = memo(({ activePointId, onAction }: ComprehensiveResultsProps) => {
  const activePoint = MONITORING_POINTS.find((point) => point.id === activePointId);

  return (
    <div className="px-6 py-3 border-b border-rui-divider/60 bg-rui-surface shrink-0">
      <div className="space-y-4 xl:space-y-5">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(220px,0.8fr)] xl:items-stretch">
          <section className="min-w-0">
            <div className="min-w-0 rounded-[24px] border border-rui-divider/50 bg-rui-surface-strong/45 p-4 xl:p-5">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-[9999px] border border-rui-divider/60 bg-rui-surface px-3 py-1 text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-slate">
                  {activePoint?.name ?? '当前监控点'}
                </span>
                {activePoint?.status === 'warning' && (
                  <span className="rounded-[9999px] border border-rui-warning/20 bg-rui-warning/10 px-3 py-1 text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-warning">
                    待复核
                  </span>
                )}
              </div>

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.12fr)_minmax(120px,0.34fr)_minmax(0,0.72fr)] lg:items-end">
                <div className="min-w-0 border-b border-rui-divider/40 pb-4 lg:border-b-0 lg:pb-0 lg:pr-4">
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">
                    判级状态
                  </div>
                  <div className="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
                    <h2 className="text-[clamp(2.5rem,3.2vw,3.85rem)] font-display font-medium leading-none tracking-[-0.065em] text-rui-dark">
                      判级中
                    </h2>
                    <div className="pb-1 text-[13px] font-display font-medium tracking-[0.08em] text-rui-blue">
                      {BASIC_INFO.plateNumber}
                    </div>
                  </div>
                </div>

                <div className="min-w-0 rounded-[20px] border border-rui-divider/45 bg-rui-surface/80 px-4 py-3">
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.22em] text-rui-gray">
                    智能综合厚度
                  </div>
                  <div className="mt-3">
                    <span className="text-[clamp(2.4rem,3vw,3.4rem)] font-display font-medium leading-none tracking-[-0.06em] text-rui-warning">
                      6
                    </span>
                  </div>
                </div>

                <div className="min-w-0 rounded-[20px] border border-rui-divider/45 bg-rui-surface/80 px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-[10px] font-display font-medium uppercase tracking-[0.22em] text-rui-gray">
                      智能级别分布
                    </div>
                    <div className="text-[11px] font-display font-medium uppercase tracking-[0.18em] text-rui-blue">
                      系统建议
                    </div>
                  </div>
                  <div className="mt-3 space-y-2.5">
                    {LEVEL_DISTRIBUTION.map((item) => (
                      <div key={item.label} className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-display font-medium uppercase tracking-[0.18em]">
                          <span className={item.accent ? 'text-rui-blue' : 'text-rui-slate'}>{item.label}</span>
                          <span className={item.accent ? 'text-rui-blue' : 'text-rui-dark'}>{item.value}%</span>
                        </div>
                        <div className={`overflow-hidden rounded-full bg-rui-divider/35 ${item.accent ? 'h-2.5' : 'h-2'}`}>
                          <div
                            className={`h-full rounded-full ${item.accent ? 'bg-rui-blue' : 'bg-rui-divider-strong'}`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="min-w-0">
            <div className="relative h-full min-h-[220px] overflow-hidden rounded-[24px] border border-rui-divider/50 bg-rui-surface-strong/45 p-4 xl:p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">
                    智能扣杂雷达
                  </div>
                  <div className="mt-1 text-[12px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    扣杂子项分布
                  </div>
                </div>
                <div className="rounded-[18px] border border-rui-pink/20 bg-rui-pink/8 px-3 py-2 text-right">
                  <div className="text-[9px] font-display font-medium uppercase tracking-[0.18em] text-rui-pink/70">
                    扣杂总量
                  </div>
                  <div className="mt-1 flex items-end gap-1">
                    <span className="text-[1.55rem] font-display font-medium leading-none tracking-[-0.05em] text-rui-pink">
                      {DEDUCTION_TOTAL.value}
                    </span>
                    <span className="pb-0.5 text-[10px] font-display font-medium uppercase tracking-[0.18em] text-rui-pink/70">
                      {DEDUCTION_TOTAL.unit}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex h-[168px] items-center justify-center">
                <div className="h-full w-full max-w-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="52%" outerRadius="76%" data={DEDUCTION_DATA}>
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
              </div>
            </div>
          </section>
        </div>

        <div className="grid gap-2.5 lg:grid-cols-3">
          <button
            onClick={() => onAction('end')}
            className="btn-pill w-full bg-rui-blue px-4 py-2.5 text-[13px] text-rui-dark hover:bg-rui-action-blue"
          >
            <span className="flex items-center justify-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              结束判级
            </span>
          </button>
          <button
            onClick={() => onAction('abnormal')}
            className="btn-pill w-full border-rui-warning/30 bg-rui-warning/10 px-4 py-2.5 text-[13px] text-rui-warning hover:bg-rui-warning/15"
          >
            <span className="flex items-center justify-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              异常处理
            </span>
          </button>
          <button
            onClick={() => onAction('leave')}
            className="btn-pill w-full border-rui-divider/60 bg-rui-surface-strong px-4 py-2.5 text-[13px] text-rui-slate hover:bg-rui-surface-soft"
          >
            <span className="flex items-center justify-center gap-2">
              <LogOut className="h-4 w-4" />
              中途离开
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

ComprehensiveResults.displayName = 'ComprehensiveResults';

const ImageSidebar = memo(({ onImageClick }: { onImageClick: (slideIdx: number) => void }) => (
  <div className="w-48 border-l border-rui-divider/60 bg-rui-surface flex flex-col shrink-0">
    <div className="p-3 border-b border-rui-divider/50 bg-rui-surface-strong">
      <div className="flex items-center gap-2">
        <ImageIcon className="w-3.5 h-3.5 text-rui-blue" />
        <span className="text-[11px] text-rui-dark font-display font-medium uppercase tracking-wider">
          废钢抓拍图
        </span>
      </div>
    </div>
    <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
      {GALLERY_DATA.map((slide, sIdx) =>
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
              BATCH_{sIdx + 1}
            </div>
          </div>
        )),
      )}
    </div>
  </div>
));

ImageSidebar.displayName = 'ImageSidebar';

interface CenterDashboardRegionProps {
  activePointId: string;
  onAction: (type: DashboardActionType) => void;
  onImageClick: (slideIdx: number) => void;
}

export const CenterDashboardRegion = memo(
  ({ activePointId, onAction, onImageClick }: CenterDashboardRegionProps) => (
    <div className="col-span-7 bg-rui-white flex flex-col min-h-0">
      <ComprehensiveResults activePointId={activePointId} onAction={onAction} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <div className="flex-1 p-3 flex flex-col gap-3 overflow-hidden">
          <VideoFeed id="01" title="枪机画面" icon={Scan} src="./枪机画面.png" />
          <VideoFeed id="02" title="球机画面" icon={Activity} src="./球机画面.png" />
        </div>

        <ImageSidebar onImageClick={onImageClick} />
      </div>
    </div>
  ),
);

CenterDashboardRegion.displayName = 'CenterDashboardRegion';
