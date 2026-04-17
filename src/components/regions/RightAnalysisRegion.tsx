import { memo } from 'react';
import { Activity, ArrowDown, ArrowUp, Info, LayoutGrid } from 'lucide-react';

import {
  ANALYSIS_SUMMARY_METRICS,
  BASIC_INFO,
  MATERIAL_DATA,
  THICKNESS_DATA,
} from '../dashboard/constants';
import { SectionHeader } from '../dashboard/common';

const thicknessSummary = THICKNESS_DATA;

const thicknessSubtypeLegend = [
  {
    key: 'type-1',
    label: '料型 1',
    hint: '主料型',
    color: 'var(--color-rui-blue)',
    shellClass: 'border-rui-blue/18 bg-rui-blue/10 text-rui-blue',
  },
  {
    key: 'type-2',
    label: '料型 2',
    hint: '次料型',
    color: 'var(--color-rui-teal)',
    shellClass: 'border-rui-teal/18 bg-rui-teal/10 text-rui-teal',
  },
  {
    key: 'type-3',
    label: '料型 3',
    hint: '其他',
    color: 'var(--color-rui-warning)',
    shellClass: 'border-rui-warning/18 bg-rui-warning/10 text-rui-warning',
  },
] as const;

type ThicknessSubtypeLegend = (typeof thicknessSubtypeLegend)[number];

type ThicknessSubtypeSegment = ThicknessSubtypeLegend & {
  actualName: string;
  totalShare: number;
  rowShare: number;
};

const buildThicknessSegments = (item: (typeof thicknessSummary)[number]): ThicknessSubtypeSegment[] => {
  const subItems = [...(item.subItems ?? [])];
  const leadingItems = subItems.slice(0, 2);
  const mergedTailValue = subItems
    .slice(2)
    .reduce((total, subItem) => total + subItem.value, 0);
  const leadingValue = leadingItems.reduce((total, subItem) => total + subItem.value, 0);
  const remainingValue = Math.max(item.value - leadingValue - mergedTailValue, 0);
  const thirdValue = mergedTailValue + remainingValue;

  const rawSegments = [
    {
      legend: thicknessSubtypeLegend[0],
      actualName: leadingItems[0]?.name ?? '未标注料型',
      totalShare: leadingItems[0]?.value ?? 0,
    },
    {
      legend: thicknessSubtypeLegend[1],
      actualName: leadingItems[1]?.name ?? '未标注料型',
      totalShare: leadingItems[1]?.value ?? 0,
    },
    {
      legend: thicknessSubtypeLegend[2],
      actualName: mergedTailValue > 0 ? '合并料型' : '其他料型',
      totalShare: thirdValue,
    },
  ];

  return rawSegments
    .filter((segment) => segment.totalShare > 0)
    .map((segment) => ({
      ...segment.legend,
      actualName: segment.actualName,
      totalShare: segment.totalShare,
      rowShare: item.value > 0 ? (segment.totalShare / item.value) * 100 : 0,
    }));
};

const thicknessStackRows = thicknessSummary.map((item) => ({
  ...item,
  segments: buildThicknessSegments(item),
}));

const positiveMaterialData = MATERIAL_DATA
  .filter((item) => item.value > 0)
  .sort((a, b) => b.value - a.value);

const materialTopLimit = 8;
const materialTreemapData = [
  ...positiveMaterialData.slice(0, materialTopLimit).map((item, index) => ({
    ...item,
    rank: index + 1,
    isOther: false,
  })),
  ...(() => {
    const otherValue = positiveMaterialData
      .slice(materialTopLimit)
      .reduce((total, item) => total + item.value, 0);

    if (otherValue <= 0) {
      return [];
    }

    return [{
      name: '其他',
      value: otherValue,
      color: 'var(--color-rui-divider-strong)',
      rank: materialTopLimit + 1,
      isOther: true,
    }];
  })(),
];

const topThreeShare = materialTreemapData
  .slice(0, 3)
  .reduce((total, item) => total + item.value, 0);

type MaterialTreemapItem = (typeof materialTreemapData)[number];

interface TreemapRect extends MaterialTreemapItem {
  x: number;
  y: number;
  width: number;
  height: number;
}

const getTotalValue = (items: MaterialTreemapItem[]) => (
  items.reduce((total, item) => total + item.value, 0)
);

const splitNearHalf = (items: MaterialTreemapItem[]) => {
  const total = getTotalValue(items);
  let runningTotal = 0;
  let splitIndex = 1;
  let closestGap = Number.POSITIVE_INFINITY;

  for (let index = 1; index < items.length; index += 1) {
    runningTotal += items[index - 1].value;
    const gap = Math.abs(total / 2 - runningTotal);

    if (gap < closestGap) {
      closestGap = gap;
      splitIndex = index;
    }
  }

  return [
    items.slice(0, splitIndex),
    items.slice(splitIndex),
  ] as const;
};

const buildTreemapLayout = (
  items: MaterialTreemapItem[],
  x: number,
  y: number,
  width: number,
  height: number,
): TreemapRect[] => {
  if (items.length === 0) {
    return [];
  }

  if (items.length === 1) {
    return [{ ...items[0], x, y, width, height }];
  }

  const total = getTotalValue(items);
  const [primaryItems, secondaryItems] = splitNearHalf(items);
  const primaryTotal = getTotalValue(primaryItems);
  const primaryRatio = total > 0 ? primaryTotal / total : 0;

  if (width >= height) {
    const primaryWidth = width * primaryRatio;

    return [
      ...buildTreemapLayout(primaryItems, x, y, primaryWidth, height),
      ...buildTreemapLayout(secondaryItems, x + primaryWidth, y, width - primaryWidth, height),
    ];
  }

  const primaryHeight = height * primaryRatio;

  return [
    ...buildTreemapLayout(primaryItems, x, y, width, primaryHeight),
    ...buildTreemapLayout(secondaryItems, x, y + primaryHeight, width, height - primaryHeight),
  ];
};

const materialTreemapLayout = buildTreemapLayout(materialTreemapData, 0, 0, 100, 100);

const metricToneClassMap = {
  teal: {
    shell: 'border-rui-teal/30 bg-rui-surface',
    accent: 'text-rui-teal',
    muted: 'text-rui-teal/78',
    track: 'bg-rui-teal/10',
    fill: 'var(--color-rui-teal)',
  },
  blue: {
    shell: 'border-rui-blue/30 bg-rui-surface',
    accent: 'text-rui-blue',
    muted: 'text-rui-blue/78',
    track: 'bg-rui-blue/10',
    fill: 'var(--color-rui-blue)',
  },
} as const;

const PredictionMetricCard = memo(
  ({ metric }: { metric: (typeof ANALYSIS_SUMMARY_METRICS)[number] }) => {
    const toneClasses = metricToneClassMap[metric.tone];
    const DirectionIcon = metric.direction === 'up' ? ArrowUp : ArrowDown;

    return (
      <div className={`rounded-[18px] border px-2.5 py-1 ${toneClasses.shell}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate text-[9px] font-display font-medium tracking-[0.08em] text-rui-gray">
              {metric.title}
            </div>
            <div className={`mt-0.5 whitespace-nowrap font-display font-medium leading-none tracking-[-0.07em] ${toneClasses.accent} text-[25px]`}>
              {metric.value}
              <span className="ml-1 text-[0.34em] tracking-[0.04em]">{metric.unit}</span>
            </div>
          </div>
          <div className={`mt-0.5 rounded-[9999px] border px-1.5 py-0.5 text-[7px] font-display font-medium tracking-[0.1em] ${toneClasses.accent} ${toneClasses.track}`}>
            预测
          </div>
        </div>

        <div className={`mt-1 h-1.5 overflow-hidden rounded-[9999px] ${toneClasses.track}`}>
          <div
            className="h-full rounded-[9999px]"
            style={{ width: `${metric.progress}%`, backgroundColor: toneClasses.fill }}
          />
        </div>

        <div className="mt-[3px] flex items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[8px] font-display font-medium tracking-[0.04em] text-rui-gray">
              {metric.comparisonLabel}
            </span>
            <span className="ml-1 text-[8px] font-display font-medium tracking-[0.02em] text-rui-slate">
              {metric.comparisonValue}
            </span>
          </div>
          <div className={`flex shrink-0 items-center gap-0.5 whitespace-nowrap text-[8px] font-display font-medium tracking-[0.02em] ${toneClasses.accent}`}>
            <DirectionIcon className="h-2.5 w-2.5" />
            <span>{metric.delta}</span>
          </div>
        </div>
      </div>
    );
  },
);

PredictionMetricCard.displayName = 'PredictionMetricCard';

const ThicknessCompositionPanel = memo(() => (
  <div className="bg-rui-surface-strong p-2 rounded-[15px] border border-rui-divider/60 flex min-h-0 flex-col overflow-hidden">
    <div className="mb-1 flex items-center gap-2 px-1">
      <div className="flex h-6 w-6 items-center justify-center rounded-[9px] bg-rui-surface border border-rui-divider/60 text-rui-slate">
        <Activity className="h-3.5 w-3.5" />
      </div>
      <h3 className="text-[12px] font-display font-medium tracking-tight text-rui-slate">
        厚度占比
      </h3>
      <div className="ml-auto flex items-center gap-1">
        {thicknessSubtypeLegend.map((item) => (
          <div
            key={item.key}
            className={`flex items-center gap-1 rounded-[9999px] border px-1.5 py-0.5 ${item.shellClass}`}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[8px] font-display font-medium leading-none whitespace-nowrap">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>

    <div className="flex-1 min-h-0 rounded-[16px] border border-rui-divider/60 bg-rui-surface px-1.5 py-1.5">
      <div className="grid h-full min-w-0 grid-rows-4 gap-[5px]">
        {thicknessStackRows.map((item) => (
          <div key={item.name} className="grid h-full grid-cols-[2.2rem_2.4rem_minmax(0,1fr)] items-center gap-1.5">
            <div className="text-[11px] font-display font-medium leading-none tracking-[-0.05em] text-rui-dark tabular-nums">
              {item.value}%
            </div>
            <div className="text-[7px] font-display font-medium uppercase tracking-[0.12em] text-rui-gray">
              {item.name}
            </div>

            <div className="relative h-full py-[1px]">
              <div
                className="absolute inset-y-0 left-0 rounded-[9999px] bg-[linear-gradient(90deg,rgba(244,244,244,0.03),transparent)]"
                style={{ width: `${item.value}%` }}
              />
              <div className="relative flex h-full rounded-[9999px] border border-rui-divider/50 bg-rui-surface-soft p-[2px]">
                {item.segments.map((segment, index) => (
                  <div
                    key={`${item.name}-${segment.key}`}
                    className={`group/segment relative flex h-full min-w-[0.45rem] items-center justify-center ${index === 0 ? 'rounded-l-[9999px]' : ''} ${index === item.segments.length - 1 ? 'rounded-r-[9999px]' : ''}`}
                    style={{
                      width: `${segment.rowShare}%`,
                      background: `linear-gradient(135deg, ${segment.color}, color-mix(in srgb, ${segment.color} 72%, var(--color-rui-surface)))`,
                    }}
                    title={`${item.name} ${segment.label} ${segment.actualName}｜行内 ${segment.rowShare.toFixed(1)}%｜总占比 ${segment.totalShare.toFixed(1)}%`}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,244,244,0.18),transparent_45%)]" />
                    <div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden w-max min-w-[8.25rem] max-w-[10rem] -translate-x-1/2 -translate-y-[calc(100%+0.45rem)] rounded-[12px] border border-rui-divider/60 bg-rui-surface px-2 py-1.5 text-left group-hover/segment:block">
                      <div className="text-[8px] font-display font-medium uppercase tracking-[0.12em] text-rui-gray">
                        {item.name}
                      </div>
                      <div className="mt-1 text-[10px] font-display font-medium text-rui-dark">
                        {segment.label} · {segment.actualName}
                      </div>
                      <div className="mt-1 flex items-center justify-between gap-3 text-[9px] font-display font-medium tabular-nums">
                        <span className="text-rui-slate">行内 {segment.rowShare.toFixed(1)}%</span>
                        <span className="text-rui-dark">总占比 {segment.totalShare.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
));

ThicknessCompositionPanel.displayName = 'ThicknessCompositionPanel';

const MaterialTreemapPanel = memo(() => (
  <div className="bg-rui-surface-strong p-2.5 rounded-[15px] border border-rui-divider/60 flex min-h-0 flex-col">
    <div className="-mb-0.5">
      <SectionHeader
        title="料型占比"
        icon={LayoutGrid}
        badge={(
          <span className="rounded-[9999px] border border-rui-warning/25 bg-rui-warning/10 px-2 py-0.5 text-[9px] font-display font-medium text-rui-warning tabular-nums">
            TOP3 {topThreeShare}%
          </span>
        )}
      />
    </div>

    <div className="relative mt-0.5 min-h-0 flex-1 overflow-hidden rounded-[15px] border border-rui-divider/60 bg-rui-surface p-1">
      <div className="relative h-full w-full">
        {materialTreemapLayout.map((item) => {
          const canShowFullLabel = item.width > 20 && item.height > 18;
          const canShowCompactLabel = item.width > 11 && item.height > 12;
          const isTopRank = item.rank <= 3;
          const color = item.isOther
            ? 'var(--color-rui-divider-strong)'
            : item.color;

          return (
            <div
              key={item.name}
              className="absolute overflow-hidden rounded-[10px] border border-rui-surface/70"
              style={{
                left: `calc(${item.x}% + 2px)`,
                top: `calc(${item.y}% + 2px)`,
                width: `calc(${item.width}% - 4px)`,
                height: `calc(${item.height}% - 4px)`,
                background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 72%, var(--color-rui-surface)))`,
                opacity: isTopRank ? 1 : 0.76,
              }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,244,244,0.18),transparent_42%)]" />
              <div className="relative z-10 flex h-full flex-col justify-between p-2">
                {canShowFullLabel ? (
                  <>
                    <span className="min-w-0 truncate text-[10px] font-display font-medium tracking-wide text-rui-white">
                      {item.name}
                    </span>
                    <span className="text-[17px] font-display font-medium leading-none tracking-[-0.06em] text-rui-white tabular-nums">
                      {item.value}%
                    </span>
                  </>
                ) : canShowCompactLabel ? (
                  <div className="flex h-full items-center justify-center text-[9px] font-display font-medium text-rui-white tabular-nums">
                    {item.value}%
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
));

MaterialTreemapPanel.displayName = 'MaterialTreemapPanel';

const AnalysisPanel = memo(
  () => (
  <div className="col-span-3 bg-rui-surface px-3 py-1.5 flex flex-col border-l border-rui-divider/60 min-h-0 overflow-hidden">
    <div className="mb-1 grid shrink-0 grid-cols-2 gap-1.5">
      {ANALYSIS_SUMMARY_METRICS.map((metric) => (
        <PredictionMetricCard key={metric.id} metric={metric} />
      ))}
    </div>

    <div className="mb-1.5 rounded-[15px] border border-rui-divider/60 bg-rui-surface-strong p-2">
      <div className="mb-1.5 flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-rui-surface border border-rui-divider/60 text-rui-slate">
          <Info className="h-3.5 w-3.5" />
        </div>
        <span className="text-[12px] font-display font-medium tracking-tight text-rui-slate">
          基础判级信息
        </span>
      </div>
      <div className="grid grid-cols-3 gap-x-3 gap-y-1.5">
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

        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">毛重</div>
          <div className="flex items-baseline gap-1">
            <span className="text-[13px] font-display font-medium text-rui-warning">
              {BASIC_INFO.grossWeight}
            </span>
            <span className="text-[9px] font-display font-medium text-rui-warning">t</span>
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">毛重时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums tracking-tight text-rui-dark">
            {BASIC_INFO.grossWeightTime.split(' ')[1]}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">刷卡时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums tracking-tight text-rui-warning">
            {BASIC_INFO.swipeTime.split(' ')[1]}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[9px] text-rui-gray font-display uppercase tracking-[0.16em]">记过时间</div>
          <div className="text-[10px] font-display font-medium tabular-nums tracking-tight text-rui-dark">
            {BASIC_INFO.elapsedMinutes}
          </div>
        </div>
      </div>
    </div>

    <div className="flex-1 min-h-0 grid grid-rows-[minmax(0,0.72fr)_minmax(0,1.48fr)] gap-1.5">
      <ThicknessCompositionPanel />
      <MaterialTreemapPanel />
    </div>
  </div>
));

AnalysisPanel.displayName = 'AnalysisPanel';

export const RightAnalysisRegion = memo(() => <AnalysisPanel />);

RightAnalysisRegion.displayName = 'RightAnalysisRegion';
