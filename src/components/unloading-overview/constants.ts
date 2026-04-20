export type UnloadingPointStatus = 'grading' | 'completed' | 'idle';

export interface UnloadingPointCardData {
  id: string;
  pointName: string;
  plate: string;
  status: UnloadingPointStatus;
  startedAt: string;
  thicknessScore: number;
  deductionWeight: number;
  imageSrc?: string;
  isLive: boolean;
}

export const UNLOADING_POINT_CARDS: UnloadingPointCardData[] = [
  {
    id: '8',
    pointName: '8# 卸料点',
    plate: '皖H6541L',
    status: 'grading',
    startedAt: '14:38:55',
    thicknessScore: 8,
    deductionWeight: 71.6,
    imageSrc: './枪机画面.png',
    isLive: true,
  },
  {
    id: '1',
    pointName: '1# 卸料点',
    plate: '京A7362K',
    status: 'grading',
    startedAt: '14:32:15',
    thicknessScore: 7,
    deductionWeight: 184.9,
    imageSrc: './枪机画面.png',
    isLive: true,
  },
  {
    id: '2',
    pointName: '2# 卸料点',
    plate: '冀B8921M',
    status: 'grading',
    startedAt: '14:28:03',
    thicknessScore: 6,
    deductionWeight: 39.0,
    imageSrc: './枪机画面.png',
    isLive: true,
  },
  {
    id: '4',
    pointName: '4# 卸料点',
    plate: '鲁D3278F',
    status: 'grading',
    startedAt: '14:15:42',
    thicknessScore: 4,
    deductionWeight: 286.0,
    imageSrc: './枪机画面.png',
    isLive: true,
  },
  {
    id: '6',
    pointName: '6# 卸料点',
    plate: '苏F9283K',
    status: 'completed',
    startedAt: '13:58:27',
    thicknessScore: 9,
    deductionWeight: 52.4,
    imageSrc: './球机画面.png',
    isLive: true,
  },
  {
    id: '3',
    pointName: '3# 卸料点',
    plate: '津C5109D',
    status: 'idle',
    startedAt: '卸料点空闲中',
    thicknessScore: 5,
    deductionWeight: 0,
    isLive: false,
  },
  {
    id: '5',
    pointName: '5# 卸料点',
    plate: '豫E1847H',
    status: 'idle',
    startedAt: '卸料点空闲中',
    thicknessScore: 3,
    deductionWeight: 0,
    isLive: false,
  },
  {
    id: '7',
    pointName: '7# 卸料点',
    plate: '浙G1072J',
    status: 'idle',
    startedAt: '卸料点空闲中',
    thicknessScore: 2,
    deductionWeight: 0,
    isLive: false,
  },
];

export const UNLOADING_OVERVIEW_SUMMARY = {
  total: UNLOADING_POINT_CARDS.length,
  active: UNLOADING_POINT_CARDS.filter((item) => item.status !== 'idle').length,
  idle: UNLOADING_POINT_CARDS.filter((item) => item.status === 'idle').length,
};
