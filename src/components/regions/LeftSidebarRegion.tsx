import { memo } from 'react';
import { Info, ShieldAlert } from 'lucide-react';

import { PROMPT_MESSAGES } from '../dashboard/constants';
import { AlarmItemCard, InfoStreamItem, PinnedAlert, SectionHeader } from '../dashboard/common';
import type { AlarmItem } from '../dashboard/types';

interface LeftSidebarRegionProps {
  sortedAlarms: AlarmItem[];
}

export const LeftSidebarRegion = memo(({ sortedAlarms }: LeftSidebarRegionProps) => (
  <div className="col-span-2 bg-rui-surface p-3 flex flex-col border-r border-rui-divider/60 min-h-0">
    <div className="flex-[0.4] flex flex-col min-h-0 mb-3">
      <SectionHeader title="报警监测" icon={ShieldAlert} important />
      <div className="flex-1 overflow-auto pr-1 custom-scrollbar">
        <div className="sticky top-0 z-10 mb-2 rounded-[16px] border border-rui-danger/30 bg-rui-overlay px-2.5 py-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-rui-danger/25 bg-rui-danger/10 text-rui-danger">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-display font-medium tracking-tight text-rui-danger">
                检测到报警物，
              </div>
              <div className="text-[16px] font-display font-medium leading-tight tracking-tight text-rui-danger">
                请立即复核
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          {sortedAlarms.map((item) => (
            <AlarmItemCard key={item.id} item={item} />
          ))}
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
));

LeftSidebarRegion.displayName = 'LeftSidebarRegion';
