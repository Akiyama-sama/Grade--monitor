import { memo } from 'react';
import { Info, ShieldAlert } from 'lucide-react';

import { PROMPT_MESSAGES } from '../dashboard/constants';
import { InfoStreamItem, PinnedAlert, SectionHeader } from '../dashboard/common';
import type { AlarmItem } from '../dashboard/types';

interface LeftSidebarRegionProps {
  sortedAlarms: AlarmItem[];
}

export const LeftSidebarRegion = memo(({ sortedAlarms }: LeftSidebarRegionProps) => {
  const warningCount = sortedAlarms.filter(
    (item) => item.status === 'danger' || item.status === 'warning' || item.system > 0,
  ).length;
  const hasWarning = warningCount > 0;

  return (
    <div className="col-span-2 bg-rui-surface p-3 flex flex-col border-r border-rui-divider/60 min-h-0">
      <div className="flex-[0.3] flex flex-col min-h-0 mb-3">
        <SectionHeader
          title="报警监测"
          icon={ShieldAlert}
          important
          badge={
            hasWarning ? (
              <div className="rounded-[10px] border border-rui-danger/35 bg-rui-danger/10 px-2 py-[2px] text-[8px] font-display font-medium tracking-tight text-rui-danger">
                {warningCount}项预警
              </div>
            ) : undefined
          }
        />
        <div className="flex-1 overflow-auto pr-1 custom-scrollbar">
          {hasWarning && (
            <div className="sticky top-0 z-10 mb-2 rounded-[12px] border border-rui-danger/35 bg-rui-surface-soft px-3 py-2">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border border-rui-danger/30 bg-rui-danger/12 text-rui-danger">
                  <ShieldAlert className="h-3 w-3" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-display font-medium leading-tight tracking-tight text-rui-danger">
                    检测到报警物！
                  </div>
                  <div className="text-[10px] font-display font-medium leading-tight tracking-tight text-rui-danger">
                    请立即复核
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="rounded-[16px] border border-rui-divider/70 bg-rui-surface-soft p-1">
            <table className="w-full border-separate border-spacing-x-0 border-spacing-y-1 text-left">
              <thead className="bg-rui-surface-strong">
                <tr>
                  <th className="px-3 py-2 text-[8px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    报警物
                  </th>
                  <th className="w-[60px] px-2 py-2 text-center text-[8px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    系统
                  </th>
                  <th className="w-[60px] px-2 py-2 text-center text-[8px] font-display font-medium tracking-[0.08em] text-rui-slate">
                    复核
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedAlarms.map((item, index) => {
                  const isActive = item.status === 'danger' || item.status === 'warning' || item.system > 0;
                  const reviewValue = item.review === 0 ? '0' : item.review || '-';
                  const rowBorderClass = isActive
                    ? 'alarm-border-breathe border-rui-danger/65'
                    : 'border-rui-divider/55';
                  const indicatorClass = isActive
                    ? 'alarm-dot-breathe bg-rui-danger'
                    : 'bg-rui-blue/80';

                  return (
                    <tr key={item.id} className={index === sortedAlarms.length - 1 ? 'last-row' : undefined}>
                      <td
                        className={`rounded-l-[12px] border-y border-l bg-rui-surface px-3 py-1.5 ${rowBorderClass}`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-1.5 w-1.5 rounded-full ${indicatorClass}`} />
                          <span className="text-[11px] font-display font-medium tracking-tight text-rui-dark">
                            {item.name}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`border-y bg-rui-surface px-2 py-1.5 text-center text-[11px] font-display font-medium tabular-nums ${rowBorderClass} ${item.system > 0 ? 'text-rui-danger' : 'text-rui-slate'}`}
                      >
                        {item.system > 0 ? item.system : '-'}
                      </td>
                      <td
                        className={`rounded-r-[12px] border-y border-r bg-rui-surface px-2 py-1.5 text-center text-[11px] font-display font-medium tabular-nums ${rowBorderClass} ${reviewValue !== '-' ? 'text-rui-warning' : 'text-rui-slate'}`}
                      >
                        {reviewValue}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="flex-[0.6] pt-3 border-t border-rui-divider/60 min-h-0 flex flex-col">
        <SectionHeader
          title="实时信息流"
          icon={Info}
          badge={
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[9999px] bg-rui-danger/10 border border-rui-danger/20">
                <div className="w-1 h-1 rounded-full bg-rui-danger animate-pulse" />
                <span className="text-[9px] font-display font-medium text-rui-danger tracking-wider">
                  退货预警提醒
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-1.5 py-0.5 rounded-[9999px] bg-rui-warning/10 border border-rui-warning/20">
                <div className="w-1 h-1 rounded-full bg-rui-warning animate-pulse" />
                <span className="text-[9px] font-display font-medium text-rui-warning tracking-wider">
                  报警物预警提醒
                </span>
              </div>
            </div>
          }
        />
        <div className="flex-1 space-y-1.5 overflow-auto pr-1 custom-scrollbar">
          <PinnedAlert content="触发“扣杂量超标”退货提醒" />
          {PROMPT_MESSAGES.map((msg) => (
            <InfoStreamItem key={msg.id} msg={msg} />
          ))}
        </div>
      </div>
    </div>
  );
});

LeftSidebarRegion.displayName = 'LeftSidebarRegion';
