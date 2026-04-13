import type {
  AlarmItem,
  DeductionItem,
  GradingData,
  MessagePrompt,
  MonitoringPoint,
} from './types';

export const CHART_COLORS = {
  blue: 'var(--color-rui-blue)',
  actionBlue: 'var(--color-rui-action-blue)',
  teal: 'var(--color-rui-teal)',
  warning: 'var(--color-rui-warning)',
  pink: 'var(--color-rui-pink)',
  brown: 'var(--color-rui-brown)',
  green: 'var(--color-rui-green)',
  divider: 'var(--color-rui-divider)',
  gray: 'var(--color-rui-gray)',
} as const;

export const ALARM_DATA: AlarmItem[] = [
  { id: '1', name: '气罐密封件', system: 1, review: 1, status: 'danger', category: 'seal' },
  { id: '2', name: '箱体密封件', system: 2, review: '-', status: 'danger', category: 'seal' },
  { id: '3', name: '退货件A', system: 0, review: '-', status: 'normal', category: 'return' },
  { id: '4', name: '拆车件密封件', system: 0, review: '-', status: 'normal', category: 'seal' },
  { id: '5', name: '阀门密封件', system: 0, review: '-', status: 'normal', category: 'seal' },
  { id: '6', name: '退货件B', system: 5, review: '-', status: 'danger', category: 'return' },
];

export const PROMPT_MESSAGES: MessagePrompt[] = [
  { id: '1', time: '23:34:23', content: '触发“扣杂量超标”退货提醒', type: 'danger' },
  { id: '2', time: '23:34:23', content: '表层区域计算成功！！！', type: 'info' },
  { id: '3', time: '23:34:23', content: '触发“扣杂量超标”退货提醒', type: 'danger' },
];

export const THICKNESS_DATA: GradingData[] = [
  {
    name: '6-10mm',
    value: 50,
    color: CHART_COLORS.blue,
    subItems: [
      { name: '大圆管', value: 24.5 },
      { name: '大方管', value: 25.5 },
    ],
  },
  {
    name: '3-6mm',
    value: 30,
    color: CHART_COLORS.actionBlue,
    subItems: [
      { name: '电机壳', value: 10 },
      { name: '镀锌板', value: 15 },
      { name: '皮带轮', value: 5 },
    ],
  },
  {
    name: '1-3mm',
    value: 15,
    color: CHART_COLORS.teal,
    subItems: [
      { name: '小车车架', value: 5 },
      { name: '前后桥壳', value: 3 },
      { name: '减震器', value: 2 },
      { name: '两轮车车圈', value: 5 },
    ],
  },
  {
    name: '0-1mm',
    value: 5,
    color: CHART_COLORS.warning,
    subItems: [
      { name: '钢丝', value: 3 },
      { name: '广告牌', value: 2 },
    ],
  },
];

export const MATERIAL_DATA: GradingData[] = [
  { name: '钢筋类', value: 40.5, color: CHART_COLORS.blue },
  { name: '边角料', value: 29.5, color: CHART_COLORS.actionBlue },
  { name: '破碎料', value: 10, color: CHART_COLORS.teal },
  { name: '拆车件', value: 10, color: CHART_COLORS.warning },
  { name: '压块', value: 5, color: CHART_COLORS.pink },
  { name: '钢屑', value: 5, color: CHART_COLORS.brown },
  { name: '特级料', value: 0, color: CHART_COLORS.green },
  { name: '重废1', value: 0, color: CHART_COLORS.blue },
  { name: '重废2', value: 0, color: CHART_COLORS.actionBlue },
  { name: '中废1', value: 0, color: CHART_COLORS.teal },
  { name: '中废2', value: 0, color: CHART_COLORS.warning },
  { name: '中废3', value: 0, color: CHART_COLORS.pink },
  { name: '轻废1', value: 0, color: CHART_COLORS.brown },
  { name: '轻废2', value: 0, color: CHART_COLORS.green },
  { name: '轻废3', value: 0, color: CHART_COLORS.blue },
  { name: '轻薄4', value: 0, color: CHART_COLORS.actionBlue },
];

export const DEDUCTION_DATA: DeductionItem[] = [
  { name: '基础扣杂', value: 1.2, unit: 'kg' },
  { name: '碎渣扣杂', value: 45, unit: 'kg' },
  { name: '土杂扣杂', value: 12, unit: 'kg' },
  { name: '油污扣杂', value: 0.1, unit: 'kg' },
  { name: '锈蚀扣杂', value: 0.2, unit: 'kg' },
  { name: '水杂扣杂', value: 0.4, unit: 'kg' },
];

export const DEDUCTION_TOTAL = {
  value: 146,
  unit: 'kg',
};

export const GALLERY_DATA = [
  {
    id: 'slide-1',
    images: [
      'https://picsum.photos/seed/scrap_1/800/600',
      'https://picsum.photos/seed/scrap_2/800/600',
      'https://picsum.photos/seed/scrap_3/800/600',
      'https://picsum.photos/seed/scrap_4/800/600',
    ],
  },
  {
    id: 'slide-2',
    images: [
      'https://picsum.photos/seed/scrap_5/800/600',
      'https://picsum.photos/seed/scrap_6/800/600',
      'https://picsum.photos/seed/scrap_7/800/600',
      'https://picsum.photos/seed/scrap_8/800/600',
    ],
  },
  {
    id: 'slide-3',
    images: [
      'https://picsum.photos/seed/scrap_9/800/600',
      'https://picsum.photos/seed/scrap_10/800/600',
      'https://picsum.photos/seed/scrap_11/800/600',
      'https://picsum.photos/seed/scrap_12/800/600',
    ],
  },
];

export const BASIC_INFO = {
  plateNumber: '冀A·88888',
  supplier: '河北某某再生资源有限公司',
  grossWeight: '45.28',
  cargoName: '重废2#',
  grossWeightTime: '2026-03-20 08:15:22',
  swipeTime: '2026-02-10 09:12:34',
  elapsedMinutes: '--',
};

export const MONITORING_POINTS: MonitoringPoint[] = [
  { id: '1', name: '1#监控点', plate: '冀B·1567K', status: 'normal' },
  { id: '2', name: '2#监控点', plate: '豫N·3205Q', status: 'normal' },
  { id: '3', name: '3#监控点', plate: '鲁H·7281M', status: 'normal' },
  { id: '4', name: '4#监控点', plate: '冀A·88888', status: 'warning' },
  { id: '5', name: '5#监控点', plate: '晋L·6624T', status: 'normal' },
  { id: '6', name: '6#监控点', plate: '皖S·9031P', status: 'normal' },
  { id: '7', name: '7#监控点', plate: '苏C·5178X', status: 'normal' },
];
