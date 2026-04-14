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

const LEVEL_TREEMAP_DATA = [
  { name: '重1', size: 20, fill: CHART_COLORS.brown, valueLabel: '20%' },
  { name: '重2', size: 70, fill: CHART_COLORS.blue, valueLabel: '70%' },
] as const;

const ComprehensiveResults = memo(({ activePointId, onAction }: ComprehensiveResultsProps) => {
  const activePoint = MONITORING_POINTS.find((point) => point.id === activePointId);

  return (
    <div className="px-6 py-3 border-b border-rui-divider/60 bg-rui-surface shrink-0">
      <div className="grid gap-0 xl:grid-cols-[minmax(0,1.28fr)_minmax(240px,0.72fr)] ">
        <section className="min-w-0 xl:border-r xl:border-rui-divider/45 xl:pr-5">
          <div className="flex h-full flex-col">
            <div>
              <div className="grid gap-4 xl:grid-cols-[minmax(270px,1fr)_minmax(200px,0.5fr)] xl:items-stretch">
                <div className="min-w-0">
                  
                  <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_120px] md:items-end">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                    
                    <span className="rounded-[9999px] border border-rui-divider/60 bg-rui-surface px-2.5 py-0.5 text-[10px] font-display font-medium uppercase tracking-[0.18em] text-rui-slate">
                      {activePoint?.name ?? '当前监控点'}
                    </span>
                    
                  </div>
                        <h2 className="text-[clamp(2.45rem,3.2vw,3.95rem)] font-display font-medium leading-none tracking-[-0.065em] text-rui-dark">
                          判级中
                        </h2>
                        <div className="pb-1 text-[13px] font-display font-medium tracking-[0.08em] text-rui-blue">
                          {BASIC_INFO.plateNumber}
                        </div>
                      </div>
                    </div>
                    <div className="min-w-0 border-l border-rui-divider/45 pl-4">
                      <div className="text-[10px] font-display font-medium uppercase tracking-[0.22em] text-rui-gray">
                        综合厚度
                      </div>
                      <div className="mt-2">
                        <span className="text-[clamp(2.6rem,3vw,3.4rem)] font-display font-medium leading-none tracking-[-0.06em] text-rui-warning">
                          6
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex h-full flex-col justify-between">
                    

                    <div className="flex h-[110px] gap-2.5 overflow-hidden rounded-[18px] border border-rui-divider/45 bg-rui-surface/65 p-2">
                      {LEVEL_TREEMAP_DATA.map((item) => (
                        <div
                          key={item.name}
                          className="relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[14px] p-3"
                          style={{
                            flex: item.size,
                            backgroundColor: item.fill,
                          }}
                        >
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(17,20,24,0.08)_100%)]" />
                          <div className="relative z-10 text-[11px] font-display font-medium tracking-[0.08em] text-rui-dark">
                            {item.name}
                          </div>
                          <div className="relative z-10 flex items-end justify-between gap-2">
                            <div className="text-[1.45rem] font-display font-medium leading-none tracking-[-0.05em] text-rui-dark">
                              {item.valueLabel}
                            </div>
                            <div className="text-[10px] font-display font-medium uppercase tracking-[0.16em] text-rui-dark/75">
                              等级
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-rui-divider/45 pt-3">
              <div className="grid gap-2.5 lg:grid-cols-3">
                <button
                  onClick={() => onAction('end')}
                  className="btn-pill w-full bg-rui-blue px-4 py-2 text-[13px] text-rui-dark hover:bg-rui-action-blue"
                >
                  <span className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    结束判级
                  </span>
                </button>
                <button
                  onClick={() => onAction('abnormal')}
                  className="btn-pill w-full border-rui-warning/30 bg-rui-warning/10 px-4 py-2 text-[13px] text-rui-warning hover:bg-rui-warning/15"
                >
                  <span className="flex items-center justify-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    异常处理
                  </span>
                </button>
                <button
                  onClick={() => onAction('leave')}
                  className="btn-pill w-full border-rui-divider/60 bg-rui-surface-strong px-4 py-2 text-[13px] text-rui-slate hover:bg-rui-surface-soft"
                >
                  <span className="flex items-center justify-center gap-2">
                    <LogOut className="h-4 w-4" />
                    中途离开
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="min-w-0 border-t border-rui-divider/40 pt-3 xl:border-t-0 xl:pl-5 xl:pt-0">
          <div className="relative h-full min-h-[170px] overflow-hidden">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="translate-x-7 text-[clamp(4rem,7vw,6rem)] font-display font-medium leading-none tracking-[-0.08em] text-rui-pink/15">
                {DEDUCTION_TOTAL.value}
                <span className="ml-1 align-top text-[0.24em] tracking-[0.22em] text-rui-pink/30">
                  {DEDUCTION_TOTAL.unit.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="text-[10px] font-display font-medium uppercase tracking-[0.24em] text-rui-gray">
                智能扣杂雷达
              </div>

              <div className="mt-0.5 flex flex-1 items-center justify-center">
                <div className="h-[160px] w-full max-w-[208px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="54%" outerRadius="66%" data={DEDUCTION_DATA}>
                      <PolarGrid stroke={CHART_COLORS.divider} />
                      <PolarAngleAxis dataKey="name" tick={{ fill: CHART_COLORS.gray, fontSize: 9 }} />
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
          </div>
        </section>
      </div>
    </div>
  );
});

ComprehensiveResults.displayName = 'ComprehensiveResults';

const ImageSidebar = memo(({ onImageClick }: { onImageClick: (slideIdx: number) => void }) => (
  <div className="w-64 border-l border-rui-divider/60 bg-rui-surface flex flex-col shrink-0">
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
          <div className="flex flex-1 min-h-0 items-center justify-center">
            <VideoFeed
              id="01"
              title="枪机画面"
              icon={Scan}
              src="./枪机画面.png"
              className="aspect-video h-full w-auto max-w-full flex-none self-center"
            />
          </div>
          <div className="flex flex-1 min-h-0 items-center justify-center">
            <VideoFeed
              id="02"
              title="球机画面"
              icon={Activity}
              src="./球机画面.png"
              className="aspect-video h-full w-auto max-w-full flex-none self-center"
            />
          </div>
        </div>

        <ImageSidebar onImageClick={onImageClick} />
      </div>
    </div>
  ),
);

CenterDashboardRegion.displayName = 'CenterDashboardRegion';
