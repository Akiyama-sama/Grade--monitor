import { memo } from 'react';

import { QUEUE_AREAS, type QueueArea, type QueueVehicle } from './constants';

const PANEL_CLASS =
  'rounded-[20px] border border-white/10 bg-[#191c1f]';

function sortVehicles(vehicles: QueueVehicle[]) {
  return [...vehicles].sort((a, b) => {
    const priority = (item: QueueVehicle) => (item.status === '卸料中' ? 0 : 1);
    return priority(a) - priority(b);
  });
}

function sortAreas(areas: QueueArea[]) {
  return [...areas].sort((a, b) => {
    const activeA = a.vehicles.length > 0 ? 0 : 1;
    const activeB = b.vehicles.length > 0 ? 0 : 1;

    if (activeA !== activeB) {
      return activeA - activeB;
    }

    const unloadingA = a.vehicles.some((vehicle) => vehicle.status === '卸料中') ? 0 : 1;
    const unloadingB = b.vehicles.some((vehicle) => vehicle.status === '卸料中') ? 0 : 1;

    if (unloadingA !== unloadingB) {
      return unloadingA - unloadingB;
    }

    return b.vehicles.length - a.vehicles.length;
  });
}

const sortedAreas = sortAreas(QUEUE_AREAS);
const totalQueued = QUEUE_AREAS.reduce((sum, area) => sum + area.vehicles.length, 0);
const loadingCount = QUEUE_AREAS.reduce(
  (sum, area) => sum + area.vehicles.filter((vehicle) => vehicle.status === '卸料中').length,
  0,
);
const waitingCount = totalQueued - loadingCount;
const activeAreas = QUEUE_AREAS.filter((area) => area.vehicles.length > 0).length;
const idleAreas = QUEUE_AREAS.length - activeAreas;
const rankedAreas = [...QUEUE_AREAS].sort((a, b) => b.vehicles.length - a.vehicles.length).slice(0, 4);
const maxVehicles = Math.max(...rankedAreas.map((area) => area.vehicles.length), 1);
const visibleColumns = Math.min(Math.max(sortedAreas.length, 1), 4);
const loadingPct = totalQueued ? (loadingCount / totalQueued) * 100 : 0;
const waitingPct = totalQueued ? (waitingCount / totalQueued) * 100 : 0;
const activeAreaPct = (activeAreas / QUEUE_AREAS.length) * 100;
const idleAreaPct = 100 - activeAreaPct;
const idleLinePct = totalQueued ? (idleAreas / QUEUE_AREAS.length) * 100 : 100;

const StatusLine = memo(
  ({
    label,
    count,
    width,
    toneClass,
  }: {
    label: string;
    count: number;
    width: number;
    toneClass: string;
  }) => (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
      <div>
        <div className="text-[9px] text-[#8d969e]">{label}</div>
        <div className="mt-[3px] h-[5px] overflow-hidden rounded-[9999px] bg-white/5">
          <div className={`h-full rounded-[9999px] ${toneClass}`} style={{ width: `${width}%` }} />
        </div>
      </div>
      <div className="font-display text-[18px] leading-none tracking-[-0.03em] text-[#ffffff]">
        {count}
      </div>
    </div>
  ),
);

StatusLine.displayName = 'StatusLine';

const OverviewPanel = memo(() => (
  <section className="grid gap-3 px-4 py-3 xl:grid-cols-[minmax(250px,1.05fr)_minmax(320px,1.3fr)_minmax(320px,1.35fr)]">
    <article className={`${PANEL_CLASS} flex flex-col justify-between gap-2.5 p-3.5`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="font-display text-[10px] font-medium uppercase tracking-[0.16em] text-[#8d969e]">
          排队区总览
        </div>
        <div className="text-[7px] uppercase tracking-[0.14em] text-[#8d969e]">Single Screen</div>
      </div>

      <div className="flex flex-wrap items-baseline gap-2">
        <div className="font-display text-[40px] font-medium leading-[0.9] tracking-[-0.05em] text-[#ffffff]">
          {totalQueued}
        </div>
        <div className="text-[10px] uppercase tracking-[0.12em] text-[#8d969e]">排队车次</div>
      </div>

      <div className="flex h-2.5 overflow-hidden rounded-[9999px] bg-white/4">
        <span className="h-full bg-rui-blue" style={{ width: `${activeAreaPct}%` }} />
        <span className="h-full bg-white/20" style={{ width: `${idleAreaPct}%` }} />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 text-[9px] text-[#c9c9cd]">
        <div className="inline-flex items-center gap-1.5">
          <span className="h-[7px] w-[7px] rounded-[2px] bg-[#494fdf]" />
          <span>有车排队 {activeAreas}</span>
        </div>
        <div className="inline-flex items-center gap-1.5">
          <span className="h-[7px] w-[7px] rounded-[2px] bg-white/25" />
          <span>空闲排队区 {idleAreas}</span>
        </div>
      </div>
    </article>

    <article className={`${PANEL_CLASS} flex flex-col gap-3 p-3.5`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="font-display text-[10px] font-medium uppercase tracking-[0.16em] text-[#8d969e]">
          车次状态分布
        </div>
        <div className="text-[7px] uppercase tracking-[0.14em] text-[#8d969e]">卸料中优先</div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-2.5">
        <div className="grid gap-1.5">
          <StatusLine label="卸料中车次" count={loadingCount} width={loadingPct} toneClass="bg-[#00a87e]" />
          <StatusLine label="等待车次" count={waitingCount} width={waitingPct} toneClass="bg-[#ec7e00]" />
          <StatusLine label="空闲排队区" count={idleAreas} width={idleLinePct} toneClass="bg-white/25" />
        </div>

        <div
          className="relative grid h-[76px] w-[76px] place-items-center rounded-full"
          style={{
            background: `conic-gradient(#00a87e 0 ${loadingPct}%, #ec7e00 ${loadingPct}% ${loadingPct + waitingPct}%, rgba(255,255,255,0.16) ${loadingPct + waitingPct}% 100%)`,
          }}
        >
          <div className="absolute inset-[15px] rounded-full border border-white/8 bg-[#191c1f]" />
          <div className="relative z-10 text-center">
            <div className="font-display text-base leading-none tracking-[-0.03em] text-[#ffffff]">
              {activeAreas}
            </div>
            <div className="mt-0.5 text-[6px] uppercase tracking-[0.16em] text-[#8d969e]">
              活跃排队区
            </div>
          </div>
        </div>
      </div>
    </article>

    <article className={`${PANEL_CLASS} flex flex-col gap-3 p-3.5`}>
      <div className="flex items-center justify-between gap-2.5">
        <div className="font-display text-[10px] font-medium uppercase tracking-[0.16em] text-[#8d969e]">
          排队区热度排序
        </div>
        <div className="text-[7px] uppercase tracking-[0.14em] text-[#8d969e]">Busy First</div>
      </div>

      <div className="grid gap-1.5">
        {rankedAreas.map((area) => (
          <div key={area.area} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
            <div className="text-[9px] text-[#c9c9cd]">{area.area}</div>
            <div className="h-[7px] overflow-hidden rounded-[9999px] bg-white/5">
              <span
                className="block h-full rounded-[9999px] bg-[#494fdf]"
                style={{ width: `${(area.vehicles.length / maxVehicles) * 100}%` }}
              />
            </div>
            <div className="font-mono text-[9px] text-[#c9c9cd]">{area.vehicles.length} 台</div>
          </div>
        ))}
      </div>
    </article>
  </section>
));

OverviewPanel.displayName = 'OverviewPanel';

const QueueZoneCard = memo(({ area }: { area: QueueArea }) => {
  const sortedVehicles = sortVehicles(area.vehicles);
  const lead = sortedVehicles[0];
  const waitingVehicles = sortedVehicles.slice(lead?.status === '卸料中' ? 1 : 0);
  const waitingVehiclesCount = sortedVehicles.filter((vehicle) => vehicle.status === '等待').length;
  const loadingVehiclesCount = sortedVehicles.filter((vehicle) => vehicle.status === '卸料中').length;
  const isIdle = area.vehicles.length === 0;
  const isLoading = !isIdle && loadingVehiclesCount > 0;

  const zoneBackground = isIdle
    ? 'bg-[#191c1f]'
    : isLoading
      ? 'bg-[#191c1f]'
      : 'bg-[#191c1f]';

  return (
    <article
      className={`flex h-full min-h-0 flex-col gap-3.5 overflow-hidden rounded-[20px] border p-3.5 ${zoneBackground} ${
        isLoading ? 'border-[#00a87e]/18' : isIdle ? 'border-white/10' : 'border-[#494fdf]/18'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="font-display text-2xl font-medium leading-none tracking-[-0.04em] text-[#ffffff]">
              {area.area}
            </div>
            <div className="whitespace-nowrap text-[9px] uppercase tracking-[0.16em] text-[#8d969e]">
              {area.lane}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {isIdle && (
              <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-white/10 bg-white/5 px-3 text-[9px] uppercase tracking-[0.08em] text-[#8d969e]">
                空闲
              </span>
            )}
            {loadingVehiclesCount > 0 && (
              <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-[#00a87e]/22 bg-[#00a87e]/10 px-3 text-[9px] uppercase tracking-[0.08em] text-[#00a87e]">
                卸料中 {loadingVehiclesCount}
              </span>
            )}
            {waitingVehiclesCount > 0 && (
              <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-[#ec7e00]/22 bg-[#ec7e00]/10 px-3 text-[9px] uppercase tracking-[0.08em] text-[#ec7e00]">
                等待 {waitingVehiclesCount}
              </span>
            )}
          </div>
        </div>

        <div className="whitespace-nowrap text-right font-display text-[34px] leading-[0.92] tracking-[-0.04em] text-[#ffffff]">
          {area.vehicles.length}
          <span className="mt-[5px] block font-sans text-[8px] uppercase tracking-[0.16em] text-[#8d969e]">
            当前排队车次
          </span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {isIdle ? (
          <div className="flex flex-1 flex-col justify-center gap-2 rounded-[18px] border border-dashed border-white/10 bg-[#111418] p-4">
            <div className="font-display text-[22px] leading-none tracking-[-0.04em] text-[#c9c9cd]">
              {area.area} 当前无排队车次
            </div>
            <div className="text-[10px] leading-5 text-[#8d969e]">
              当前卸料点：{area.pointLabel}
              <br />
              该排队区后置展示，但仍保留独立监控模块。
            </div>
          </div>
        ) : (
          <>
            {lead && (
              <div
                className={`flex items-center justify-between gap-3 rounded-[18px] border p-3 ${
                  lead.status === '卸料中'
                    ? 'border-[#00a87e]/22 bg-[#111418]'
                    : 'border-white/10 bg-[#111418]'
                }`}
              >
                <div className="flex min-w-0 flex-col gap-2">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <div className="font-display text-[28px] font-medium leading-[0.95] tracking-[-0.05em] text-[#ffffff]">
                      {lead.plate}
                    </div>
                    <span
                      className={`inline-flex min-h-7 items-center rounded-[9999px] border px-3 text-[9px] uppercase tracking-[0.08em] ${
                        lead.status === '卸料中'
                          ? 'border-[#00a87e]/22 bg-[#00a87e]/10 text-[#00a87e]'
                          : 'border-[#ec7e00]/22 bg-[#ec7e00]/10 text-[#ec7e00]'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-white/10 bg-white/5 px-3 text-[9px] uppercase tracking-[0.08em] text-[#c9c9cd]">
                      当前卸料点 {lead.point}
                    </span>
                    <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-white/10 bg-white/5 px-3 text-[9px] uppercase tracking-[0.08em] text-[#c9c9cd]">
                      队首车次
                    </span>
                  </div>
                </div>
              </div>
            )}

            {waitingVehicles.length > 0 && (
              <div className="relative flex min-h-0 flex-wrap content-start gap-2 pl-4 before:absolute before:bottom-1 before:left-[3px] before:top-1 before:w-0.5 before:rounded-[999px] before:bg-[#494fdf]/24">
                {waitingVehicles.map((vehicle) => (
                  <div
                    key={`${area.area}-${vehicle.plate}`}
                    className="flex min-w-0 flex-1 basis-[170px] items-center gap-2.5 rounded-2xl border border-white/10 bg-[#111418] px-3 py-[9px]"
                  >
                    <div className="font-display text-lg leading-none tracking-[-0.04em] text-[#ffffff]">
                      {vehicle.plate}
                    </div>
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-[#ec7e00]/22 bg-[#ec7e00]/10 px-3 text-[9px] uppercase tracking-[0.08em] text-[#ec7e00]">
                        等待
                      </span>
                      <span className="inline-flex min-h-7 items-center rounded-[9999px] border border-white/10 bg-white/5 px-3 text-[9px] uppercase tracking-[0.08em] text-[#c9c9cd]">
                        卸料点 {vehicle.point}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </article>
  );
});

QueueZoneCard.displayName = 'QueueZoneCard';

export const QueueMonitorScreen = memo(() => (
  <main className="flex-1 overflow-hidden bg-[#191c1f] text-[#ffffff]">
    <div className="grid h-full min-h-0 grid-rows-[170px_1fr] gap-px bg-white/5 xl:grid-rows-[170px_1fr]">
      <OverviewPanel />

      <section className="min-h-0 overflow-x-auto overflow-y-hidden px-[18px] pb-[18px] pt-4 [scrollbar-color:#2a3038_transparent] [scrollbar-width:thin]">
        <div
          className="grid h-full min-h-full w-max items-stretch gap-[14px]"
          style={{
            gridAutoFlow: 'column',
            gridAutoColumns: `calc((100vw - 36px - ${14 * (visibleColumns - 1)}px) / ${visibleColumns})`,
          }}
        >
          {sortedAreas.map((area) => (
            <QueueZoneCard key={area.area} area={area} />
          ))}
        </div>
      </section>
    </div>
  </main>
));

QueueMonitorScreen.displayName = 'QueueMonitorScreen';
