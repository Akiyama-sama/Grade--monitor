import { memo, type ReactNode } from 'react';
import { CheckCircle2, Clock3, Play, Radio, TimerReset } from 'lucide-react';

import {
  UNLOADING_OVERVIEW_SUMMARY,
  UNLOADING_POINT_CARDS,
  type UnloadingPointCardData,
} from './constants';

const STATUS_META = {
  grading: {
    label: '判级中',
    tone: 'border-[#ec7e00]/30 bg-[#ec7e00]/10 text-[#ec7e00]',
    icon: TimerReset,
  },
  completed: {
    label: '已判级',
    tone: 'border-[#00a87e]/28 bg-[#00a87e]/10 text-[#00a87e]',
    icon: CheckCircle2,
  },
  idle: {
    label: '无判级',
    tone: 'border-white/10 bg-white/5 text-[#8d969e]',
    icon: Clock3,
  },
} as const;

function getThicknessTone(score: number) {
  if (score >= 8) return 'text-[#00a87e] border-[#00a87e]/26';
  if (score >= 5) return 'text-[#494fdf] border-[#494fdf]/26';
  return 'text-[#ec7e00] border-[#ec7e00]/26';
}

function getDeductionRatio(weight: number) {
  return Math.min(100, Math.max(8, (weight / 300) * 100));
}

const MetricPanel = memo(
  ({
    title,
    children,
    subdued = false,
  }: {
    title: string;
    children: ReactNode;
    subdued?: boolean;
  }) => (
    <div
      className={`rounded-[20px] border p-4 ${
        subdued ? 'border-white/8 bg-[#16191d]' : 'border-white/10 bg-[#111418]'
      }`}
    >
      <div className="mb-4 text-[11px] font-display font-medium uppercase tracking-[0.18em] text-[#8d969e]">
        {title}
      </div>
      {children}
    </div>
  ),
);

MetricPanel.displayName = 'MetricPanel';

const UnloadingCard = memo(({ item }: { item: UnloadingPointCardData }) => {
  const statusMeta = STATUS_META[item.status];
  const StatusIcon = statusMeta.icon;
  const thicknessTone = getThicknessTone(item.thicknessScore);
  const isIdle = item.status === 'idle';
  const isCompleted = item.status === 'completed';

  return (
    <article className="flex min-h-0 flex-col overflow-hidden rounded-[20px] border border-white/10 bg-[#191c1f]">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/8 bg-black">
        {item.imageSrc ? (
          <img
            src={item.imageSrc}
            alt={item.pointName}
            className={`h-full w-full object-cover ${isCompleted ? 'opacity-76 grayscale-[0.08]' : ''}`}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-6 bg-[#0e1114] text-[#8d969e]">
            <div className="rounded-[20px] border border-white/10 bg-[#111418] p-4">
              <Play className="h-10 w-10 opacity-45" />
            </div>
            <div className="text-center">
              <div className="text-[28px] font-display font-medium tracking-[-0.04em] text-[#f4f4f4]">
                等待车辆进场
              </div>
              <div className="mt-2 text-sm text-[#8d969e]">枪机视频画面 · 1280×760</div>
            </div>
          </div>
        )}

        <div className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-[9999px] border border-white/10 bg-[rgba(25,28,31,0.88)] px-3 py-1.5 text-[12px] font-display font-medium tracking-[0.08em] text-[#c9c9cd] backdrop-blur-md">
          <span className={`h-2.5 w-2.5 rounded-full ${item.isLive ? 'bg-[#00a87e]' : 'bg-[#8d969e]'}`} />
          {item.isLive ? '实时监控' : '待机状态'}
        </div>

        <div className="absolute bottom-4 left-4 font-mono text-[12px] tracking-[0.12em] text-[#c9c9cd]">
          17:42:25
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="truncate text-[clamp(2rem,2.4vw,2.55rem)] font-display font-medium leading-none tracking-[-0.06em] text-[#ffffff]">
              {item.plate}
            </h2>
            <div className="mt-2 text-[15px] font-display font-medium tracking-[0.06em] text-[#ec7e00]">
              {item.pointName}
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-[9999px] border px-3 py-1.5 text-[12px] font-display font-medium tracking-[0.08em] ${statusMeta.tone}`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusMeta.label}
          </div>
        </div>

        <div className="mt-5 border-t border-white/8 pt-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <div className="text-sm text-[#8d969e]">{isIdle ? '状态说明' : '开始判级'}</div>
            <div className="font-display text-[30px] font-medium leading-none tracking-[-0.05em] text-[#ffffff]">
              {item.startedAt}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 xl:grid-cols-2">
          <MetricPanel title="智能综合厚度" subdued={isIdle}>
            <div className="flex items-center gap-4">
              <div className={`grid h-24 w-24 place-items-center rounded-full border-[10px] ${thicknessTone} bg-[#191c1f]`}>
                <div className="text-center">
                  <div className="font-display text-[34px] font-medium leading-none tracking-[-0.06em]">
                    {item.thicknessScore}
                  </div>
                
                </div>
              </div>
            </div>
          </MetricPanel>

          <MetricPanel title="智能扣杂" subdued={isIdle}>
            <div className="pt-3">
              <div className="h-4 overflow-hidden rounded-[9999px] bg-white/8">
                <div
                  className={`h-full rounded-[9999px] ${isIdle ? 'bg-white/12' : 'bg-[#ec7e00]'}`}
                  style={{ width: `${getDeductionRatio(item.deductionWeight)}%` }}
                />
              </div>
              <div className="mt-4 flex items-end justify-between gap-3">
                <div>
                  <div className="text-sm text-[#8d969e]">扣杂量</div>
                  <div className="mt-1 font-display text-[28px] font-medium leading-none tracking-[-0.05em] text-[#ffffff]">
                    {item.deductionWeight.toFixed(1)}
                    <span className="ml-2 text-sm uppercase tracking-[0.16em] text-[#8d969e]">kg</span>
                  </div>
                </div>
          
              </div>
            </div>
          </MetricPanel>
        </div>
      </div>
    </article>
  );
});

UnloadingCard.displayName = 'UnloadingCard';

const OverviewHeadline = memo(() => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 px-6 py-4">
    <div>
      <div className="text-[11px] font-display font-medium uppercase tracking-[0.22em] text-[#8d969e]">
        卸料点总览
      </div>
      <h1 className="mt-2 text-[clamp(2.2rem,3vw,3.5rem)] font-display font-medium leading-none tracking-[-0.07em] text-[#ffffff]">
        卸料点卡片矩阵
      </h1>
    </div>

    <div className="flex flex-wrap items-center gap-3">
      <div className="rounded-[9999px] border border-white/10 bg-[#111418] px-4 py-2 text-sm text-[#c9c9cd]">
        总数 <span className="ml-2 font-display text-xl text-[#ffffff]">{UNLOADING_OVERVIEW_SUMMARY.total}</span>
      </div>
      <div className="rounded-[9999px] border border-[#00a87e]/22 bg-[#111418] px-4 py-2 text-sm text-[#c9c9cd]">
        活跃 <span className="ml-2 font-display text-xl text-[#00a87e]">{UNLOADING_OVERVIEW_SUMMARY.active}</span>
      </div>
      <div className="rounded-[9999px] border border-white/10 bg-[#111418] px-4 py-2 text-sm text-[#c9c9cd]">
        空闲 <span className="ml-2 font-display text-xl text-[#8d969e]">{UNLOADING_OVERVIEW_SUMMARY.idle}</span>
      </div>
    </div>
  </div>
));

OverviewHeadline.displayName = 'OverviewHeadline';

export const UnloadingOverviewScreen = memo(() => (
  <main className="flex-1 overflow-hidden bg-[#191c1f] text-[#ffffff]">
    <div className="h-full min-h-0 overflow-auto bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]">
      <OverviewHeadline />

      <section className="grid gap-4 p-6 lg:grid-cols-2 xl:grid-cols-3">
        {UNLOADING_POINT_CARDS.map((item) => (
          <UnloadingCard key={item.id} item={item} />
        ))}
      </section>
    </div>
  </main>
));

UnloadingOverviewScreen.displayName = 'UnloadingOverviewScreen';
