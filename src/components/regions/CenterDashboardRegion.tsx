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

const ComprehensiveResults = memo(({ activePointId, onAction }: ComprehensiveResultsProps) => {
  const activePoint = MONITORING_POINTS.find((point) => point.id === activePointId);

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
              <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">
                智能级别判断
              </div>
              <div className="flex items-end justify-between gap-4">
                <div className="flex items-end gap-2">
                  <span className="text-[clamp(2.55rem,3vw,3.65rem)] font-display font-medium leading-none tracking-[-0.06em] text-rui-blue">
                    重2
                  </span>
                  <div className="pb-1 text-[12px] font-sans text-rui-slate">置信度 95%</div>
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
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">
                    智能扣杂雷达
                  </div>
                  <div className="mt-1 text-[12px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    总量与各子项扣杂
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-display font-medium uppercase tracking-[0.22em] text-rui-gray">
                    智能扣杂总量
                  </div>
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
                  <div
                    key={item.name}
                    className="flex items-center justify-between gap-3 rounded-[12px] border border-rui-divider/35 bg-rui-surface-strong/45 px-3 py-2"
                  >
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
