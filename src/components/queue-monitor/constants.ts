export type QueueVehicleStatus = '卸料中' | '等待';

export interface QueueVehicle {
  plate: string;
  point: string;
  status: QueueVehicleStatus;
}

export interface QueueArea {
  area: string;
  lane: string;
  pointLabel: string;
  vehicles: QueueVehicle[];
}

export const QUEUE_AREAS: QueueArea[] = [
  {
    area: '4#排队区',
    lane: 'B 通道',
    pointLabel: '2#卸料点',
    vehicles: [
      { plate: '冀A·88888', point: '2#', status: '卸料中' },
      { plate: '豫N·3205Q', point: '2#', status: '等待' },
      { plate: '鲁H·7281M', point: '2#', status: '等待' },
      { plate: '晋L·6624T', point: '2#', status: '等待' },
      { plate: '苏C·5178R', point: '2#', status: '等待' },
    ],
  },
  {
    area: '2#排队区',
    lane: 'A 通道',
    pointLabel: '1#卸料点',
    vehicles: [
      { plate: '皖S·9031P', point: '1#', status: '卸料中' },
      { plate: '鄂J·2406W', point: '1#', status: '等待' },
      { plate: '冀B·1567K', point: '1#', status: '等待' },
    ],
  },
  {
    area: '6#排队区',
    lane: 'C 通道',
    pointLabel: '3#卸料点',
    vehicles: [
      { plate: '豫A·5518M', point: '3#', status: '等待' },
      { plate: '鲁B·9187Q', point: '3#', status: '等待' },
    ],
  },
  {
    area: '1#排队区',
    lane: 'A 通道',
    pointLabel: 'A 卸料点',
    vehicles: [{ plate: '津F·3208R', point: 'A', status: '等待' }],
  },
  {
    area: '3#排队区',
    lane: 'B 通道',
    pointLabel: 'B 卸料点',
    vehicles: [],
  },
  {
    area: '5#排队区',
    lane: 'C 通道',
    pointLabel: 'C 卸料点',
    vehicles: [],
  },
  {
    area: '7#排队区',
    lane: 'D 通道',
    pointLabel: '1#卸料点',
    vehicles: [],
  },
  {
    area: '8#排队区',
    lane: 'D 通道',
    pointLabel: '2#卸料点',
    vehicles: [],
  },
];
